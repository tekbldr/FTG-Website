# First Tech Group — Website + Platforms

The First Tech Group site and its two operating platforms in **one Next.js (App Router) app**, deployed on Vercel, backed by **Supabase** (Postgres + Auth + Storage + Row-Level Security). Skinned to the FTG identity (Ink / Paper / Spark, mono labels, engineered grid, reduced-motion safe).

- **`/`** — the group site: the convergence thesis, the three pillars (Exx1 · PRVAI · PRV Wallet), the compounding loop.
- **`/careers`** — job board → apply with résumé upload → candidate status tracking → recruiter pipeline (`/admin/recruiting`).
- **`/pitch`** — founder intake + deck/financials upload → founder dashboard → reviewer pipeline with rubric scoring (`/admin/review`).

> The previous static landing page is preserved in [`legacy/index.html`](legacy/index.html). Its design now lives as the Next homepage.

## Setup

```bash
npm install
cp .env.example .env.local          # then fill in your Supabase keys (Project Settings → API)
npm run dev                          # http://localhost:3000
```

Run the database SQL once in the Supabase SQL editor: `supabase/migrations/0001 … 0004` (or the combined `supabase/setup.sql`). Make yourself an admin after signing up:

```sql
update public.profiles set role = 'admin' where email = 'you@ftg.vc';
```

## Deploy (Vercel)

Import the repo → add the same env vars (mark `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` as sensitive) → deploy. Point your domain at it. The 6-month data-retention job (`/api/jobs/retention`) runs on the schedule in [`vercel.json`](vercel.json).

## Security model

Row-Level Security on every table; private storage buckets; server-signed uploads → virus scan → gated 60-second signed downloads; the service-role key is server-only. Full details in [`CLAUDE.md`](CLAUDE.md).

## Stack

Next.js 14 (App Router, TypeScript) · Tailwind · `@supabase/ssr` · zod · a bespoke design system in `src/components/ui.tsx` (no component library).
