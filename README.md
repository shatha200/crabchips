# Crab & Chips — Mobile Ordering App

Cross-platform (iOS + Android) ordering app for Crab & Chips, built with
**Expo / React Native** on top of a **Supabase** backend (Postgres, Auth,
Realtime, Storage). Two roles: **Customer** and **Restaurant** (staff/owner).

This is a separate, real backend from the `crabchips` marketing website in
this repo — that site has no database or auth of its own, so this app and its
Supabase project are the actual order-taking system for the business.

## Structure

```
supabase/
  migrations/0001_schema.sql   — tables, enums, RLS policies, triggers
  migrations/0002_storage.sql  — dish-images storage bucket + policies
  seed/generate-seed.mjs       — pulls REAL menu data from crabchips/src/lib/site-data.ts
  seed/seed.sql                — generated seed (Crab & Chips restaurant + 9 categories + 54 dishes)
  functions/notify-order-status/ — Edge Function: sends Expo push notifications on order status change

mobile/
  app/                — expo-router screens ( (auth) / (customer) / (restaurant) route groups )
  src/lib              — supabase client, theme/design tokens
  src/contexts         — Auth + Theme providers
  src/store            — cart (zustand, persisted)
  src/services         — typed API layer over Supabase (menu, orders, reviews, addresses, stats)
  src/components       — shared UI (Button, Card, StatusBadge, DishCard, StarRating, etc.)
  src/hooks            — usePushNotifications
```

## 1. Set up Supabase

1. Create a project at https://supabase.com.
2. Run the migrations (Supabase CLI or paste into the SQL editor, in order):
   ```
   supabase db push   # or paste 0001_schema.sql then 0002_storage.sql
   ```
3. Seed real menu data:
   ```
   node supabase/seed/generate-seed.mjs ../crabchips/src/lib/site-data.ts
   # then paste the generated supabase/seed/seed.sql into the SQL editor
   ```
4. Create your first restaurant owner account:
   - Sign up a user normally through the app (role defaults to `customer`).
   - In the SQL editor, promote them and link them to the restaurant:
     ```sql
     update public.profiles set role = 'restaurant_owner' where id = '<user-uuid>';
     insert into public.restaurant_staff (restaurant_id, user_id, staff_role)
     values ('00000000-0000-0000-0000-000000000001', '<user-uuid>', 'owner');
     ```
5. Deploy the push-notification Edge Function and wire up the webhook (see
   comment at the top of `supabase/functions/notify-order-status/index.ts`).

## 2. Run the mobile app

```
cd mobile
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL / ANON_KEY
npm install
npx expo start
```

Scan the QR code with Expo Go (or run `npm run ios` / `npm run android` with
a simulator). Push notifications require a physical device and an EAS
project ID (`eas init`).

## Notes on scope

- **Single-restaurant per build**: `src/config.ts` hardcodes `RESTAURANT_ID`,
  matching the one-site-per-client model of the existing Lovable business —
  swap the ID (and app name/icon in `app.config.ts`) per client, or extend
  the schema/UI for multi-tenant selection if you want one app for all
  restaurants.
- **Payments**: Cash on Delivery only, as specified — no payment gateway is
  wired in.
- **What's fully built**: schema + RLS, auth (login/register/forgot
  password), customer flow (home, menu w/ filters, dish details, cart,
  checkout, orders + live tracking, reviews, profile/addresses), restaurant
  flow (dashboard, realtime order management, menu/category management with
  image upload, customers, statistics), light/dark theme, push notifications.
- **What to still harden before production**: input validation edge cases,
  pagination on long lists (orders/customers), image compression before
  upload, and end-to-end testing of the Edge Function webhook.
