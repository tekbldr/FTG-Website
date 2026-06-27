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
