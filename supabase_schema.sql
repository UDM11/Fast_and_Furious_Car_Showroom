-- ============================================================
-- Fast & Furious Car Showroom — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. CARS TABLE
create table if not exists public.cars (
  id            uuid primary key default gen_random_uuid(),
  make          text not null,
  model         text not null,
  year          int  not null,
  price         numeric not null,
  type          text not null check (type in ('sedan','suv','sports')),
  mileage       int  not null default 0,
  fuel          text not null,
  transmission  text not null,
  engine        text not null,
  features      text[] not null default '{}',
  images        text[] not null default '{}',
  description   text not null default '',
  is_new        boolean not null default true,
  rating        numeric not null default 5.0,
  reviews       int not null default 0,
  created_at    timestamptz not null default now()
);

-- 2. TEST DRIVE BOOKINGS TABLE
create table if not exists public.test_drive_bookings (
  id          uuid primary key default gen_random_uuid(),
  car_id      uuid references public.cars(id) on delete set null,
  user_id     uuid references auth.users(id) on delete cascade,
  date        text not null,
  time        text not null,
  name        text not null,
  email       text not null,
  phone       text not null,
  status      text not null default 'pending'
              check (status in ('pending','confirmed','completed','cancelled')),
  created_at  timestamptz not null default now()
);

-- 3. FAVORITES TABLE
create table if not exists public.favorites (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users(id) on delete cascade,
  car_id    uuid references public.cars(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, car_id)
);

-- 4. USER PROFILES TABLE (mirrors auth.users with role)
create table if not exists public.user_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  phone      text,
  role       text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- 5. AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. ROW LEVEL SECURITY

alter table public.cars enable row level security;
alter table public.test_drive_bookings enable row level security;
alter table public.favorites enable row level security;
alter table public.user_profiles enable row level security;

-- Cars: anyone can read; only admins can write
create policy "cars_read_all"   on public.cars for select using (true);
create policy "cars_insert_admin" on public.cars for insert
  with check ((select role from public.user_profiles where id = auth.uid()) = 'admin');
create policy "cars_update_admin" on public.cars for update
  using ((select role from public.user_profiles where id = auth.uid()) = 'admin');
create policy "cars_delete_admin" on public.cars for delete
  using ((select role from public.user_profiles where id = auth.uid()) = 'admin');

-- Bookings: users see own; admins see all
create policy "bookings_user_read" on public.test_drive_bookings for select
  using (auth.uid() = user_id or (select role from public.user_profiles where id = auth.uid()) = 'admin');
create policy "bookings_insert_auth" on public.test_drive_bookings for insert
  with check (auth.uid() = user_id);
create policy "bookings_update_admin" on public.test_drive_bookings for update
  using ((select role from public.user_profiles where id = auth.uid()) = 'admin' or auth.uid() = user_id);

-- Favorites: users manage their own
create policy "favorites_user_all" on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User profiles: users read own; admins read all; admins update roles
create policy "profiles_read_own" on public.user_profiles for select
  using (auth.uid() = id or (select role from public.user_profiles where id = auth.uid()) = 'admin');
create policy "profiles_update_own" on public.user_profiles for update
  using (auth.uid() = id or (select role from public.user_profiles where id = auth.uid()) = 'admin');

-- 7. CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  car_model   text,
  preferred_contact text,
  message     text not null,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_insert" on public.contact_messages for insert with check (true);
create policy "contact_messages_select_admin" on public.contact_messages for select
  using ((select role from public.user_profiles where id = auth.uid()) = 'admin');

