-- ============================================================================
-- Tritech — Dummy sales data spread across last 3 years
-- Safe to re-run: guarded by `where not exists`.
-- Requires: at least one product in `products` table.
-- ============================================================================

do $$
declare
  v_count int;
begin
  -- Abort quietly if demo data already seeded
  select count(*) into v_count from public.invoices where invoice_number like 'INV-DEMO-%';
  if v_count > 0 then
    raise notice 'Seed already applied (% demo invoices exist) — skipping', v_count;
    return;
  end if;

  -- Confirm we have products to reference
  select count(*) into v_count from public.products;
  if v_count = 0 then
    raise notice 'No products found — cannot seed sales. Add products first.';
    return;
  end if;
end $$;

-- Generator: walks back ~1100 days, emits 1–4 invoices per day, each with 1–3 items
with
  products_list as (
    select id, title, coalesce(price, 150 + (random() * 800)::numeric(12,2)) as unit_price,
           row_number() over (order by random()) as rn,
           count(*) over () as total_n
    from public.products
  ),
  day_series as (
    select generate_series(0, 1095) as d_offset
  ),
  daily_invoices as (
    select d_offset,
           (now() - (d_offset || ' days')::interval)::timestamptz as issued,
           generate_series(1, 1 + floor(random() * 3)::int) as inv_idx
    from day_series
    where random() > 0.08   -- ~8% days with no sales (weekends/holidays feel)
  ),
  inv_with_customer as (
    select issued,
           'INV-DEMO-' || to_char(issued, 'YYYYMMDD') || '-' ||
             lpad((row_number() over (partition by issued::date))::text, 3, '0') as invoice_number,
           (array['Akwasi','Kofi','Ama','Yaa','Kwame','Abena','Kojo','Efua',
                  'Kwesi','Adwoa','Richmond Ventures','Golden IT','Secure Home Ltd',
                  'Metro Cafe','Sunrise Hotel','Kingsway School'])[1 + floor(random()*16)::int]
             as customer_name,
           '02' || lpad(floor(random() * 99999999)::text, 8, '0') as customer_num
    from daily_invoices
  )
insert into public.invoices
  (invoice_number, customer_name, customer_num, order_no, payment_method,
   subtotal, vat_rate, vat_amount, total, issued_at)
select i.invoice_number, i.customer_name, i.customer_num,
       lpad(floor(random() * 999)::text, 3, '0'),
       (array['Cash','Mobile Money','Bank Transfer'])[1 + floor(random()*3)::int],
       0, 0, 0, 0,
       i.issued
from inv_with_customer i;

-- Add 1–3 line items per demo invoice
insert into public.invoice_items (invoice_id, product_id, description, quantity, unit_price, line_total, position)
select inv.id,
       p.id,
       p.title,
       q.qty,
       p.unit_price,
       (q.qty * p.unit_price)::numeric(12,2),
       q.pos
from public.invoices inv
cross join lateral (
  select generate_series(1, 1 + floor(random()*3)::int) as pos,
         1 + floor(random()*4)::int as qty
) q
cross join lateral (
  select id, title, coalesce(price, 150 + (random() * 800)::numeric(12,2)) as unit_price
  from public.products order by random() limit 1
) p
where inv.invoice_number like 'INV-DEMO-%';

-- Roll-up totals on demo invoices
update public.invoices inv set
  subtotal   = s.sub,
  vat_rate   = 15,
  vat_amount = round(s.sub * 0.15, 2),
  total      = round(s.sub * 1.15, 2)
from (
  select invoice_id, sum(line_total)::numeric(12,2) as sub
  from public.invoice_items group by invoice_id
) s
where s.invoice_id = inv.id and inv.invoice_number like 'INV-DEMO-%';

-- ──────────────────────────────────────────────────────────────────────────
-- Dummy expenses (for Income vs Expense widget) — roughly 60% of revenue
-- ──────────────────────────────────────────────────────────────────────────
insert into public.expenses (category, description, amount, incurred_at)
select
  (array['Rent','Salaries','Utilities','Logistics','Marketing','Stock','Maintenance'])[1 + floor(random()*7)::int],
  'Auto-seeded demo expense',
  round((500 + random() * 4500)::numeric, 2),
  (now() - (floor(random() * 1095)::int || ' days')::interval)::timestamptz
from generate_series(1, 400);
