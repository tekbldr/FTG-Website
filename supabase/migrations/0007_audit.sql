-- ============================================================================
-- 0007 — Audit log: append-only record of privileged actions across the group.
-- Written server-side via the service-role client; read by super admins.
-- ============================================================================

create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.profiles(id) on delete set null,
  actor_email text,
  action      text not null,                 -- role.grant | post.publish | application.stage ...
  entity_type text,                          -- user_role | post | application | submission
  entity_id   text,
  summary     text,                          -- human-readable one-liner
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists idx_audit_created on public.audit_log(created_at desc);
create index if not exists idx_audit_entity on public.audit_log(entity_type, entity_id);

alter table public.audit_log enable row level security;

-- Super admins (incl. backfilled legacy admins) read the full log. No insert/update/
-- delete policy → it is append-only and only the service-role client may write.
drop policy if exists "audit super read" on public.audit_log;
create policy "audit super read" on public.audit_log for select to authenticated
  using ( public.is_super_admin() or coalesce(public.role_of(auth.uid()) = 'admin', false) );
