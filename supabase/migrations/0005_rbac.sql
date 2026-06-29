-- ============================================================================
-- 0005 — RBAC: flexible per-module roles (the admin "operational engine")
-- Extends the existing profiles.role model WITHOUT breaking it: a user may hold
-- multiple module roles via user_roles; the existing is_admin/is_recruiter/
-- is_reviewer helpers are widened to honor both the legacy enum and user_roles.
-- ============================================================================

do $$ begin
  create type module_role as enum (
    'super_admin',
    'careers_admin','careers_recruiter',
    'pitch_admin','pitch_reviewer',
    'insights_admin','insights_editor'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       module_role not null,
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique (user_id, role)
);
create index if not exists idx_user_roles_user on public.user_roles(user_id);
alter table public.user_roles enable row level security;

-- Has the current user a given module role? (super_admin satisfies everything.)
create or replace function public.has_role(r module_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and (ur.role = r or ur.role = 'super_admin')
  )
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'super_admin')
$$;

-- Any staff member (holds a module role OR a legacy staff role).
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid())
      or coalesce(public.role_of(auth.uid()) in ('recruiter','reviewer','admin'), false)
$$;

-- Widen the legacy helpers to honor BOTH the profiles.role enum and user_roles.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.role_of(auth.uid()) = 'admin', false) or public.is_super_admin()
$$;

create or replace function public.is_recruiter()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.role_of(auth.uid()) in ('recruiter','admin'), false)
      or public.has_role('careers_recruiter') or public.has_role('careers_admin')
$$;

create or replace function public.is_reviewer()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.role_of(auth.uid()) in ('reviewer','admin'), false)
      or public.has_role('pitch_reviewer') or public.has_role('pitch_admin')
$$;

-- New: insights editorial check.
create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('insights_editor') or public.has_role('insights_admin')
$$;

-- RLS: a user reads their own roles; admins (legacy 'admin' or super_admin) manage all.
drop policy if exists "user_roles self read" on public.user_roles;
create policy "user_roles self read" on public.user_roles for select to authenticated
  using ( user_id = auth.uid() or public.is_admin() );
drop policy if exists "user_roles admin manage" on public.user_roles;
create policy "user_roles admin manage" on public.user_roles for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- Backfill: existing legacy admins also get super_admin in the new model.
insert into public.user_roles (user_id, role)
select id, 'super_admin'::module_role from public.profiles where role = 'admin'
on conflict (user_id, role) do nothing;
