# First Tech Group — Website (Lean Landing v1)

A self-contained, production-ready landing page. No build step, no dependencies — `index.html` is everything. Deploys to Vercel in under two minutes.

## Files
- `index.html` — the whole site (HTML + CSS + JS + logo embedded as base64)
- `favicon.png` — browser tab icon
- `og.png` — social share image (referenced as `https://www.ftg.vc/og.png`)

## What's on the page
Hero (animated engineered-grid canvas) → stat band → **The Model: Fund · Build · Operate** → The Group → Portfolio (Exx1 · PRVAI · PRV Wallet) → interactive compounding-loop diagram → Why Now → **For Founders pitch form** → contact/footer. Built on the new identity: Ink `#0B0B0E`, Paper `#FAFAF7`, Spark `#FF5E2C`, Graphite `#26262E`, mono labels, one accent per view. Fully responsive and reduced-motion safe.

---

## Deploy: GitHub → Vercel (recommended)

**1 — Put it on GitHub.** From inside this folder:
```bash
git init
git add .
git commit -m "First Tech Group — landing v1"
git branch -M main
git remote add origin https://github.com/<your-username>/ftg-website.git
git push -u origin main
```
(Create the empty `ftg-website` repo first at github.com/new — don't add a README there, so the push is clean.)

**2 — Import to Vercel.** Go to vercel.com/new → **Import Git Repository** → pick `ftg-website`. Framework preset: **Other**. Leave build command empty and output directory as the root. Click **Deploy**. You'll get a live `*.vercel.app` URL in ~30s.

**3 — Point the domain.** In the Vercel project → **Settings → Domains** → add `www.ftg.vc` (and `ftg.vc` redirecting to www). Vercel shows the exact DNS record (a CNAME to `cname.vercel-dns.com`) to add at your registrar. Done.

### Fastest alternative — no Git
Install the CLI and ship the folder directly:
```bash
npm i -g vercel
vercel        # first run links/creates the project
vercel --prod # promotes to production
```

---

## Before you go live — quick edits
- **Founders form:** it currently opens the visitor's email client pre-filled to `founders@ftg.vc` (works with zero backend). To capture submissions in an inbox/dashboard instead, create a free form endpoint at formspree.io, then in `index.html` change the `<form id="pitchform">` to `action="https://formspree.io/f/XXXX" method="POST"` and remove the `e.preventDefault()` submit handler. ~2 minutes.
- **Email addresses:** `hello@ftg.vc` and `founders@ftg.vc` are used throughout — change if different.
- **Fonts:** loaded from Google Fonts (Arimo ≈ the brand's Liberation Sans, JetBrains Mono ≈ DejaVu Mono labels). The true locked wordmark font is a separate asset; drop it in when available and swap the `--brand` text.

## Next phase
This is the **lean landing** for sign-off on the look. Once approved, the planned upgrade is the full **Next.js (App Router) + CMS-ready** build with dedicated pages for The Group, each pillar (Exx1 / PRVAI / PRV Wallet incl. Diwan OS), the thesis, and a News/Insights section — content modeled for a headless CMS. See `FTG-website-brief.md`.
