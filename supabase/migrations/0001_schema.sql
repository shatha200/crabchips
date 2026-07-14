-- ============================================================================
-- Restaurant Ordering Platform — Core Schema
-- Target: Supabase (Postgres + Auth + Realtime + Storage)
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
create type user_role as enum ('customer', 'restaurant_owner', 'restaurant_staff');
exception when duplicate_object then null;
end $$;

do $$ begin
create type order_status as enum (
  'pending',
  'accepted',
  'rejected',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled'
);
exception when duplicate_object then null;
end $$;

do $$ begin
create type payment_method as enum ('cash_on_delivery');
exception when duplicate_object then null;
end $$;

-- ----------------------------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'customer',
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- CUSTOMER ADDRESSES
-- ----------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Domicile',
  address_line text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- RESTAURANTS
-- ----------------------------------------------------------------------------
create table if not exists public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  logo_url text,
  cover_url text,
  address text,
  phone text,
  whatsapp text,
  instagram text,
  facebook text,
  maps_url text,
  is_open boolean not null default true,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Which staff/owner accounts manage which restaurant.
create table if not exists public.restaurant_staff (
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  staff_role text not null default 'staff', -- 'owner' | 'staff'
  primary key (restaurant_id, user_id)
);

-- ----------------------------------------------------------------------------
-- MENU: CATEGORIES + DISHES
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  name_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  name_ar text,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean not null default true,
  is_popular boolean not null default false,
  is_featured boolean not null default false,
  order_count integer not null default 0, -- denormalized, used for "popular" sort + stats
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_dishes_restaurant on public.dishes(restaurant_id);
create index if not exists idx_dishes_category on public.dishes(category_id);

-- ----------------------------------------------------------------------------
-- ORDERS
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  short_code text not null, -- human friendly e.g. "CC-1042"
  customer_id uuid not null references public.profiles(id),
  restaurant_id uuid not null references public.restaurants(id),
  status order_status not null default 'pending',
  payment_method payment_method not null default 'cash_on_delivery',
  delivery_address text not null,
  phone text not null,
  note text,
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_restaurant on public.orders(restaurant_id, status);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  dish_id uuid references public.dishes(id),
  name_snapshot text not null,     -- name at time of order (dish may change later)
  price_snapshot numeric(10,2) not null,
  quantity integer not null check (quantity > 0)
);

-- Append-only audit trail of status changes, also used to drive notifications.
create table if not exists public.order_status_events (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status order_status not null,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Keep updated_at fresh automatically.
create or replace function public.set_order_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_order_update_timestamp on public.orders;
create trigger on_order_update_timestamp
  before update on public.orders
  for each row execute procedure public.set_order_updated_at();

-- Log every status transition automatically.
create or replace function public.log_order_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (tg_op = 'INSERT') or (old.status is distinct from new.status) then
    insert into public.order_status_events (order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_upsert on public.orders;
drop trigger if exists on_order_status_change on public.orders;
create trigger on_order_status_change
  after insert or update on public.orders
  for each row execute procedure public.log_order_status_change();

-- ----------------------------------------------------------------------------
-- REVIEWS (one per delivered order)
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  customer_id uuid not null references public.profiles(id),
  restaurant_id uuid not null references public.restaurants(id),
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- Recalculate restaurant rating whenever a review is added.
create or replace function public.recalc_restaurant_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.restaurants r
  set rating = coalesce((select round(avg(rating)::numeric, 1) from public.reviews where restaurant_id = r.id), 0),
      review_count = (select count(*) from public.reviews where restaurant_id = r.id)
  where r.id = new.restaurant_id;
  return new;
end;
$$;

drop trigger if exists on_review_insert on public.reviews;
create trigger on_review_insert
  after insert on public.reviews
  for each row execute procedure public.recalc_restaurant_rating();

-- ----------------------------------------------------------------------------
-- PUSH NOTIFICATION TOKENS (Expo push tokens)
-- ----------------------------------------------------------------------------
create table if not exists public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  expo_token text not null unique,
  platform text not null, -- 'ios' | 'android'
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_staff enable row level security;
alter table public.categories enable row level security;
alter table public.dishes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;
alter table public.reviews enable row level security;
alter table public.push_tokens enable row level security;

-- helper: is this user staff/owner of a given restaurant?
create or replace function public.is_restaurant_staff(target_restaurant_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.restaurant_staff
    where restaurant_id = target_restaurant_id and user_id = auth.uid()
  );
$$;

-- PROFILES: users manage their own row. Restaurant staff can view profiles of
-- customers who have ordered from their restaurant (for the Customer Management screen).
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
drop policy if exists "profiles_select_by_restaurant_staff" on public.profiles;
create policy "profiles_select_by_restaurant_staff" on public.profiles
  for select using (
    exists (
      select 1 from public.orders o
      where o.customer_id = profiles.id
      and public.is_restaurant_staff(o.restaurant_id)
    )
  );
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- ADDRESSES: owner only
drop policy if exists "addresses_owner_all" on public.addresses;
create policy "addresses_owner_all" on public.addresses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- RESTAURANTS: public read; staff can update their own restaurant
drop policy if exists "restaurants_public_read" on public.restaurants;
create policy "restaurants_public_read" on public.restaurants
  for select using (true);
drop policy if exists "restaurants_staff_update" on public.restaurants;
create policy "restaurants_staff_update" on public.restaurants
  for update using (public.is_restaurant_staff(id));

-- RESTAURANT_STAFF: staff can see their own memberships
drop policy if exists "restaurant_staff_self_read" on public.restaurant_staff;
create policy "restaurant_staff_self_read" on public.restaurant_staff
  for select using (user_id = auth.uid());

-- CATEGORIES: public read; staff write
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);
drop policy if exists "categories_staff_write" on public.categories;
create policy "categories_staff_write" on public.categories
  for all using (public.is_restaurant_staff(restaurant_id))
  with check (public.is_restaurant_staff(restaurant_id));

-- DISHES: public read; staff write
drop policy if exists "dishes_public_read" on public.dishes;
create policy "dishes_public_read" on public.dishes
  for select using (true);
drop policy if exists "dishes_staff_write" on public.dishes;
create policy "dishes_staff_write" on public.dishes
  for all using (public.is_restaurant_staff(restaurant_id))
  with check (public.is_restaurant_staff(restaurant_id));

-- ORDERS: customers see/create their own; staff see/update orders for their restaurant
drop policy if exists "orders_customer_read" on public.orders;
create policy "orders_customer_read" on public.orders
  for select using (customer_id = auth.uid());
drop policy if exists "orders_customer_insert" on public.orders;
create policy "orders_customer_insert" on public.orders
  for insert with check (customer_id = auth.uid());
drop policy if exists "orders_staff_read" on public.orders;
create policy "orders_staff_read" on public.orders
  for select using (public.is_restaurant_staff(restaurant_id));
drop policy if exists "orders_staff_update" on public.orders;
create policy "orders_staff_update" on public.orders
  for update using (public.is_restaurant_staff(restaurant_id));

-- ORDER_ITEMS: visible if you can see the parent order
drop policy if exists "order_items_read" on public.order_items;
create policy "order_items_read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or public.is_restaurant_staff(o.restaurant_id))
    )
  );
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o where o.id = order_items.order_id
      and o.customer_id = auth.uid()
    )
  );

-- ORDER_STATUS_EVENTS: same visibility as orders
drop policy if exists "order_events_read" on public.order_status_events;
create policy "order_events_read" on public.order_status_events
  for select using (
    exists (
      select 1 from public.orders o where o.id = order_status_events.order_id
      and (o.customer_id = auth.uid() or public.is_restaurant_staff(o.restaurant_id))
    )
  );

-- REVIEWS: public read (for restaurant rating display); only the customer of a
-- delivered order can write a review for that order.
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);
drop policy if exists "reviews_customer_insert" on public.reviews;
create policy "reviews_customer_insert" on public.reviews
  for insert with check (
    customer_id = auth.uid()
    and exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid() and o.status = 'delivered'
    )
  );

-- PUSH_TOKENS: owner only
drop policy if exists "push_tokens_owner_all" on public.push_tokens;
create policy "push_tokens_owner_all" on public.push_tokens
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
