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
