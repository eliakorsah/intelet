-- ============================================================================
-- Tritech — Extra recent invoices so TODAY / WEEK / MONTH tabs look populated
-- Safe to re-run (guarded by INV-FOCUS-% prefix).
-- ============================================================================

do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.invoices where invoice_number like 'INV-FOCUS-%';
  if v_count > 0 then
    raise notice 'Focus seed already applied (%). Skipping.', v_count;
    return;
  end if;

  -- TODAY: 8 invoices spread across the last few hours
  insert into public.invoices (invoice_number, customer_name, customer_num, order_no, payment_method,
                               subtotal, vat_rate, vat_amount, total, issued_at)
  select
    'INV-FOCUS-TODAY-' || lpad(g::text, 3, '0'),
    (array['Kwame','Ama','Kojo','Richmond Ventures','Secure Home Ltd','Yaa','Kofi','Metro Cafe'])[g],
    '02' || lpad(floor(random() * 99999999)::text, 8, '0'),
    lpad((100 + g)::text, 3, '0'),
    (array['Cash','Mobile Money','Bank Transfer'])[1 + floor(random()*3)::int],
    0, 0, 0, 0,
    (now() - (floor(random() * 10)::int || ' hours')::interval
           - (floor(random() * 55)::int || ' minutes')::interval)::timestamptz
  from generate_series(1, 8) g;

  -- THIS WEEK: 20 invoices across the past 7 days
  insert into public.invoices (invoice_number, customer_name, customer_num, order_no, payment_method,
                               subtotal, vat_rate, vat_amount, total, issued_at)
  select
    'INV-FOCUS-WEEK-' || lpad(g::text, 3, '0'),
    (array['Akwasi','Adwoa','Golden IT','Sunrise Hotel','Kingsway School','Abena','Kwesi','Efua'])[1 + (g % 8)],
    '02' || lpad(floor(random() * 99999999)::text, 8, '0'),
    lpad((200 + g)::text, 3, '0'),
    (array['Cash','Mobile Money','Bank Transfer'])[1 + floor(random()*3)::int],
    0, 0, 0, 0,
    (now() - (floor(random() * 6 + 1)::int || ' days')::interval
           - (floor(random() * 12)::int || ' hours')::interval)::timestamptz
  from generate_series(1, 20) g;

  -- THIS MONTH: 40 invoices across the past 30 days
  insert into public.invoices (invoice_number, customer_name, customer_num, order_no, payment_method,
                               subtotal, vat_rate, vat_amount, total, issued_at)
  select
    'INV-FOCUS-MONTH-' || lpad(g::text, 3, '0'),
    (array['Akwasi','Kwame','Richmond Ventures','Golden IT','Secure Home Ltd','Metro Cafe',
           'Sunrise Hotel','Kingsway School','Ama','Yaa','Kofi','Abena'])[1 + (g % 12)],
    '02' || lpad(floor(random() * 99999999)::text, 8, '0'),
    lpad((300 + g)::text, 3, '0'),
    (array['Cash','Mobile Money','Bank Transfer'])[1 + floor(random()*3)::int],
    0, 0, 0, 0,
    (now() - (floor(random() * 29 + 1)::int || ' days')::interval)::timestamptz
  from generate_series(1, 40) g;
end $$;

-- Add 1–3 line items per focus invoice
insert into public.invoice_items (invoice_id, product_id, description, quantity, unit_price, line_total, position)
select inv.id, p.id, p.title, q.qty, p.unit_price,
       (q.qty * p.unit_price)::numeric(12,2), q.pos
from public.invoices inv
cross join lateral (
  select generate_series(1, 1 + floor(random()*3)::int) as pos,
         1 + floor(random()*4)::int as qty
) q
cross join lateral (
  select id, title, coalesce(price, 150 + (random() * 800)::numeric(12,2)) as unit_price
  from public.products order by random() limit 1
) p
where inv.invoice_number like 'INV-FOCUS-%'
  and not exists (select 1 from public.invoice_items ii where ii.invoice_id = inv.id);

-- Roll-up totals on focus invoices
update public.invoices inv set
  subtotal   = s.sub,
  vat_rate   = 15,
  vat_amount = round(s.sub * 0.15, 2),
  total      = round(s.sub * 1.15, 2)
from (
  select invoice_id, sum(line_total)::numeric(12,2) as sub
  from public.invoice_items group by invoice_id
) s
where s.invoice_id = inv.id
  and inv.invoice_number like 'INV-FOCUS-%';

-- Some recent expenses (last 30 days) so Income-vs-Expense has matching recent bars
insert into public.expenses (category, description, amount, incurred_at)
select
  (array['Rent','Salaries','Utilities','Logistics','Marketing','Stock'])[1 + floor(random()*6)::int],
  'Focus seed expense',
  round((200 + random() * 3800)::numeric, 2),
  (now() - (floor(random() * 29)::int || ' days')::interval)::timestamptz
from generate_series(1, 30)
where not exists (
  select 1 from public.expenses where description = 'Focus seed expense'
);
