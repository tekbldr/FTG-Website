# CLAUDE.md — FTG Platforms (handoff context)

> Context handoff for continuing this build in Claude Code. Read this first. It captures
> what the project is, every decision already made, what's built vs. remaining, the
> conventions to follow, and the exact next tasks. A longer rationale lives in two sibling
> docs (see "Reference docs" at the bottom).

## ⚠️ Read before writing code
- **This codebase has never been compiled or run.** It was authored in an environment with
  **no network and no Node**, so `npm install`, `tsc`, and `next dev` have never executed.
  **First job in Claude Code:** `npm install`, then `npm run typecheck` and `npm run dev`,
  and fix any type/import errors before adding features. Treat existing files as a reviewed
  draft, not battle-tested code.
- The database side **has** been run successfully against a live Supabase project (migrations
  applied, including the enum-cast fix in the seed). Schema is trustworthy.

## What this is
Two production platforms for **First Tech Group (FTG)** — a MENA-focused (KSA/UAE) venture
firm that **funds, builds, and operates** startups. Both live in **one Next.js App Router
app** on Vercel, backed by **Supabase** (Postgres + Auth + Storage + RLS), skinned to the
FTG identity.

- **Careers / ATS** (`/careers`, `/portal/candidate`, `/admin/recruiting`): public job board,
  application flow with resume upload, candidate status tracking, recruiter pipeline.
- **Founder pitch** (`/pitch`, `/portal/founder`, `/admin/review`): founder accounts, structured
  intake + deck/financials upload, founder dashboard, admin review pipeline with rubric scoring.

## Decisions already locked (do not relitigate)
- **Path A** hosting: managed Supabase in **Frankfurt (eu-central-1)** + Vercel. Code is written
  to be portable to Path B (self-host Postgres/Storage on AWS in-region `me-central-2`) with no
  app changes if counsel requires in-Kingdom storage.
- **One app, two route groups** (not two repos). Shared auth, design system, file pipeline.
- **Stack:** Next.js 14 (App Router, TS), Tailwind, `@supabase/ssr`, zod. No component library —
  bespoke design system in `src/components/ui.tsx`.
- **Auth:** Supabase email/password (+ magic link/OAuth possible later). Roles via `profiles.role`.
- **Files:** private buckets, server-signed uploads, virus scan, gated signed-URL downloads.

## Current status
**Done & trustworthy (DB):** `supabase/migrations/0001…0004` + `supabase/setup.sql` (combined).
Full schema for both platforms, RLS on every table, private buckets `resumes` + `pitch-docs`,
seed (ATS + pitch stages, default rubric, sample jobs, one open program). Applied to live Supabase.

**Done but unverified by execution (app):**
- Scaffold + config: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.example`.
- Design system: `src/components/ui.tsx` (Button, LinkButton, Input, Textarea, Select, Field, Label, Badge, Stepper, Eyebrow), `src/components/brand.tsx` (Logo, TopNav, Footer), `src/app/globals.css` (brand tokens + utilities).
- Supabase libs: `src/lib/supabase/{client,server,admin,middleware}.ts`; `src/middleware.ts` (session refresh + guards `/portal` and `/admin`).
- Auth: `src/lib/auth.ts` (getUser/getProfile/requireUser/requireRole), `src/app/login`, `src/app/signup`, `src/components/auth-form.tsx`, `src/app/auth/callback/route.ts`.
- Secure file pipeline: `src/lib/files.ts` (allowlist + validation + server key gen), `src/lib/scan.ts` (ClamAV/Cloudmersive), `src/app/api/files/{sign,scan,download}/route.ts`.
- Hub: `src/app/page.tsx` routes to `/careers` and `/pitch`.

**NOT built yet — these are the next tasks:**
1. **Careers UI** — `/careers` listings + filter/search, `/careers/[slug]` role detail, application
   wizard (multi-step, resume upload via the pipeline), `/portal/candidate` status dashboard with
   timeline, `/admin/recruiting` Kanban pipeline + stage history + scorecards.
2. **Pitch UI** — `/pitch` program landing, founder intake wizard, multi-file upload, `/portal/founder`
   dashboard, `/admin/review` Kanban + rubric scorecards + multi-reviewer scoring + decisions + COI.
3. **Cross-cutting** — email notifications (Resend) on stage changes, retention/auto-delete job
   (6-month default for unsuccessful applicants), RLS test checklist, a11y + Lighthouse pass.

## Environment variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=         # project url
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # public, browser-safe
SUPABASE_SERVICE_ROLE_KEY=        # SERVER ONLY — bypasses RLS, never bundle to client
CLOUDMERSIVE_API_KEY=             # optional: managed scan (resumes)
CLAMAV_SCAN_URL=                  # optional: self-hosted scan (confidential pitch docs)
ALLOW_UNSCANNED=1                 # DEV ONLY — lets uploads through with no scanner
RESEND_API_KEY=                   # optional: email
EMAIL_FROM="FTG <careers@ftg.vc>"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Run: `npm install && npm run dev`. Make an admin after first signup:
`update public.profiles set role='admin' where email='you@ftg.vc';`

## Data model (summary — full DDL in `supabase/migrations/0001_schema.sql`)
**Shared:** `profiles` (1:1 auth.users, `role` ∈ member|recruiter|reviewer|admin; auto-created by
trigger `handle_new_user`). Role helpers `is_admin()/is_recruiter()/is_reviewer()` are
`SECURITY DEFINER` (avoid recursive RLS).

**Careers:** `departments`, `ats_stages` (ordered lookup), `jobs`, `candidates` (1:1 profile),
`applications` (spine; `UNIQUE(candidate_id,job_id)`; denormalized `current_stage_id` + flexible
`answers jsonb`), `attachments` (storage `file_key`, `scan_status`), `application_stage_history`
(event-sourced audit/analytics), `scorecards`.

**Pitch:** `programs`, `rubrics` + `rubric_criteria` (data-driven scorecard), `pitch_stages`,
`founders` (1:1 profile), `submissions` (spine; `UNIQUE(founder_id,program_id)`; `frozen_at`
snapshot + `details jsonb`), `documents`, `submission_stage_history`, `review_assignments`
(`UNIQUE(submission_id,reviewer_id)`), `conflicts_of_interest`, `reviews`
(`UNIQUE(submission_id,reviewer_id)`), `review_scores` (per-criterion), `decisions`, `comments`.

**Modeling rules:** person entity separate from the application/submission join; stage moves append
to history (don't overwrite); stages & rubric criteria are lookup rows (reconfigurable without
migrations); files are storage keys, never blobs; M2M via explicit join tables with `UNIQUE` keys.

## Security model — follow these conventions exactly
- **RLS is the backstop on every table** (`0002_rls.sql`). External users (`member`) read only
  their own rows via `auth.uid()`; staff override via the role helpers. Reviewers see only
  submissions they're **assigned** to. **Never disable RLS.** When you need a privileged staff
  write (stage move, scan-status update, assignment), do it **server-side** with the service-role
  client (`createAdminClient()` in `src/lib/supabase/admin.ts`, marked `server-only`).
- **File pipeline (`src/app/api/files/*`):** (1) `sign` validates type/size (allowlist in
  `src/lib/files.ts`) and returns a signed upload URL to a **server-generated key** under
  `{userId}/...`; (2) client uploads directly; (3) `scan` downloads with service role, virus-scans,
  deletes if infected; (4) `download` verifies ownership/assignment **and** `scan_status='clean'`,
  then issues a **60-second** signed GET. Clients never pass raw storage paths (anti-IDOR).
- OWASP priorities honored: A01 broken access control (RLS + server checks), file-upload allowlist,
  service-role kept off the client. Keep it that way.

## Design system & UX conventions (match the marketing site)
- **Tokens** (Tailwind + CSS vars): `ink #0B0B0E`, `ink-2 #0f0f14`, `paper #FAFAF7`,
  `spark #FF5E2C`, `graphite #26262E`; lines `rgba(250,250,247,.09/.16)`; muted text
  `rgba(250,250,247,.56/.38)`. **One Spark accent per view.** Mono (JetBrains Mono) for eyebrows,
  labels, stats, section indices (`01 —`); Arimo for body/headings. Engineered grid (`.grid-bg`),
  hairline borders, `rounded-[2px]`, generous negative space. Reduced-motion safe (handled in
  `globals.css`). Use existing `ui.tsx` atoms — don't introduce a component library.
- **UX patterns to implement** (evidence-based; details in the research doc): multi-step wizard with
  `<Stepper>` but minimize fields; single-column, labels above inputs, mark required AND optional;
  inline validation on blur with `role="alert"`; save-and-resume; resume-parse autofill (nice-to-have);
  candidate/founder **status timeline**; file upload = drag-drop **with a native input fallback**,
  per-file progress, validate-before-upload, ARIA live regions; admin = **Kanban** (columns from the
  stages lookup) + short rubric scorecards + reviewer-progress view. WCAG: programmatic labels,
  `aria-required`, `aria-invalid`+`aria-describedby`, never color alone.

## Routing plan for the unbuilt pages
```
/careers                      public job board (filter by dept/location/type) — reads jobs where status='open'
/careers/[slug]               role detail + "Apply" (auth-gated; redirect to /login?next=)
/portal/candidate             my applications + status timeline (reads own applications + stage history)
/admin/recruiting             requireRole('recruiter'); job CRUD + Kanban (drag = insert stage_history + update current_stage_id via service role)
/pitch                        program landing + "Submit"
/portal/founder               my submissions + status
/portal/founder/new           intake wizard + document uploads
/admin/review                 requireRole('reviewer'); Kanban + scorecards + decisions
```
Server Components for reads (RLS-scoped `createClient()` from `src/lib/supabase/server`); Server
Actions / route handlers for writes; service-role only for privileged staff mutations.

## Gotchas / lessons from this session
- **Enums in multi-row `VALUES`** type as `text` and won't coerce — cast explicitly
  (`'full_time'::employment_type`). The jobs seed already fixed; watch for this in any new seed.
- Service-role client must stay server-only; `admin.ts` has `import "server-only"`.
- `experimental.serverActions.bodySizeLimit` is 5mb — large uploads go direct-to-storage via signed
  URL, not through a server action body.
- Email confirmation is ON by default in Supabase; toggle off under Auth → Providers → Email for
  faster local testing.

## Reference docs (in the outputs folder, not the repo)
- `FTG-platforms-research-and-architecture.md` — cited research: stack comparison, full data models,
  security (OWASP/RLS/scanning), KSA/UAE PDPL + GDPR compliance, UX patterns, costs, sources.
- `FTG-website-brief.md` — the marketing site brief (separate `ftg-site/` landing page project).

## Compliance reminders
Path A stores PII in Frankfurt → pair with SDAIA SCCs + transfer risk assessment for KSA data; add
a privacy notice + consent copy for candidates/founders; implement 6-month retention + erasure for
unsuccessful applicants. Confidential pitch decks should use self-hosted ClamAV, never a public
scanning API.
