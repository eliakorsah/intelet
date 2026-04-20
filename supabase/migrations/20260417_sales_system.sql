-- ============================================================================
-- Tritech Technologies — Sales & Invoice Management System
-- Run this in the Supabase SQL editor (one-time, idempotent).
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- 1. USER ROLES
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role    text not null check (role in ('boss','admin','cashier')),
  created_at timestamptz not null default now()
);

create or replace function public.current_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.user_roles where user_id = auth.uid()
$$;

create or replace function public.is_boss() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() in ('boss','admin'), false)
$$;

-- ──────────────────────────────────────────────────────────────────────────
-- 2. INVOICES & LINE ITEMS
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id              uuid primary key default gen_random_uuid(),
  invoice_number  text not null unique,
  customer_name   text not null,
  customer_loc    text,
  customer_num    text,
  order_no        text,
  rep             text,
  fob             text,
  payment_method  text default 'Cash',
  subtotal        numeric(12,2) not null default 0,
  vat_rate        numeric(5,2)  not null default 0,
  vat_amount      numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  issued_at       timestamptz not null default now(),
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists invoices_issued_at_idx on public.invoices (issued_at desc);
create index if not exists invoices_created_by_idx on public.invoices (created_by);

create table if not exists public.invoice_items (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  description text not null,
  quantity    numeric(10,2) not null default 1,
  unit_price  numeric(12,2) not null default 0,
  line_total  numeric(12,2) not null default 0,
  position    int not null default 0
);
create index if not exists invoice_items_invoice_idx on public.invoice_items (invoice_id);

-- Invoice number auto-gen (per-year seq: INV-2026-0001)
create or replace function public.next_invoice_number() returns text
language plpgsql security definer set search_path = public as $$
declare
  yr  text := to_char(now(), 'YYYY');
  cnt int;
begin
  select count(*) + 1 into cnt from public.invoices
    where to_char(issued_at, 'YYYY') = yr;
  return 'INV-' || yr || '-' || lpad(cnt::text, 4, '0');
end $$;

-- ──────────────────────────────────────────────────────────────────────────
-- 3. PRODUCT WATCHES (Boss alerts)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.product_watches (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

create table if not exists public.watch_alerts (
  id          uuid primary key default gen_random_uuid(),
  watch_id    uuid not null references public.product_watches(id) on delete cascade,
  invoice_id  uuid references public.invoices(id) on delete set null,
  product_id  uuid not null references public.products(id) on delete cascade,
  quantity    numeric(10,2) not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists watch_alerts_unread_idx on public.watch_alerts (read_at) where read_at is null;

-- Trigger: after invoice item inserted, if its product is watched, create alert
create or replace function public.fn_create_watch_alerts() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.product_id is null then return new; end if;
  insert into public.watch_alerts (watch_id, invoice_id, product_id, quantity)
    select w.id, new.invoice_id, new.product_id, new.quantity
    from public.product_watches w where w.product_id = new.product_id;
  return new;
end $$;

drop trigger if exists trg_watch_alerts on public.invoice_items;
create trigger trg_watch_alerts after insert on public.invoice_items
  for each row execute function public.fn_create_watch_alerts();

-- ──────────────────────────────────────────────────────────────────────────
-- 4. EXPENSES (for income vs expense breakdown)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  description text,
  amount      numeric(12,2) not null,
  incurred_at timestamptz not null default now(),
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists expenses_incurred_idx on public.expenses (incurred_at desc);

-- ──────────────────────────────────────────────────────────────────────────
-- 5. AUDIT LOG
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references auth.users(id) on delete set null,
  actor_role text,
  action     text not null,        -- insert | update | delete
  table_name text not null,
  row_id     text,
  diff       jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_created_idx on public.audit_log (created_at desc);

create or replace function public.fn_audit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  rid text;
  d   jsonb;
begin
  if tg_op = 'DELETE' then
    rid := old.id::text;
    d   := to_jsonb(old);
  else
    rid := new.id::text;
    d   := to_jsonb(new);
  end if;
  insert into public.audit_log (actor_id, actor_role, action, table_name, row_id, diff)
    values (auth.uid(), public.current_role(), lower(tg_op), tg_table_name, rid, d);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;

drop trigger if exists trg_audit_invoices on public.invoices;
create trigger trg_audit_invoices after insert or update or delete on public.invoices
  for each row execute function public.fn_audit();

drop trigger if exists trg_audit_expenses on public.expenses;
create trigger trg_audit_expenses after insert or update or delete on public.expenses
  for each row execute function public.fn_audit();

-- ──────────────────────────────────────────────────────────────────────────
-- 6. ROW-LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────────────────
alter table public.user_roles      enable row level security;
alter table public.invoices        enable row level security;
alter table public.invoice_items   enable row level security;
alter table public.product_watches enable row level security;
alter table public.watch_alerts    enable row level security;
alter table public.expenses        enable row level security;
alter table public.audit_log       enable row level security;

-- user_roles: each user reads own row; only boss can write
drop policy if exists ur_self_read on public.user_roles;
create policy ur_self_read on public.user_roles for select
  using (auth.uid() = user_id or public.is_boss());

drop policy if exists ur_boss_write on public.user_roles;
create policy ur_boss_write on public.user_roles for all
  using (public.is_boss()) with check (public.is_boss());

-- invoices: boss sees all, cashier sees own
drop policy if exists inv_read on public.invoices;
create policy inv_read on public.invoices for select
  using (public.is_boss() or created_by = auth.uid());

drop policy if exists inv_insert on public.invoices;
create policy inv_insert on public.invoices for insert
  with check (auth.uid() is not null and (public.is_boss() or created_by = auth.uid()));

drop policy if exists inv_update on public.invoices;
create policy inv_update on public.invoices for update
  using (public.is_boss()) with check (public.is_boss());

drop policy if exists inv_delete on public.invoices;
create policy inv_delete on public.invoices for delete
  using (public.is_boss());

-- invoice_items: follow parent invoice
drop policy if exists inv_items_read on public.invoice_items;
create policy inv_items_read on public.invoice_items for select
  using (exists (select 1 from public.invoices i
    where i.id = invoice_id and (public.is_boss() or i.created_by = auth.uid())));

drop policy if exists inv_items_write on public.invoice_items;
create policy inv_items_write on public.invoice_items for all
  using (exists (select 1 from public.invoices i
    where i.id = invoice_id and (public.is_boss() or i.created_by = auth.uid())))
  with check (exists (select 1 from public.invoices i
    where i.id = invoice_id and (public.is_boss() or i.created_by = auth.uid())));

-- product_watches: only boss
drop policy if exists pw_boss on public.product_watches;
create policy pw_boss on public.product_watches for all
  using (public.is_boss()) with check (public.is_boss());

-- watch_alerts: boss-only
drop policy if exists wa_boss on public.watch_alerts;
create policy wa_boss on public.watch_alerts for all
  using (public.is_boss()) with check (public.is_boss());

-- expenses: boss-only
drop policy if exists exp_boss on public.expenses;
create policy exp_boss on public.expenses for all
  using (public.is_boss()) with check (public.is_boss());

-- audit_log: boss read-only
drop policy if exists audit_boss_read on public.audit_log;
create policy audit_boss_read on public.audit_log for select
  using (public.is_boss());

-- ──────────────────────────────────────────────────────────────────────────
-- 7. REPORTING VIEW (lightweight aggregate for charts)
-- ──────────────────────────────────────────────────────────────────────────
create or replace view public.sales_by_day as
  select date_trunc('day', issued_at)::date as day,
         sum(total) as total,
         count(*)   as invoice_count
  from public.invoices group by 1;

-- Grant read of view through existing policies
grant select on public.sales_by_day to anon, authenticated;
