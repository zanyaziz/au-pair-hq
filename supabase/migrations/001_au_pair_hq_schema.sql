-- Au Pair HQ schema (Supabase / Postgres)
-- Run this in the Supabase SQL editor. Demo mode (no env vars) does not use it.
-- Tables mirror the localStorage demo state so the app can be switched to
-- Supabase-backed storage without changing the UI.

create extension if not exists "pgcrypto";

-- One row per family / household.
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Family',
  parents text,
  agency text,
  program text not null default 'Standard' check (program in ('Standard', 'EduCare')),
  au_pair_name text,
  arrival_date date,
  stipend_weekly numeric(8,2) not null default 195.75,
  education_fund numeric(8,2) not null default 500,
  house_rules text,
  created_at timestamptz not null default now()
);

create table if not exists public.kids (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  age text,
  school text,
  allergies text,
  meds text,
  bedtime text,
  pickup_notes text,
  notes text,
  arriving_soon boolean not null default false,
  created_at timestamptz not null default now()
);

-- One row per day of a published week. hours are derived from shifts in the app;
-- day_hours is stored for reporting / sponsor export.
create table if not exists public.week_days (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  week_of date not null,
  day text not null,
  is_off boolean not null default false,
  shifts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (family_id, week_of, day)
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  logged_at timestamptz not null default now(),
  kind text not null,
  child_name text,
  text text not null
);

create table if not exists public.status_checkins (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  checked_at timestamptz not null default now(),
  status text not null,
  lat double precision,
  lng double precision,
  accuracy_m integer
);

create table if not exists public.car_trips (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  trip_date date not null default current_date,
  purpose text not null,
  miles numeric(6,1),
  gas numeric(6,2),
  car_seat_checked boolean not null default true
);

create table if not exists public.stipend_payments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  week_of date not null,
  amount numeric(8,2) not null default 195.75,
  paid boolean not null default false,
  paid_date date
);

create table if not exists public.education_courses (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  credits text,
  done boolean not null default false,
  cost numeric(8,2) not null default 0
);

create table if not exists public.lcc_checkins (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  checkin_date date not null default current_date,
  note text not null
);

-- Row Level Security: enable on every table. Policies are intentionally
-- permissive for authenticated users in this first version; tighten them
-- (e.g. family membership via a family_members table) before inviting
-- other households. Do not deploy multi-family without that step.
alter table public.families enable row level security;
alter table public.kids enable row level security;
alter table public.week_days enable row level security;
alter table public.daily_logs enable row level security;
alter table public.status_checkins enable row level security;
alter table public.car_trips enable row level security;
alter table public.stipend_payments enable row level security;
alter table public.education_courses enable row level security;
alter table public.lcc_checkins enable row level security;

create policy "authenticated can read families" on public.families
  for select to authenticated using (true);
create policy "authenticated can manage families" on public.families
  for all to authenticated using (true) with check (true);

-- Same pattern for the child tables.
create policy "authenticated all kids" on public.kids
  for all to authenticated using (true) with check (true);
create policy "authenticated all week_days" on public.week_days
  for all to authenticated using (true) with check (true);
create policy "authenticated all daily_logs" on public.daily_logs
  for all to authenticated using (true) with check (true);
create policy "authenticated all status_checkins" on public.status_checkins
  for all to authenticated using (true) with check (true);
create policy "authenticated all car_trips" on public.car_trips
  for all to authenticated using (true) with check (true);
create policy "authenticated all stipend_payments" on public.stipend_payments
  for all to authenticated using (true) with check (true);
create policy "authenticated all education_courses" on public.education_courses
  for all to authenticated using (true) with check (true);
create policy "authenticated all lcc_checkins" on public.lcc_checkins
  for all to authenticated using (true) with check (true);
