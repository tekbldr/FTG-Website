-- ============================================================================
-- FTG Platforms — Schema (Careers/ATS + Founder Pitch)
-- Postgres / Supabase. Run order: 0001_schema → 0002_rls → 0003_storage → 0004_seed
-- ============================================================================

create extension if not exists pgcrypto;      -- gen_random_uuid()
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type app_role            as enum ('member','recruiter','reviewer','admin');
  create type job_status          as enum ('draft','open','on_hold','closed','filled');
  create type employment_type     as enum ('full_time','part_time','contract','internship');
  create type work_mode           as enum ('onsite','hybrid','remote');
  create type application_status  as enum ('active','rejected','withdrawn','hired');
  create type attachment_type     as enum ('resume','cover_letter','portfolio');
  create type scan_status         as enum ('pending','clean','infected','error');
  create type ats_recommendation  as enum ('strong_yes','yes','neutral','no','strong_no');
  create type program_status      as enum ('draft','open','in_review','closed');
  create type submission_status   as enum ('draft','submitted','under_review','shortlisted','funded','declined','withdrawn');
  create type document_type       as enum ('pitch_deck','financials','cap_table','business_plan','supporting');
  create type assignment_status   as enum ('assigned','in_progress','completed','declined');
  create type review_recommendation as enum ('fund','discuss','decline');
  create type decision_type       as enum ('funded','declined','waitlisted');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ----------------------------------------------------------------------------
-- Identity: profiles mirror auth.users (1:1). Role gates staff areas.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        app_role not null default 'member',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helper functions (SECURITY DEFINER → avoid recursive RLS on profiles)
create or replace function public.role_of(uid uuid)
returns app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = uid
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.role_of(auth.uid()) = 'admin', false)
$$;
create or replace function public.is_recruiter()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.role_of(auth.uid()) in ('recruiter','admin'), false)
$$;
create or replace function public.is_reviewer()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.role_of(auth.uid()) in ('reviewer','admin'), false)
$$;

-- ============================================================================
-- PLATFORM 1 — CAREERS / ATS
-- ============================================================================
create table if not exists public.departments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ats_stages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int  not null,
  stage_type text not null default 'active',  -- active | offer | hired | rejected
  is_terminal boolean not null default false
);

create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  summary       text,
  description   text,
  responsibilities text,
  requirements  text,
  department_id uuid references public.departments(id) on delete set null,
  location      text,
  employment_type employment_type not null default 'full_time',
  work_mode     work_mode not null default 'onsite',
  salary_min    int,
  salary_max    int,
  salary_currency text default 'USD',
  status        job_status not null default 'draft',
  created_by    uuid references public.profiles(id) on delete set null,
  posted_at     timestamptz,
  closed_at     timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_department on public.jobs(department_id);
create trigger trg_jobs_updated before update on public.jobs
  for each row execute function public.set_updated_at();

create table if not exists public.candidates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references public.profiles(id) on delete cascade,
  first_name text,
  last_name  text,
  email      text not null,
  phone      text,
  linkedin_url text,
  location   text,
  source     text,
  summary    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_candidates_updated before update on public.candidates
  for each row execute function public.set_updated_at();

create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid not null references public.candidates(id) on delete cascade,
  job_id        uuid not null references public.jobs(id) on delete cascade,
  current_stage_id uuid references public.ats_stages(id) on delete set null,
  status        application_status not null default 'active',
  cover_note    text,
  answers       jsonb not null default '{}'::jsonb,   -- flexible custom fields
  source        text,
  assigned_recruiter_id uuid references public.profiles(id) on delete set null,
  applied_at    timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (candidate_id, job_id)
);
create index if not exists idx_applications_job on public.applications(job_id);
create index if not exists idx_applications_candidate on public.applications(candidate_id);
create index if not exists idx_applications_stage on public.applications(current_stage_id);
create trigger trg_applications_updated before update on public.applications
  for each row execute function public.set_updated_at();

create table if not exists public.attachments (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid not null references public.candidates(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  type          attachment_type not null default 'resume',
  file_key      text not null,         -- storage object key (private bucket)
  file_name     text not null,
  mime_type     text,
  size_bytes    bigint,
  scan_status   scan_status not null default 'pending',
  uploaded_at   timestamptz not null default now()
);
create index if not exists idx_attachments_candidate on public.attachments(candidate_id);

create table if not exists public.application_stage_history (
  id            uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  from_stage_id uuid references public.ats_stages(id) on delete set null,
  to_stage_id   uuid references public.ats_stages(id) on delete set null,
  changed_by    uuid references public.profiles(id) on delete set null,
  changed_at    timestamptz not null default now(),
  reason        text,
  notes         text
);
create index if not exists idx_ash_application on public.application_stage_history(application_id);

create table if not exists public.scorecards (
  id            uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  reviewer_id   uuid not null references public.profiles(id) on delete cascade,
  rating        int check (rating between 1 and 5),
  recommendation ats_recommendation,
  notes         text,
  created_at    timestamptz not null default now(),
  unique (application_id, reviewer_id)
);

-- ============================================================================
-- PLATFORM 2 — FOUNDER PITCH / DEAL-FLOW + REVIEW
-- ============================================================================
create table if not exists public.rubrics (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rubric_criteria (
  id          uuid primary key default gen_random_uuid(),
  rubric_id   uuid not null references public.rubrics(id) on delete cascade,
  name        text not null,
  description text,
  weight      numeric not null default 1,
  max_score   int not null default 10,
  sort_order  int not null default 0
);

create table if not exists public.pitch_stages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int not null,
  stage_type  text not null default 'active',  -- active | decision | funded | declined
  is_terminal boolean not null default false
);

create table if not exists public.programs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  type        text not null default 'fund',  -- fund | accelerator | grant
  description text,
  rubric_id   uuid references public.rubrics(id) on delete set null,
  opens_at    timestamptz,
  closes_at   timestamptz,
  status      program_status not null default 'open',
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_programs_updated before update on public.programs
  for each row execute function public.set_updated_at();

create table if not exists public.founders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references public.profiles(id) on delete cascade,
  name         text,
  email        text not null,
  organization text,
  website      text,
  bio          text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_founders_updated before update on public.founders
  for each row execute function public.set_updated_at();

create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  founder_id    uuid not null references public.founders(id) on delete cascade,
  program_id    uuid not null references public.programs(id) on delete cascade,
  title         text not null,
  company_name  text,
  one_liner     text,
  sector        text,
  stage_of_company text,
  amount_requested numeric,
  currency      text default 'USD',
  details       jsonb not null default '{}'::jsonb,
  current_stage_id uuid references public.pitch_stages(id) on delete set null,
  status        submission_status not null default 'draft',
  frozen_at     timestamptz,          -- immutable snapshot timestamp on submit
  assigned_owner_id uuid references public.profiles(id) on delete set null,
  submitted_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (founder_id, program_id)
);
create index if not exists idx_submissions_program on public.submissions(program_id);
create index if not exists idx_submissions_founder on public.submissions(founder_id);
create index if not exists idx_submissions_stage on public.submissions(current_stage_id);
create trigger trg_submissions_updated before update on public.submissions
  for each row execute function public.set_updated_at();

create table if not exists public.documents (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  type          document_type not null default 'pitch_deck',
  file_key      text not null,
  file_name     text not null,
  mime_type     text,
  size_bytes    bigint,
  version       int not null default 1,
  scan_status   scan_status not null default 'pending',
  uploaded_at   timestamptz not null default now()
);
create index if not exists idx_documents_submission on public.documents(submission_id);

create table if not exists public.submission_stage_history (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  from_stage_id uuid references public.pitch_stages(id) on delete set null,
  to_stage_id   uuid references public.pitch_stages(id) on delete set null,
  changed_by    uuid references public.profiles(id) on delete set null,
  changed_at    timestamptz not null default now(),
  reason        text
);
create index if not exists idx_ssh_submission on public.submission_stage_history(submission_id);

create table if not exists public.review_assignments (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  reviewer_id   uuid not null references public.profiles(id) on delete cascade,
  assigned_by   uuid references public.profiles(id) on delete set null,
  assigned_at   timestamptz not null default now(),
  due_at        timestamptz,
  status        assignment_status not null default 'assigned',
  is_conflict   boolean not null default false,
  unique (submission_id, reviewer_id)
);

create table if not exists public.conflicts_of_interest (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  reviewer_id   uuid not null references public.profiles(id) on delete cascade,
  declared_at   timestamptz not null default now(),
  reason        text
);

create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  reviewer_id   uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid references public.review_assignments(id) on delete set null,
  overall_score numeric,
  recommendation review_recommendation,
  comments      text,
  confidence    int check (confidence between 1 and 5),
  submitted_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (submission_id, reviewer_id)
);
create trigger trg_reviews_updated before update on public.reviews
  for each row execute function public.set_updated_at();

create table if not exists public.review_scores (
  id          uuid primary key default gen_random_uuid(),
  review_id   uuid not null references public.reviews(id) on delete cascade,
  criterion_id uuid not null references public.rubric_criteria(id) on delete cascade,
  score       numeric not null,
  comment     text,
  unique (review_id, criterion_id)
);

create table if not exists public.decisions (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  decision      decision_type not null,
  amount_awarded numeric,
  decided_by    uuid references public.profiles(id) on delete set null,
  decided_at    timestamptz not null default now(),
  rationale     text
);

create table if not exists public.comments (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  author_id     uuid references public.profiles(id) on delete set null,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  body          text not null,
  is_internal   boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists idx_comments_submission on public.comments(submission_id);
