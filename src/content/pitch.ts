// Content for the founder pitch landing. Process + criteria mirror the seeded
// pitch_stages and rubric, surfaced as marketing copy (those tables are
// authenticated-only under RLS, and this page is public).

export const pitchCopy = {
  fallbackName: "FTG Ventures",
  eyebrow: "FTG Ventures · Fund · Build · Operate",
  headline: "Building the future of money or intelligence?",
  sub: "We fund, build, and operate at the convergence of digital assets, AI, and privacy — pre-seed to Series A. Submit your company and every detail reaches the FTG investment team directly.",
};

export type Tile = { k: string; body: string };

export const whatWeFund: Tile[] = [
  { k: "Markets", body: "Exchanges, liquidity, settlement, and the rails that move digital value." },
  { k: "Intelligence", body: "Applied AI — voice, memory, orchestration, and Arabic-first products." },
  { k: "Privacy fintech", body: "Non-custodial wallets, ZK, and the consumer surfaces where money lives." },
];

export type ProcessStep = { n: string; title: string; body: string };

export const pitchProcess: ProcessStep[] = [
  { n: "01", title: "Intake", body: "Submit your company, deck, and financials through the secure portal." },
  { n: "02", title: "Screening", body: "The investment team reviews fit against our thesis — usually within days." },
  { n: "03", title: "Due diligence", body: "A deeper look at product, market, team, and unit economics." },
  { n: "04", title: "Investment committee", body: "A funding decision from the FTG partners." },
  { n: "05", title: "Funded", body: "Capital, plus the operating backbone of the entire group." },
];

export const evaluationCriteria: Tile[] = [
  { k: "Team", body: "Founder quality, domain expertise, and the ability to execute." },
  { k: "Market", body: "Size, timing, and the tailwinds behind the opportunity." },
  { k: "Product", body: "Differentiation, defensibility, and technical edge." },
  { k: "Traction", body: "Evidence of demand, growth, and retention." },
  { k: "Financials", body: "Unit economics, capital efficiency, and the ask." },
];

export const COMPANY_STAGES = [
  "Idea / pre-incorporation",
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B+",
];

export const SECTORS = [
  "Digital-asset markets",
  "Applied AI",
  "Privacy / fintech",
  "Infrastructure",
  "Consumer",
  "Other",
];

// ── Founder conversion content (FAQ, pitch guidance, after-submission) ───────
// Everything a founder should know BEFORE being asked to create an account.
// FAQ answers double as FAQPage JSON-LD — keep them self-contained plain text.

export type Faq = { q: string; a: string };

export const founderFaq: Faq[] = [
  {
    q: "What does FTG invest in?",
    a: "Companies at the convergence of digital assets, AI, and privacy — the markets where value trades, the wallets where it lives, and the intelligence that acts on it. We invest from pre-seed to Series A, and we also build and operate companies ourselves, so we back founders whose problems we understand from the inside.",
  },
  {
    q: "What stage should my company be at?",
    a: "Pre-seed to Series A. Idea-stage founders with deep domain expertise are welcome — FTG co-founds and incubates from zero, so 'too early' is rarely the reason we pass.",
  },
  {
    q: "Do you only invest in MENA?",
    a: "Our operating center of gravity is the Gulf — Saudi Arabia and the UAE — and our thesis leans on the region's momentum in digital assets and sovereign AI. But we evaluate exceptional companies globally, especially those that want the region as a market.",
  },
  {
    q: "How does the process work, and how long does it take?",
    a: "Five stages: intake, screening, due diligence, investment committee, decision. Screening usually happens within days of submission, and you can track exactly which stage you are at from your founder portal — no black hole.",
  },
  {
    q: "What happens to my deck and financials?",
    a: "They go into private, malware-scanned storage in the EU and are visible only to the FTG investment team members assigned to your submission. Reviewers declare conflicts of interest, and we never share your materials with third parties without your consent. Declined submissions are automatically deleted after six months. The full policy is in the Founder Submission Privacy Notice.",
  },
  {
    q: "Do you sign NDAs before seeing a pitch?",
    a: "Like most venture firms, no — we see too many companies in adjacent spaces for that to be honest. What we commit to instead is enforced discipline: private storage, assignment-scoped access, conflict-of-interest exclusions, and no third-party sharing without consent. Your IP remains yours.",
  },
  {
    q: "What do I get beyond capital?",
    a: "FTG is an operator, not a tourist. Portfolio companies plug into the group's stack — engineering, design, go-to-market, and the shared AI and identity backbone that powers Exx1, PRVAI, and PRV Wallet — plus distribution across the group's products and networks.",
  },
  {
    q: "What if you pass?",
    a: "We tell you. A pass is recorded with a decision, your portal shows it, and your materials are purged on schedule. Many strong companies are simply outside our thesis — a pass is not a verdict on your company, and you are welcome to pitch a later round.",
  },
];

// "What a good FTG pitch looks like" — guidance page content.
export type PitchGuide = { title: string; body: string };

export const goodPitch: PitchGuide[] = [
  {
    title: "Start with the problem, and make it expensive",
    body: "The strongest pitches we see open with a problem that costs someone real money or real time today — not a technology looking for a use. Show us who has the problem, what it costs them, and what they do about it now. If the honest answer is 'nothing, and they cope', say that too; it changes the go-to-market, not the merit.",
  },
  {
    title: "Why now — the question we weigh most",
    body: "Our whole thesis is timing: rails, regulation, and models converging at once. Tell us what changed — a rule, a cost curve, a capability — that makes your company possible this year and impossible three years ago. 'Why now' is the slide we read twice.",
  },
  {
    title: "Team before product",
    body: "At pre-seed and seed we are underwriting people. Founder-market fit matters more than polish: why are you the ones who will not quit on this problem? Unusual advantages — domain scars, distribution you already own, technical depth — beat generic credentials.",
  },
  {
    title: "Show the sharp edge, not the surface area",
    body: "One narrow thing your product does better than anyone, demonstrated, beats ten roadmap promises. If you have a demo, lead with it. If you have users, show retention, not sign-ups. If you have neither yet, show the insight that others are missing.",
  },
  {
    title: "Honest numbers, clearly framed",
    body: "We read financials the way we write our own research: projections labelled as projections, assumptions visible, and no adjectives doing the work numbers should do. A small real number beats a large implied one. Tell us the ask, what it buys, and how long it lasts.",
  },
  {
    title: "Keep the deck short; the portal does the rest",
    body: "Ten to fifteen slides is plenty — problem, why now, team, product, market, traction, business model, ask. Our structured intake captures the details a deck shouldn't carry, and your submission reaches the investment team directly, so spend your effort on clarity, not volume.",
  },
];

// After-submission explainer (mirrors the live 5-stage pipeline in pitchProcess).
export const afterSubmit = {
  heading: "What happens after you submit",
  body: "Your submission goes straight to the FTG investment team — there is no triage bot and no black hole. You can watch it move through every stage from your founder portal, and we notify you when it does.",
  points: [
    "Screening usually starts within days — the team checks fit against our thesis.",
    "If we go deeper, due diligence is a structured look at team, product, market, and unit economics, scored against a consistent rubric.",
    "Decisions are made by the FTG investment committee and recorded either way — funded or declined, you will know.",
    "Declined submissions are automatically deleted, documents included, six months after the decision.",
  ],
};

// Partner / direct-inquiry escape hatch — for people who shouldn't go through
// the intake wizard (funds, corporates, media, later-stage rounds).
export const founderInquiry = {
  heading: "Not a fit for the intake form?",
  body: "Partnership proposals, co-investment, corporate development, later-stage rounds, or media — write to the team directly and a human will answer.",
  email: "founders@ftg.vc",
};
