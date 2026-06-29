# FTG Operational Engine — Admin Panel Product Design

*Research-backed spec (June 2026). Sources: RBAC best practices, headless-CMS editorial workflows (Contentful/Sanity), internal admin/ops-console UX (Retool), collaborative ATS (Greenhouse), SaaS audit-logging.*

## Vision

One **operational engine** for the group: a single role-aware admin that runs Careers, Pitch/deal-flow, and Insights — each as a focused console — on a shared RBAC backbone, with an activity/audit spine. It should feel like Linear/Retool-grade internal tooling, in FTG's dark engineered aesthetic: fast, scannable, "what's happening now" at a glance, diagnostic depth on demand.

## Research synthesis (what the evidence says)

1. **RBAC** — design roles by *business function*, keep the set minimal (80/20 test), and **enforce at the backend** (Supabase RLS + server actions); the UI only *adapts* to role. Modern systems layer context (assignment/ownership) on top of roles. → *We already enforce via RLS; extend the role model, don't move logic to the client.*
2. **Editorial CMS** — Contentful-style **status workflow** (Draft → In review → Published → Archived) + role-based permissions + **scheduled publishing** + audit trail is the proven model. Roles: author → editor → publisher. → *Insights must become DB-backed with this workflow.*
3. **Admin/ops UX** — operational dashboards answer "what's happening right now"; **role-matched layouts** (leads see clean KPIs + alerts; specialists get sortable tables, bulk actions, advanced filters); clear nav beats buried menus; show "last updated." → *Unified shell + per-module consoles + an overview dashboard.*
4. **Collaborative ATS** — assign recruiter / hiring-manager / interviewer per role; **structured interview scorecards** (consistent criteria, less bias); centralized candidate profile with team-visible notes; visibility controls for sensitive data. → *Enhance the recruiting console with notes + scorecards + assignment.*
5. **Audit logs** — **append-only, immutable**; capture who / what / when; **structured event_type + details**; prioritize *internal-team* actions + permission changes; embed a filterable viewer (actor, event, date range); exportable. → *Add an `audit_log` table + viewer.*

## A. Roles & permissions (RBAC)

Move from the single `app_role` enum to a flexible **`user_roles` (user × role)** model so one person can hold several module roles. Minimal, business-function roles:

| Role | Scope |
|---|---|
| `super_admin` | Everything + manage users/roles |
| `careers_admin` / `careers_recruiter` | Manage all / assigned applications |
| `pitch_admin` / `pitch_reviewer` | Manage all / score assigned submissions |
| `insights_admin` / `insights_editor` | Publish + manage all / write & edit own drafts |
| `member` | Default external (candidate / founder) — portal only |

Enforced by RLS helper functions (`has_role(...)`, like the existing `is_admin()`), checked in middleware (`/admin/*`) and server actions. The UI hides modules the user can't access.

## B. The admin shell ("operational engine")

- **`/admin`** — role-aware overview: KPI cards (open applications, submissions in pipeline by stage, drafts awaiting review), a recent **activity feed**, and quick actions — only for the modules you can access.
- **Module switcher / left nav**: Overview · Careers · Pitch · Insights · People & Roles (super-admin) · Audit Log.
- Consistent table/list patterns: filters, sort, bulk actions, "last updated."

## C. Modules

1. **Insights CMS** *(largest new piece)* — DB-backed `posts` table (title, slug, type, vertical, excerpt, body, author, **status**, published_at, featured…). `/admin/insights`: list + filter, rich create/edit, workflow actions (submit → approve → publish → archive), scheduled publish. Public `/insights` reads **published** posts from the DB (RLS: published = public; drafts = editors/admins). Editor writes; insights_admin publishes.
2. **Pitch deal-flow** *(enhance existing `/admin/review`)* — pipeline analytics, reviewer **assignment** management, **notes/comments**, relationship/CRM fields, decisions. (Scorecards already shipped.)
3. **Careers ATS** *(enhance existing `/admin/recruiting`)* — **interview scorecards**, hiring-team **assignment**, candidate **notes**, structured evaluation summary, visibility controls. (Kanban + stage history + résumé already shipped.)
4. **People & Roles** *(super-admin)* — `/admin/people`: list users, assign/revoke roles. The control plane for who can do what.
5. **Audit Log** — append-only `audit_log` (actor, event_type, target, details jsonb, created_at). Log stage moves, publishes, role changes, decisions. `/admin/audit`: filterable timeline + export.

## D. Phased build plan

- **Phase 1 — Foundation.** `user_roles` + RLS helpers + middleware/guards; the **admin shell** (overview dashboard + role-aware nav); **People & Roles** management. *(Unlocks everything else.)*
- **Phase 2 — Insights CMS.** `posts` table + workflow; `/admin/insights` editor console; switch public `/insights` to DB. *(The headline new capability.)*
- **Phase 3 — Depth + spine.** Enhance Careers + Pitch consoles (notes, scorecards, assignment, analytics); `audit_log` + viewer.

> **Note on the database:** Phases add new tables (`user_roles`, `posts`, `audit_log`) to your live Supabase. Like the initial setup, that SQL needs to be run once in the Supabase SQL editor (I'll provide ready-to-paste migrations), or grant DB access and I'll apply them.
