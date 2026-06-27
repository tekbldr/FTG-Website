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
