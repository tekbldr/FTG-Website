// ============================================================================
// FTG marketing site — typed content (CMS-ready per the website brief).
// Edit copy here without touching layout. 1:1 mappable to a headless CMS later.
// ============================================================================

export const site = {
  name: "First Tech Group",
  short: "FTG",
  tagline: "Engineering what comes next",
  oneLiner: "The infrastructure layer for the digital economy.",
  thesis: "Markets · Money · Intelligence — owned as one stack.",
  email: "hello@ftg.vc",
  foundersEmail: "founders@ftg.vc",
  domain: "www.ftg.vc",
} as const;

export type NavLink = { label: string; href: string };

// Global nav. Section anchors live on the home; Careers/Pitch are the platforms.
export const nav: NavLink[] = [
  { label: "Model", href: "/#model" },
  { label: "Portfolio", href: "/#pillars" },
  { label: "System", href: "/#loop" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
];

export type Stat = { n: string; u?: string; label: string };

export const heroStats: Stat[] = [
  { n: "3", label: "Operating pillars — exchange, AI, wallet" },
  { n: "5", label: "Brands in market and in build" },
  { n: "400M", u: "+", label: "Arabic-speaking users in the AI beachhead" },
  { n: "1", label: "Shared intelligence & identity backbone" },
];

export const hero = {
  eyebrow: "Venture · We fund · build · operate",
  headline: "One group at the convergence of money and machine intelligence.",
  lead: "First Tech Group is a venture firm that funds, builds, and operates the companies rebuilding the digital economy — the markets where value trades, the wallet where it lives, and the intelligence that puts it to work.",
};

export type ModelStep = { key: string; title: string; body: string };

export const model: ModelStep[] = [
  {
    key: "FUND",
    title: "Capital with conviction",
    body: "We invest at the earliest stages in founders building the rails of the digital economy — pre-seed to Series A, with the patience of an owner, not a tourist.",
  },
  {
    key: "BUILD",
    title: "Studio, not spectator",
    body: "We incubate and co-found from zero — product, engineering, design, go-to-market — turning theses into operating companies like Exx1, PRVAI, and PRV Wallet.",
  },
  {
    key: "OPERATE",
    title: "Owners on the ground",
    body: "We stay in the business — capital, talent, distribution, and a shared AI & memory backbone that compounds across the entire portfolio.",
  },
];

export const group = {
  heading: "Building the operating stack for the next financial era.",
  body: "First Tech Group is a venture firm that funds, builds, and operates core digital-economy infrastructure. We are operator-owners, not passive capital — taking one strategic position in each of the three layers the next era is being rebuilt on: the venue where value trades, the wallet where value is held, and the intelligence that operates on top of both. Each company is standalone. Together they compound.",
  quoteLead: "We are not building features. We are assembling the ",
  quoteSpark: "operating stack",
  quoteTail: " for how value will move, be secured, and be acted upon.",
};

export type Pillar = {
  kicker: string;
  name: string;
  role: string;
  body: string;
  tags: string[];
  href: string;
};

export const pillars: Pillar[] = [
  {
    kicker: "Pillar 01 · Digital-asset markets",
    name: "Exx1",
    role: "Liquidity",
    body: "A centralized exchange built for global markets — the group's fiat ↔ digital gateway and the liquidity layer the rest of FTG settles against. Exchange-grade matching and custody discipline, built for traders and institutions alike.",
    tags: ["CEX", "Global", "24/7"],
    href: "/exx1",
  },
  {
    kicker: "Pillar 02 · Applied AI division",
    name: "PRVAI",
    role: "Intelligence",
    body: "The arm that builds and owns every AI product in the group. Rent the best foundation models; own the durable layer above — voice, memory, orchestration. Ships PRV Copilot and the Arabic-first flagship, Diwan OS.",
    tags: ["Voice-native", "Diwan OS", "Memory graph"],
    href: "/prvai",
  },
  {
    kicker: "Pillar 03 · Privacy fintech",
    name: "PRV Wallet",
    role: "Distribution",
    body: "A multichain, non-custodial wallet where privacy is mathematics, not a promise. Keys derived and encrypted on-device; PRV Copilot built in. The consumer surface where the group's three threads meet.",
    tags: ["Non-custodial", "6 chains", "ZK"],
    href: "/prv-wallet",
  },
  {
    kicker: "A PRVAI product · Applied AI",
    name: "Diwan OS",
    role: "Arabic-first AI",
    body: "PRVAI's flagship: an Arabic-first lifecycle operating system. One agent that handles many jobs over a long relationship, with a single private memory underneath — dialect and voice as first-class inputs.",
    tags: ["Arabic-first", "One memory", "Voice"],
    href: "/diwan-os",
  },
  {
    kicker: "An FTG product · Multi-asset trading",
    name: "EQWT1",
    role: "Trading",
    body: "A multi-asset trading platform — forex, CFDs, and crypto — with copy trading and funded accounts as first-class surfaces. Institutional-premium execution, wrapped in a genuinely modern interface.",
    tags: ["FX · CFD · Crypto", "Copy trading", "Funded"],
    href: "/eqwt1",
  },
];

// Compounding-loop diagram nodes (clockwise from top) + legend rows.
export type LoopNode = { i: number; label: string; cx: number; cy: number; fontSize: number };

export const loopNodes: LoopNode[] = [
  { i: 0, label: "Exx1", cx: 210, cy: 70, fontSize: 11 },
  { i: 1, label: "Wallet", cx: 350, cy: 210, fontSize: 10 },
  { i: 2, label: "PRVAI", cx: 210, cy: 350, fontSize: 10 },
  { i: 3, label: "Memory", cx: 70, cy: 210, fontSize: 9.5 },
];

export type LoopLegendRow = { i: number; k: string; title: string; body: string };

export const loopLegend: LoopLegendRow[] = [
  { i: 0, k: "01", title: "Liquidity · Exx1", body: "A global exchange gives the group markets, on-ramps, and a real financial surface for agents to act on." },
  { i: 1, k: "02", title: "Distribution · PRV Wallet", body: "A privacy wallet puts assets — and the AI assistant — in the user's hand, and carries the group's identity." },
  { i: 2, k: "03", title: "Intelligence · PRVAI", body: "Voice and memory turn the wallet and the market into something users talk to — and that learns from them." },
  { i: 3, k: "04", title: "Memory · the backbone", body: "One persistent, per-user graph of context threads every product. No foundation model holds it; every product feeds it." },
];

export const loopIntro = {
  heading: "The edge is the loop between them.",
  body: "Liquidity makes the wallet useful. The wallet distributes the AI. The AI deepens engagement with the markets. And every interaction enriches a shared memory that makes the next one better.",
};

export type Driver = { num: string; title: string; body: string };

export const whyNow: Driver[] = [
  { num: "01", title: "Sovereign AI crossed an inflection", body: "Region-grade Arabic models matured and became cheap to rent in 2026 — the foundation layer is finally good enough to build an autonomous workforce on top of." },
  { num: "02", title: "Residency became law, not preference", body: "Saudi PDPL (SDAIA-enforced) and the UAE PDPL now mandate in-region data — turning sovereignty from a feature into a buying requirement and a moat." },
  { num: "03", title: "Money and intelligence are converging", body: "Voice-native agents and digital-asset rails are arriving at the same moment. The opportunity is to own the venue, the wallet, and the intelligence as one stack — before others unbundle it." },
];

export const founders = {
  heading: "Building the future of money or intelligence?",
  headingSpark: "Pitch us.",
  body: "We back and build alongside founders at the convergence of digital assets, AI, and privacy. Submit your company — every submission reaches the FTG investment team directly.",
};

export const closing = {
  leadEyebrow: "First Tech Group",
  parts: ["Building the operating stack for how value will ", "move", ", be ", "secured", ", and be ", "acted upon", "."],
};

export const footer = {
  columns: [
    { title: "Products", links: [
      { label: "Exx1 — Markets", href: "/exx1" },
      { label: "PRVAI — Intelligence", href: "/prvai" },
      { label: "PRV Wallet — Money", href: "/prv-wallet" },
      { label: "Diwan OS — Arabic-first AI", href: "/diwan-os" },
      { label: "EQWT1 — Trading", href: "/eqwt1" },
    ] },
    { title: "Navigate", links: [
      { label: "The Model", href: "/#model" },
      { label: "The System", href: "/#loop" },
      { label: "Careers", href: "/careers" },
      { label: "Pitch us", href: "/pitch" },
    ] },
    { title: "Trust & Legal", links: [
      { label: "Trust & Compliance", href: "/trust" },
      { label: "Privacy Notice", href: "/legal/privacy" },
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Cookie Notice", href: "/legal/cookies" },
      { label: "Security", href: "/legal/security" },
      { label: "Accessibility", href: "/legal/accessibility" },
    ] },
    { title: "Contact", links: [
      { label: site.email, href: `mailto:${site.email}` },
      { label: site.domain, href: "/" },
    ] },
  ],
  note: "First Tech Group · Markets · Money · Intelligence",
  edition: "2026 Edition",
};

// ── Social accounts ──────────────────────────────────────────────────────────
export type Social = { kind: "x" | "instagram"; handle: string; url: string };
export type BrandSocialItem = { name: string; kind: "x" | "instagram"; handle: string; url: string };

export const socials = {
  // FTG's own official accounts
  ftg: [
    { kind: "instagram", handle: "firsttechgroup", url: "https://instagram.com/firsttechgroup" },
    { kind: "x", handle: "ftg_vc", url: "https://x.com/ftg_vc" },
  ] as Social[],
  // Portfolio brands on X
  portfolio: [
    { name: "Exx1", kind: "x", handle: "exx1_com", url: "https://x.com/exx1_com" },
    { name: "PRVAI", kind: "x", handle: "Prv_ai", url: "https://x.com/Prv_ai" },
    { name: "Diwan OS", kind: "x", handle: "d1wan_ai", url: "https://x.com/d1wan_ai" },
    { name: "PRV Wallet", kind: "x", handle: "Prv1_com", url: "https://x.com/Prv1_com" },
  ] as BrandSocialItem[],
};

// X handle per pillar (keyed by pillar name) — used on the portfolio pillar cards.
export const pillarX: Record<string, { handle: string; url: string }> = {
  Exx1: { handle: "exx1_com", url: "https://x.com/exx1_com" },
  PRVAI: { handle: "Prv_ai", url: "https://x.com/Prv_ai" },
  "PRV Wallet": { handle: "Prv1_com", url: "https://x.com/Prv1_com" },
  "Diwan OS": { handle: "d1wan_ai", url: "https://x.com/d1wan_ai" },
};
