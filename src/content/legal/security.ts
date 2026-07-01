// Security page — rendered at /legal/security via the Prose renderer.
export const body = `
FTG collects things worth protecting — candidates' CVs, founders' decks and financials, users' accounts. This page describes, plainly, how the platform is engineered to protect them. It is written the way we build: specific enough to be accountable.

## The architecture

- **Row-level security on every table.** Access control is enforced in the database itself, not just the application: you can read your own rows; staff access is granted through explicit roles. There is no table without a policy.
- **Least-privilege by default.** External users see only their own data. Staff access is role-based (recruiter, reviewer, admin), and privileged operations happen server-side only — elevated credentials are never shipped to the browser.
- **Private storage, signed access.** Uploaded files live in private buckets. There are no public URLs. Downloads require an ownership or assignment check and use signed links that expire in **60 seconds**.
- **Every upload is scanned.** Files pass through a server-controlled pipeline and are malware-scanned before they can be downloaded by anyone. Infected files are deleted.
- **Audit trail.** Stage changes and administrative actions are recorded as an append-only history.

## Data in transit and at rest

All traffic is encrypted with TLS. Data at rest is encrypted by our infrastructure providers (Supabase and Vercel). Application data resides in **Frankfurt, Germany (EU)**.

## Data minimisation and retention

We collect only what the process needs, and we delete on a schedule rather than by request alone: unsuccessful applications and declined submissions are purged automatically — files included — 6 months after the decision. Retention that runs on a timer is retention that actually happens.

## People and process

- Staff access follows need-to-know, enforced by roles and reviewed as the team changes.
- Reviewers of founder submissions declare conflicts of interest and are excluded where conflicts exist.
- Security-relevant changes to the platform go through code review.

## Reporting a vulnerability

If you believe you have found a security issue in this site or any FTG platform, email **[hello@ftg.vc](mailto:hello@ftg.vc)** with the subject line "SECURITY". Please include enough detail to reproduce the issue, give us reasonable time to fix it before public disclosure, and do not access data that is not yours in the course of testing. We take every report seriously and will respond.

## Product security

Each FTG product carries its own security posture, engineered for its domain — custody segregation and provable reserves at [Exx1](/exx1), on-device key management at [PRV Wallet](/prv-wallet), private-by-construction memory at [PRVAI](/prvai) and [Diwan OS](/diwan-os), and client-fund segregation controls at [EQWT1](/eqwt1). See each product page's trust section.

---

*This page is reviewed as the platform evolves. Last updated 2 July 2026.*
`;
