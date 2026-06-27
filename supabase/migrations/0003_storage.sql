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
