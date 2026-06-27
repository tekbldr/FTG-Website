-- =============================================================
-- FTG Platforms — FULL SETUP (all migrations in one file)
-- Paste into Supabase SQL Editor and Run once.
-- =============================================================


-- >>>>>>>>>>>>>>>>>>>>>>>> migrations/0001_schema.sql >>>>>>>>>>>>>>>>>>>>>>>>

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


-- >>>>>>>>>>>>>>>>>>>>>>>> migrations/0002_rls.sql >>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- FTG Platforms — Row-Level Security
-- Principle: deny by default; owners see only their rows; staff override by role.
-- Privileged staff writes (stage moves, scan-status, assignments) run server-side
-- with the service-role key, which bypasses RLS. These policies protect the
-- anon/authenticated client paths.
-- ============================================================================

-- Enable RLS everywhere
alter table public.profiles                  enable row level security;
alter table public.departments               enable row level security;
alter table public.ats_stages                enable row level security;
alter table public.jobs                      enable row level security;
alter table public.candidates                enable row level security;
alter table public.applications              enable row level security;
alter table public.attachments               enable row level security;
alter table public.application_stage_history enable row level security;
alter table public.scorecards                enable row level security;
alter table public.rubrics                   enable row level security;
alter table public.rubric_criteria           enable row level security;
alter table public.pitch_stages              enable row level security;
alter table public.programs                  enable row level security;
alter table public.founders                  enable row level security;
alter table public.submissions               enable row level security;
alter table public.documents                 enable row level security;
alter table public.submission_stage_history  enable row level security;
alter table public.review_assignments        enable row level security;
alter table public.conflicts_of_interest     enable row level security;
alter table public.reviews                   enable row level security;
alter table public.review_scores             enable row level security;
alter table public.decisions                 enable row level security;
alter table public.comments                  enable row level security;

-- ---------------------------------------------------------------- profiles
create policy "profiles self read"   on public.profiles for select to authenticated
  using ( id = auth.uid() or public.is_admin() );
create policy "profiles self update" on public.profiles for update to authenticated
  using ( id = auth.uid() ) with check ( id = auth.uid() and role = public.role_of(auth.uid()) );

-- ---------------------------------------------------------------- careers: public reference data
create policy "jobs public read"   on public.jobs for select to anon, authenticated
  using ( status in ('open') or public.is_recruiter() );
create policy "jobs staff write"   on public.jobs for all to authenticated
  using ( public.is_recruiter() ) with check ( public.is_recruiter() );

create policy "departments read"   on public.departments for select to anon, authenticated using ( true );
create policy "departments write"  on public.departments for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

create policy "ats_stages read"    on public.ats_stages for select to authenticated using ( true );
create policy "ats_stages write"   on public.ats_stages for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---------------------------------------------------------------- candidates
create policy "candidates owner read"   on public.candidates for select to authenticated
  using ( user_id = auth.uid() or public.is_recruiter() );
create policy "candidates owner insert" on public.candidates for insert to authenticated
  with check ( user_id = auth.uid() );
create policy "candidates owner update" on public.candidates for update to authenticated
  using ( user_id = auth.uid() or public.is_recruiter() )
  with check ( user_id = auth.uid() or public.is_recruiter() );

-- ---------------------------------------------------------------- applications
create policy "applications read" on public.applications for select to authenticated
  using (
    exists (select 1 from public.candidates c where c.id = applications.candidate_id and c.user_id = auth.uid())
    or public.is_recruiter()
  );
create policy "applications owner insert" on public.applications for insert to authenticated
  with check (
    exists (select 1 from public.candidates c where c.id = applications.candidate_id and c.user_id = auth.uid())
  );
create policy "applications staff update" on public.applications for update to authenticated
  using ( public.is_recruiter() ) with check ( public.is_recruiter() );

-- ---------------------------------------------------------------- attachments
create policy "attachments read" on public.attachments for select to authenticated
  using (
    exists (select 1 from public.candidates c where c.id = attachments.candidate_id and c.user_id = auth.uid())
    or public.is_recruiter()
  );
create policy "attachments owner insert" on public.attachments for insert to authenticated
  with check (
    exists (select 1 from public.candidates c where c.id = attachments.candidate_id and c.user_id = auth.uid())
  );

-- ---------------------------------------------------------------- application stage history
create policy "ash read" on public.application_stage_history for select to authenticated
  using (
    exists (
      select 1 from public.applications a
      join public.candidates c on c.id = a.candidate_id
      where a.id = application_stage_history.application_id and c.user_id = auth.uid()
    )
    or public.is_recruiter()
  );
create policy "ash staff insert" on public.application_stage_history for insert to authenticated
  with check ( public.is_recruiter() );

-- ---------------------------------------------------------------- scorecards (staff only)
create policy "scorecards staff" on public.scorecards for all to authenticated
  using ( public.is_recruiter() ) with check ( public.is_recruiter() );

-- ---------------------------------------------------------------- pitch: reference data
create policy "programs public read" on public.programs for select to anon, authenticated
  using ( status in ('open','in_review') or public.is_admin() );
create policy "programs staff write" on public.programs for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

create policy "pitch_stages read"  on public.pitch_stages for select to authenticated using ( true );
create policy "pitch_stages write" on public.pitch_stages for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

create policy "rubrics read"  on public.rubrics for select to authenticated using ( true );
create policy "rubrics write" on public.rubrics for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );
create policy "criteria read"  on public.rubric_criteria for select to authenticated using ( true );
create policy "criteria write" on public.rubric_criteria for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---------------------------------------------------------------- founders
create policy "founders owner read" on public.founders for select to authenticated
  using ( user_id = auth.uid() or public.is_reviewer() );
create policy "founders owner insert" on public.founders for insert to authenticated
  with check ( user_id = auth.uid() );
create policy "founders owner update" on public.founders for update to authenticated
  using ( user_id = auth.uid() ) with check ( user_id = auth.uid() );

-- ---------------------------------------------------------------- submissions
-- founder owns; assigned reviewer can read; admin reads all
create policy "submissions read" on public.submissions for select to authenticated
  using (
    exists (select 1 from public.founders f where f.id = submissions.founder_id and f.user_id = auth.uid())
    or public.is_admin()
    or exists (select 1 from public.review_assignments ra
               where ra.submission_id = submissions.id and ra.reviewer_id = auth.uid())
  );
create policy "submissions owner insert" on public.submissions for insert to authenticated
  with check (
    exists (select 1 from public.founders f where f.id = submissions.founder_id and f.user_id = auth.uid())
  );
create policy "submissions update" on public.submissions for update to authenticated
  using (
    exists (select 1 from public.founders f where f.id = submissions.founder_id and f.user_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.founders f where f.id = submissions.founder_id and f.user_id = auth.uid())
    or public.is_admin()
  );

-- ---------------------------------------------------------------- documents
create policy "documents read" on public.documents for select to authenticated
  using (
    exists (
      select 1 from public.submissions s
      join public.founders f on f.id = s.founder_id
      where s.id = documents.submission_id and f.user_id = auth.uid()
    )
    or public.is_admin()
    or exists (select 1 from public.review_assignments ra
               where ra.submission_id = documents.submission_id and ra.reviewer_id = auth.uid())
  );
create policy "documents owner insert" on public.documents for insert to authenticated
  with check (
    exists (
      select 1 from public.submissions s
      join public.founders f on f.id = s.founder_id
      where s.id = documents.submission_id and f.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------- submission stage history
create policy "ssh read" on public.submission_stage_history for select to authenticated
  using (
    exists (
      select 1 from public.submissions s
      join public.founders f on f.id = s.founder_id
      where s.id = submission_stage_history.submission_id and f.user_id = auth.uid()
    )
    or public.is_reviewer()
  );
create policy "ssh staff insert" on public.submission_stage_history for insert to authenticated
  with check ( public.is_admin() );

-- ---------------------------------------------------------------- review assignments (reviewer + admin)
create policy "assignments read" on public.review_assignments for select to authenticated
  using ( reviewer_id = auth.uid() or public.is_admin() );
create policy "assignments admin write" on public.review_assignments for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

create policy "coi read" on public.conflicts_of_interest for select to authenticated
  using ( reviewer_id = auth.uid() or public.is_admin() );
create policy "coi reviewer insert" on public.conflicts_of_interest for insert to authenticated
  with check ( reviewer_id = auth.uid() or public.is_admin() );

-- ---------------------------------------------------------------- reviews (reviewer own + admin; founders never)
create policy "reviews read" on public.reviews for select to authenticated
  using ( reviewer_id = auth.uid() or public.is_admin() );
create policy "reviews reviewer insert" on public.reviews for insert to authenticated
  with check ( reviewer_id = auth.uid() and public.is_reviewer() );
create policy "reviews reviewer update" on public.reviews for update to authenticated
  using ( reviewer_id = auth.uid() ) with check ( reviewer_id = auth.uid() );

create policy "review_scores read" on public.review_scores for select to authenticated
  using (
    exists (select 1 from public.reviews r where r.id = review_scores.review_id
            and (r.reviewer_id = auth.uid() or public.is_admin()))
  );
create policy "review_scores write" on public.review_scores for all to authenticated
  using (
    exists (select 1 from public.reviews r where r.id = review_scores.review_id and r.reviewer_id = auth.uid())
  )
  with check (
    exists (select 1 from public.reviews r where r.id = review_scores.review_id and r.reviewer_id = auth.uid())
  );

-- ---------------------------------------------------------------- decisions & comments (staff only)
create policy "decisions staff" on public.decisions for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );
create policy "comments staff" on public.comments for all to authenticated
  using ( public.is_reviewer() ) with check ( public.is_reviewer() );


-- >>>>>>>>>>>>>>>>>>>>>>>> migrations/0003_storage.sql >>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- FTG Platforms — Storage buckets + policies
-- Two PRIVATE buckets. Files live under a per-user folder: {auth.uid}/{uuid}-{name}
-- Owners upload/read only their own folder. Staff/reviewer downloads are issued
-- server-side via the service-role key (bypasses RLS) after an ownership/assignment
-- check + scan_status='clean' verification. Object keys are server-generated (no IDOR).
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false), ('pitch-docs', 'pitch-docs', false)
on conflict (id) do nothing;

-- Owner can upload into their own folder
create policy "own upload resumes" on storage.objects for insert to authenticated
  with check ( bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text );
create policy "own upload pitch" on storage.objects for insert to authenticated
  with check ( bucket_id = 'pitch-docs' and (storage.foldername(name))[1] = auth.uid()::text );

-- Owner can read their own folder
create policy "own read resumes" on storage.objects for select to authenticated
  using ( bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text );
create policy "own read pitch" on storage.objects for select to authenticated
  using ( bucket_id = 'pitch-docs' and (storage.foldername(name))[1] = auth.uid()::text );

-- Owner can replace/delete their own (e.g. re-upload before submit)
create policy "own modify resumes" on storage.objects for update to authenticated
  using ( bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text );
create policy "own delete resumes" on storage.objects for delete to authenticated
  using ( bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text );
create policy "own modify pitch" on storage.objects for update to authenticated
  using ( bucket_id = 'pitch-docs' and (storage.foldername(name))[1] = auth.uid()::text );
create policy "own delete pitch" on storage.objects for delete to authenticated
  using ( bucket_id = 'pitch-docs' and (storage.foldername(name))[1] = auth.uid()::text );

-- Admins may read all objects (recruiters/reviewers use server-side signed URLs)
create policy "admin read resumes" on storage.objects for select to authenticated
  using ( bucket_id = 'resumes' and public.is_recruiter() );
create policy "admin read pitch" on storage.objects for select to authenticated
  using ( bucket_id = 'pitch-docs' and public.is_admin() );


-- >>>>>>>>>>>>>>>>>>>>>>>> migrations/0004_seed.sql >>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- FTG Platforms — Seed data (stages, rubric, sample jobs + program)
-- Safe to run once on a fresh project. Re-running is guarded by NOT EXISTS checks.
-- ============================================================================

-- ATS pipeline stages
insert into public.ats_stages (name, sort_order, stage_type, is_terminal)
select * from (values
  ('Applied',     1, 'active',   false),
  ('Screening',   2, 'active',   false),
  ('Phone Screen',3, 'active',   false),
  ('Onsite',      4, 'active',   false),
  ('Offer',       5, 'offer',    false),
  ('Hired',       6, 'hired',    true),
  ('Rejected',    7, 'rejected', true)
) v(name, sort_order, stage_type, is_terminal)
where not exists (select 1 from public.ats_stages);

-- Pitch pipeline stages
insert into public.pitch_stages (name, sort_order, stage_type, is_terminal)
select * from (values
  ('Intake',              1, 'active',   false),
  ('Screening',           2, 'active',   false),
  ('Due Diligence',       3, 'active',   false),
  ('Investment Committee',4, 'active',   false),
  ('Funded',              5, 'funded',   true),
  ('Declined',            6, 'declined', true)
) v(name, sort_order, stage_type, is_terminal)
where not exists (select 1 from public.pitch_stages);

-- Default rubric + criteria (VC scorecard)
insert into public.rubrics (name)
select 'FTG Default Scorecard'
where not exists (select 1 from public.rubrics);

insert into public.rubric_criteria (rubric_id, name, description, weight, max_score, sort_order)
select r.id, c.name, c.description, c.weight, 10, c.sort_order
from public.rubrics r
cross join (values
  ('Team',       'Founder quality, domain expertise, ability to execute', 1.5, 1),
  ('Market',     'Size, timing, and tailwinds of the opportunity',        1.2, 2),
  ('Product',    'Differentiation, defensibility, and technical edge',     1.2, 3),
  ('Traction',   'Evidence of demand, growth, and retention',             1.0, 4),
  ('Financials', 'Unit economics, capital efficiency, and the ask',        1.0, 5)
) c(name, description, weight, sort_order)
where r.name = 'FTG Default Scorecard'
and not exists (select 1 from public.rubric_criteria);

-- Departments
insert into public.departments (name)
select v.name from (values ('Engineering'),('AI / PRVAI'),('Markets / Exx1'),('Wallet / PRV'),('Operations')) v(name)
where not exists (select 1 from public.departments);

-- Sample open jobs (public-readable)
insert into public.jobs (title, slug, summary, description, requirements, location, employment_type, work_mode, salary_min, salary_max, status, posted_at)
select title, slug, summary, description, requirements, location,
       employment_type::employment_type, work_mode::work_mode,
       salary_min, salary_max, status::job_status, posted_at
from (values
  ('Senior Full-Stack Engineer','senior-full-stack-engineer',
   'Build the operating stack for the digital economy.',
   'Own features end-to-end across our exchange, wallet, and AI surfaces.',
   '5+ years TypeScript/React/Node. Distributed systems a plus.',
   'Riyadh / Remote','full_time','hybrid',120000,180000,'open', now()),
  ('Applied AI Engineer','applied-ai-engineer',
   'Ship voice and memory systems inside PRVAI products.',
   'Work on orchestration, retrieval, and the memory graph powering Diwan OS.',
   'Strong ML/LLM engineering background; Arabic NLP a plus.',
   'Dubai / Remote','full_time','remote',130000,190000,'open', now()),
  ('Product Designer','product-designer',
   'Design the engineered, restrained FTG product experience.',
   'Lead UX across careers, wallet, and exchange surfaces.',
   'Portfolio showing systems thinking and shipped product.',
   'Remote','full_time','remote',90000,140000,'open', now())
) v(title, slug, summary, description, requirements, location, employment_type, work_mode, salary_min, salary_max, status, posted_at)
where not exists (select 1 from public.jobs);

-- Sample open program for pitch submissions
insert into public.programs (name, slug, type, description, status, opens_at, rubric_id)
select 'FTG Ventures — Rolling', 'ftg-ventures-rolling', 'fund',
       'We fund, build, and operate at the convergence of money and machine intelligence. Pre-seed to Series A.',
       'open', now(), (select id from public.rubrics where name = 'FTG Default Scorecard' limit 1)
where not exists (select 1 from public.programs);

