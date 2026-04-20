-- ============================================================================
-- Intelet Enterprise — Foundation schema
-- Run this BEFORE 20260417_sales_system.sql (it references public.products).
-- Idempotent: safe to run repeatedly.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────────────────
-- 0. USER ROLES (boss / admin / cashier)
-- Also defines current_role() and is_boss() helpers used by sales RLS.
-- Placed in foundation so any migration can rely on them.
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('boss','admin','cashier')),
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

-- Convenience: promote a user to boss by email (run once after creating
-- the admin in Supabase Auth). Usage:  select public.promote_to_boss('you@example.com');
create or replace function public.promote_to_boss(p_email text) returns uuid
language plpgsql security definer set search_path = public, auth as $$
declare uid uuid;
begin
  select id into uid from auth.users where email = p_email;
  if uid is null then raise exception 'No auth user with email %', p_email; end if;
  insert into public.user_roles (user_id, role) values (uid, 'boss')
    on conflict (user_id) do update set role = 'boss';
  return uid;
end $$;

alter table public.user_roles enable row level security;

drop policy if exists ur_self_read on public.user_roles;
create policy ur_self_read on public.user_roles for select
  using (auth.uid() = user_id or public.is_boss());

drop policy if exists ur_boss_write on public.user_roles;
create policy ur_boss_write on public.user_roles for all
  using (public.is_boss()) with check (public.is_boss());

-- ──────────────────────────────────────────────────────────────────────────
-- 1. CATEGORIES (tree; rows seeded below from APPLIANCE_CATEGORIES)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  parent_id  uuid references public.categories(id) on delete cascade,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists categories_parent_idx on public.categories (parent_id);
create index if not exists categories_sort_idx   on public.categories (sort_order);

-- ──────────────────────────────────────────────────────────────────────────
-- 2. PRODUCTS
-- category_id stores a slug string (matches admin form: form.category_slug).
-- If you later migrate to a real FK, change the column and add a constraint.
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text unique,
  model_number   text not null,
  brand          text not null,
  description    text,
  price          numeric(12,2),
  category_id    text,
  specifications jsonb not null default '{}'::jsonb,
  images         text[] not null default '{}',
  in_stock       boolean not null default true,
  featured       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists products_brand_idx      on public.products (brand);
create index if not exists products_category_idx   on public.products (category_id);
create index if not exists products_featured_idx   on public.products (featured) where featured;
create index if not exists products_instock_idx    on public.products (in_stock) where in_stock;
create index if not exists products_created_at_idx on public.products (created_at desc);

-- Full-text search on title + model + description
create index if not exists products_search_idx on public.products
  using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(model_number,'') || ' ' || coalesce(description,'')));

-- Keep updated_at fresh
create or replace function public.fn_touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.fn_touch_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- 3. ORDERS (customer-facing WhatsApp fallback form)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid references public.products(id) on delete set null,
  customer_name    text not null,
  customer_email   text,
  customer_phone   text not null,
  customer_address text,
  quantity         int  not null default 1 check (quantity > 0),
  message          text,
  status           text not null default 'pending'
                   check (status in ('pending','contacted','confirmed','completed','cancelled')),
  created_at       timestamptz not null default now()
);
create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ──────────────────────────────────────────────────────────────────────────
-- 4. WAREHOUSES + WAREHOUSE_STOCK (admin Stock tab)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.warehouses (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  color        text not null default '#C8102E',
  date_columns text[] not null default '{}',
  created_at   timestamptz not null default now()
);

create table if not exists public.warehouse_stock (
  id            uuid primary key default gen_random_uuid(),
  warehouse     text not null,
  model         text not null,
  opening_stock int  not null default 0,
  daily_taken   jsonb not null default '{}'::jsonb,
  total_taken   int  not null default 0,
  closing_stock int  not null default 0,
  min_level     int,
  stock_status  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists wh_stock_warehouse_idx on public.warehouse_stock (warehouse);
create index if not exists wh_stock_model_idx     on public.warehouse_stock (model);

drop trigger if exists trg_wh_stock_updated_at on public.warehouse_stock;
create trigger trg_wh_stock_updated_at before update on public.warehouse_stock
  for each row execute function public.fn_touch_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- 5. ROW-LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────────────────
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.orders           enable row level security;
alter table public.warehouses       enable row level security;
alter table public.warehouse_stock  enable row level security;

-- Categories: everyone reads; authenticated writes (admin dashboard)
drop policy if exists cat_public_read on public.categories;
create policy cat_public_read on public.categories for select using (true);

drop policy if exists cat_auth_write on public.categories;
create policy cat_auth_write on public.categories for all
  to authenticated using (true) with check (true);

-- Products: everyone reads; authenticated writes
drop policy if exists prod_public_read on public.products;
create policy prod_public_read on public.products for select using (true);

drop policy if exists prod_auth_write on public.products;
create policy prod_auth_write on public.products for all
  to authenticated using (true) with check (true);

-- Orders: anyone can INSERT (public order form); only authenticated read/update
drop policy if exists ord_public_insert on public.orders;
create policy ord_public_insert on public.orders for insert
  to anon, authenticated with check (true);

drop policy if exists ord_auth_read on public.orders;
create policy ord_auth_read on public.orders for select
  to authenticated using (true);

drop policy if exists ord_auth_update on public.orders;
create policy ord_auth_update on public.orders for update
  to authenticated using (true) with check (true);

drop policy if exists ord_auth_delete on public.orders;
create policy ord_auth_delete on public.orders for delete
  to authenticated using (true);

-- Warehouses + stock: authenticated only (admin-only data)
drop policy if exists wh_auth_all on public.warehouses;
create policy wh_auth_all on public.warehouses for all
  to authenticated using (true) with check (true);

drop policy if exists whs_auth_all on public.warehouse_stock;
create policy whs_auth_all on public.warehouse_stock for all
  to authenticated using (true) with check (true);

-- ──────────────────────────────────────────────────────────────────────────
-- 6. STORAGE BUCKET (product images)
-- ──────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do update set public = true;

-- Public read, authenticated upload/update/delete
drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images') with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images');

-- ──────────────────────────────────────────────────────────────────────────
-- 7. SEED CATEGORIES (mirror APPLIANCE_CATEGORIES in src/lib/brand.ts)
-- ──────────────────────────────────────────────────────────────────────────
insert into public.categories (name, slug, sort_order) values
  ('Refrigerators',    'refrigerators',    10),
  ('Chest Freezers',   'chest-freezers',   20),
  ('Washing Machines', 'washing-machines', 30),
  ('Air Conditioners', 'air-conditioners', 40),
  ('Televisions',      'televisions',      50),
  ('Small Appliances', 'small-appliances', 60)
on conflict (slug) do nothing;
