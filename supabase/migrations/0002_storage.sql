-- Public bucket for dish images, writable only by restaurant staff of the
-- restaurant whose folder they're writing to (folder name = restaurant_id).
insert into storage.buckets (id, name, public)
values ('dish-images', 'dish-images', true)
on conflict (id) do nothing;

drop policy if exists "dish_images_public_read" on storage.objects;
create policy "dish_images_public_read"
on storage.objects for select
using (bucket_id = 'dish-images');

drop policy if exists "dish_images_staff_write" on storage.objects;
create policy "dish_images_staff_write"
on storage.objects for insert
with check (
  bucket_id = 'dish-images'
  and public.is_restaurant_staff((storage.foldername(name))[1]::uuid)
);

drop policy if exists "dish_images_staff_update" on storage.objects;
create policy "dish_images_staff_update"
on storage.objects for update
using (
  bucket_id = 'dish-images'
  and public.is_restaurant_staff((storage.foldername(name))[1]::uuid)
);
