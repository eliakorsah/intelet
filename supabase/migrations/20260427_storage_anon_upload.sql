-- Allow the anon role to upload and manage files in the product-images
-- bucket. The bucket is already public (readable by anyone). This
-- unblocks image uploads from the admin panel which authenticates via
-- localStorage rather than supabase.auth.

insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do update set public = true;

drop policy if exists "product-images anon insert" on storage.objects;
create policy "product-images anon insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product-images anon update" on storage.objects;
create policy "product-images anon update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product-images anon delete" on storage.objects;
create policy "product-images anon delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');
