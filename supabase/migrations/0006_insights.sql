-- ============================================================================
-- 0006 — Insights CMS: DB-backed posts + editorial workflow
-- Posts move draft → in_review → published (→ archived). Public reads published;
-- editors see/manage their drafts; insights_admin (and super_admin) manage all.
-- Reuses the role helpers from 0005 (is_editor / has_role / is_super_admin).
-- ============================================================================

do $$ begin
  create type post_status as enum ('draft','in_review','published','archived');
exception when duplicate_object then null; end $$;

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  dek          text,
  body         text,
  type         text not null default 'article',    -- news|article|story|podcast|research
  vertical     text not null default 'The Group',  -- The Group|Markets|Applied AI|Money|MENA
  cover        text,
  read_time    text,                                -- "6 min read" / "34 min listen"
  external_url text,
  featured     boolean not null default false,
  tags         text[] not null default '{}',
  status       post_status not null default 'draft',
  author_id    uuid references public.profiles(id) on delete set null,
  author_name  text,                                -- editorial byline (may differ from author_id)
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_posts_status on public.posts(status, published_at desc);
create index if not exists idx_posts_author on public.posts(author_id);

create or replace function public.touch_posts_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists posts_touch_updated on public.posts;
create trigger posts_touch_updated before update on public.posts
  for each row execute function public.touch_posts_updated_at();

alter table public.posts enable row level security;

-- Public (incl. anon) reads only published; editors additionally see everything.
drop policy if exists "posts public read" on public.posts;
create policy "posts public read" on public.posts for select
  using ( status = 'published' or public.is_editor() );

drop policy if exists "posts editor insert" on public.posts;
create policy "posts editor insert" on public.posts for insert to authenticated
  with check ( public.is_editor() );

drop policy if exists "posts update" on public.posts;
create policy "posts update" on public.posts for update to authenticated
  using ( public.has_role('insights_admin') or (public.is_editor() and author_id = auth.uid()) )
  with check ( public.has_role('insights_admin') or (public.is_editor() and author_id = auth.uid()) );

drop policy if exists "posts admin delete" on public.posts;
create policy "posts admin delete" on public.posts for delete to authenticated
  using ( public.has_role('insights_admin') );
