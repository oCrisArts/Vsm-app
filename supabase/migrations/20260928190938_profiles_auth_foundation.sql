create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  role text not null default 'student',
  onboarding_done boolean not null default false,
  vsm_score integer not null default 0,
  vsm_level integer not null default 1,
  total_xp integer not null default 0,
  shape_score integer not null default 0,
  finance_score integer not null default 0,
  knowledge_score integer not null default 0,
  social_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('student', 'admin'))
);

-- Bring installations that still have the legacy profiles table up to date.
alter table public.profiles
  add column if not exists email text,
  add column if not exists display_name text,
  add column if not exists avatar_url text,
  add column if not exists role text default 'student',
  add column if not exists onboarding_done boolean default false,
  add column if not exists vsm_score integer default 0,
  add column if not exists vsm_level integer default 1,
  add column if not exists total_xp integer default 0,
  add column if not exists shape_score integer default 0,
  add column if not exists finance_score integer default 0,
  add column if not exists knowledge_score integer default 0,
  add column if not exists social_score integer default 0,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.profiles as profile
set email = auth_user.email
from auth.users as auth_user
where auth_user.id = profile.id
  and profile.email is null;

update public.profiles
set
  role = coalesce(role, 'student'),
  onboarding_done = coalesce(onboarding_done, false),
  vsm_score = coalesce(vsm_score, 0),
  vsm_level = coalesce(vsm_level, 1),
  total_xp = coalesce(total_xp, 0),
  shape_score = coalesce(shape_score, 0),
  finance_score = coalesce(finance_score, 0),
  knowledge_score = coalesce(knowledge_score, 0),
  social_score = coalesce(social_score, 0),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.profiles
  alter column email set not null,
  alter column email drop default,
  alter column display_name drop not null,
  alter column role set default 'student',
  alter column role set not null,
  alter column onboarding_done set default false,
  alter column onboarding_done set not null,
  alter column vsm_score set default 0,
  alter column vsm_score set not null,
  alter column vsm_level set default 1,
  alter column vsm_level set not null,
  alter column total_xp set default 0,
  alter column total_xp set not null,
  alter column shape_score set default 0,
  alter column shape_score set not null,
  alter column finance_score set default 0,
  alter column finance_score set not null,
  alter column knowledge_score set default 0,
  alter column knowledge_score set not null,
  alter column social_score set default 0,
  alter column social_score set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('student', 'admin'));

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    role,
    onboarding_done,
    vsm_score,
    vsm_level,
    total_xp,
    shape_score,
    finance_score,
    knowledge_score,
    social_score
  )
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1),
    'student',
    false,
    0,
    1,
    0,
    0,
    0,
    0,
    0
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

insert into public.profiles (
  id,
  email,
  display_name,
  role,
  onboarding_done,
  vsm_score,
  vsm_level,
  total_xp,
  shape_score,
  finance_score,
  knowledge_score,
  social_score
)
select
  auth_user.id,
  auth_user.email,
  split_part(auth_user.email, '@', 1),
  'student',
  false,
  0,
  1,
  0,
  0,
  0,
  0,
  0
from auth.users as auth_user
where not exists (
  select 1
  from public.profiles as profile
  where profile.id = auth_user.id
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

alter table public.profiles enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  loop
    execute format(
      'drop policy %I on public.profiles',
      policy_record.policyname
    );
  end loop;
end;
$$;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using ((select private.is_admin()));

create policy "Users can update permitted own profile fields"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

revoke all on table public.profiles from anon;
revoke insert, update, delete, truncate, references, trigger on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, avatar_url, onboarding_done) on table public.profiles to authenticated;

create or replace function private.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_profile_updated_at() from public, anon, authenticated;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function private.set_profile_updated_at();

create or replace function public.admin_set_user_role(
  target_user_id uuid,
  new_role text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if new_role is null or new_role not in ('student', 'admin') then
    raise exception 'Role must be student or admin' using errcode = '22023';
  end if;

  if not private.is_admin() then
    if caller_id = target_user_id and new_role = 'admin' then
      raise exception 'Users cannot promote themselves' using errcode = '42501';
    end if;

    raise exception 'Administrator role required' using errcode = '42501';
  end if;

  update public.profiles
  set role = new_role
  where id = target_user_id;

  if not found then
    raise exception 'Target profile not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.admin_set_user_role(uuid, text) from public, anon;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;
