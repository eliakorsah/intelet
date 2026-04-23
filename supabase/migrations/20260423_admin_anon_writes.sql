-- Admin panel is password-gated at the UI layer (localStorage flag) and does
-- not authenticate through supabase.auth, so all requests hit the API with
-- the anon role. Widen the write policies on admin-owned tables to accept
-- anon so the Stock and Products flows work end-to-end.
--
-- Tradeoff: anyone with the Supabase URL + anon key can write to these
-- tables directly. The hardcoded admin password only protects the UI.
-- Revisit by migrating admin login to supabase.auth.signInWithPassword.

-- Warehouses: full CRUD from anon + authenticated
drop policy if exists wh_auth_all on public.warehouses;
drop policy if exists wh_anon_all on public.warehouses;
create policy wh_anon_all on public.warehouses for all
  to anon, authenticated using (true) with check (true);

-- Warehouse stock: full CRUD from anon + authenticated
drop policy if exists whs_auth_all on public.warehouse_stock;
drop policy if exists whs_anon_all on public.warehouse_stock;
create policy whs_anon_all on public.warehouse_stock for all
  to anon, authenticated using (true) with check (true);

-- Products: keep public read, widen writes to anon + authenticated
drop policy if exists prod_auth_write on public.products;
drop policy if exists prod_anon_write on public.products;
create policy prod_anon_write on public.products for all
  to anon, authenticated using (true) with check (true);
