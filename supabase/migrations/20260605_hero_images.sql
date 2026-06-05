-- ============================================================================
-- Intelet Enterprise — Hero images (admin-managed home page banner)
-- Public read; authenticated (admin) insert/delete. Seeded with /hero.png.
-- ============================================================================

create table if not exists public.hero_images (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists hero_images_sort_idx on public.hero_images (sort_order);

alter table public.hero_images enable row level security;

drop policy if exists hero_public_read on public.hero_images;
create policy hero_public_read on public.hero_images for select using (true);

-- Admin panel uses the anon key behind a password gate (no Supabase auth
-- session), so writes must be allowed for anon as well — same model as the
-- storage anon-upload policy.
drop policy if exists hero_auth_write on public.hero_images;
drop policy if exists hero_anon_write on public.hero_images;
create policy hero_anon_write on public.hero_images for all
  to anon, authenticated using (true) with check (true);

-- Seed the bundled hero.png as the first banner (only if table is empty).
insert into public.hero_images (url, sort_order)
  select '/hero.png', 0
  where not exists (select 1 from public.hero_images);
