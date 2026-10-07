-- AI Work Passport - Supabase schema
-- Run this in the project's SQL editor once the Supabase project is connected.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Work Passport Holder',
  headline text not null default 'Verified record of work and demonstrated capability',
  public_slug text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_type text not null,
  work_date date not null,
  proof_details text not null,
  skills text[] not null default '{}',
  status text not null default 'private'
    check (status in ('private','pending_verification','verified','rejected')),
  verification_method text,
  verification_reference text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evidence_items_user_id_idx on public.evidence_items(user_id);
create index if not exists evidence_items_status_idx on public.evidence_items(status);
create index if not exists evidence_items_work_date_idx on public.evidence_items(work_date desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists evidence_touch_updated_at on public.evidence_items;
create trigger evidence_touch_updated_at
before update on public.evidence_items
for each row execute function public.touch_updated_at();

-- A normal signed-in user must never be able to make an item verified directly.
create or replace function public.protect_verification_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.role() <> 'service_role' then
    if new.status = 'verified'
       or new.verification_method is distinct from old.verification_method
       or new.verification_reference is distinct from old.verification_reference
       or new.verified_at is distinct from old.verified_at then
      raise exception 'Verification fields may only be changed by the trusted verification service.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists evidence_protect_verification on public.evidence_items;
create trigger evidence_protect_verification
before update on public.evidence_items
for each row execute function public.protect_verification_fields();

alter table public.profiles enable row level security;
alter table public.evidence_items enable row level security;

drop policy if exists "profiles_owner_select" on public.profiles;
create policy "profiles_owner_select"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_public_select" on public.profiles;
create policy "profiles_public_select"
on public.profiles for select
to anon, authenticated
using (is_public = true and public_slug is not null);

drop policy if exists "profiles_owner_insert" on public.profiles;
create policy "profiles_owner_insert"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_owner_update" on public.profiles;
create policy "profiles_owner_update"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "evidence_owner_select" on public.evidence_items;
create policy "evidence_owner_select"
on public.evidence_items for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "evidence_public_verified_select" on public.evidence_items;
create policy "evidence_public_verified_select"
on public.evidence_items for select
to anon, authenticated
using (
  status = 'verified'
  and exists (
    select 1
    from public.profiles p
    where p.user_id = evidence_items.user_id
      and p.is_public = true
      and p.public_slug is not null
  )
);

drop policy if exists "evidence_owner_insert" on public.evidence_items;
create policy "evidence_owner_insert"
on public.evidence_items for insert
to authenticated
with check (
  auth.uid() = user_id
  and status in ('private','pending_verification')
  and verification_method is null
  and verification_reference is null
  and verified_at is null
);

drop policy if exists "evidence_owner_update" on public.evidence_items;
create policy "evidence_owner_update"
on public.evidence_items for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and status in ('private','pending_verification','rejected')
);

drop policy if exists "evidence_owner_delete" on public.evidence_items;
create policy "evidence_owner_delete"
on public.evidence_items for delete
to authenticated
using (auth.uid() = user_id);

-- Automatically create a private profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''),'Work Passport Holder')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
