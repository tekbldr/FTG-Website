// ============================================================================
// Insights / Content Hub — typed content (CMS-ready).
// Two-axis taxonomy (a16z model): content TYPE × VERTICAL. Edit/append entries
// here; the hub renders featured + chronological feed with filtering.
// ============================================================================

export type InsightType = "news" | "article" | "story" | "podcast" | "research";
export type InsightVertical = "The Group" | "Markets" | "Applied AI" | "Money" | "MENA";

export const INSIGHT_TYPES: { key: InsightType; label: string }[] = [
  { key: "news", label: "Latest News" },
  { key: "article", label: "Articles & Insights" },
  { key: "story", label: "Stories" },
  { key: "podcast", label: "Podcasts & Media" },
  { key: "research", label: "Research & Reports" },
];

export const TYPE_LABEL: Record<InsightType, string> = {
  news: "News",
  article: "Article",
  story: "Story",
  podcast: "Podcast",
  research: "Research",
};

// CTA verb per type — "Read / Listen / Watch"
export const TYPE_CTA: Record<InsightType, string> = {
  news: "Read",
  article: "Read",
  story: "Read",
  podcast: "Listen",
  research: "Read the report",
};

export const INSIGHT_VERTICALS: InsightVertical[] = ["The Group", "Markets", "Applied AI", "Money", "MENA"];

export type Insight = {
  slug: string;
  type: InsightType;
  vertical: InsightVertical;
  title: string;
  excerpt: string;
  author: string;
  date: string; // ISO date
  readTime: string; // "6 min read" / "34 min listen"
  featured?: boolean;
  isNew?: boolean;
  tags?: string[];
  body?: string; // optional long-form (rendered on the detail page)
};

// Seed set — FTG's own thesis/insight content. Replace/extend with real pieces.
export const insights: Insight[] = [
  {
    slug: "state-of-the-digital-asset-stack-2026",
    type: "research",
    vertical: "Markets",
    title: "State of the Digital-Asset Stack — 2026",
    excerpt:
      "Our inaugural annual benchmark: where liquidity, custody, and on-chain settlement are actually consolidating — and the index we'll track every year.",
    author: "FTG Research",
    date: "2026-06-20",
    readTime: "28 min read",
    featured: true,
    isNew: true,
    tags: ["Benchmark", "Exchange", "Index"],
    body: "This is the first edition of FTG's annual State of the Digital-Asset Stack — a data-backed read on how the markets, money, and intelligence layers of the digital economy are consolidating, and the named index we will publish every year.",
  },
  {
    slug: "markets-money-intelligence-one-stack",
    type: "article",
    vertical: "The Group",
    title: "Markets · Money · Intelligence: why we own the stack",
    excerpt:
      "Three companies, one identity and memory backbone, a compounding loop between them. The thesis behind funding, building, and operating as one system.",
    author: "First Tech Group",
    date: "2026-06-18",
    readTime: "7 min read",
    featured: true,
    isNew: true,
    tags: ["Thesis", "Operator-investor"],
    body: "We are not building features. We are assembling the operating stack for how value will move, be secured, and be acted upon — owned as one system before others unbundle it.",
  },
  {
    slug: "building-exx1-from-the-metal-up",
    type: "story",
    vertical: "Markets",
    title: "Building Exx1 from the metal up",
    excerpt:
      "Inside the build of a global digital-asset exchange — matching engine, custody discipline, and the liquidity layer the rest of the group settles against. Status: in active build.",
    author: "First Tech Group",
    date: "2026-06-12",
    readTime: "9 min read",
    isNew: true,
    tags: ["Exx1", "In build"],
  },
  {
    slug: "privacy-as-mathematics-prv-wallet",
    type: "article",
    vertical: "Money",
    title: "Privacy as mathematics: the PRV Wallet thesis",
    excerpt:
      "Non-custodial by default, keys derived and encrypted on-device, ZK where it counts. Why privacy has to be provable, not promised.",
    author: "First Tech Group",
    date: "2026-06-05",
    readTime: "6 min read",
    tags: ["PRV Wallet", "ZK", "Self-custody"],
  },
  {
    slug: "inside-diwan-os",
    type: "story",
    vertical: "Applied AI",
    title: "Inside Diwan OS: an Arabic-first lifecycle OS",
    excerpt:
      "One agent, many jobs, one memory. How PRVAI's flagship rents the best foundation models and owns the durable layer — voice, memory, orchestration.",
    author: "First Tech Group",
    date: "2026-05-28",
    readTime: "8 min read",
    tags: ["PRVAI", "Diwan OS", "Memory graph"],
  },
  {
    slug: "the-stack-ep-01",
    type: "podcast",
    vertical: "The Group",
    title: "The Stack — Ep. 01: Owning markets, money, and intelligence",
    excerpt:
      "The first episode of FTG's series on building digital-economy infrastructure: the convergence thesis and what it takes to operate, not just fund.",
    author: "The Stack",
    date: "2026-05-20",
    readTime: "41 min listen",
    tags: ["Podcast", "Thesis"],
  },
  {
    slug: "mena-digital-economy-outlook-2026",
    type: "research",
    vertical: "MENA",
    title: "MENA Digital-Economy Infrastructure — 2026 outlook",
    excerpt:
      "Sovereign AI crossed an inflection, residency became law, and money and intelligence are converging. The why-now for the region, with numbers.",
    author: "FTG Research",
    date: "2026-05-14",
    readTime: "22 min read",
    tags: ["MENA", "Sovereign", "Why now"],
  },
  {
    slug: "the-compounding-loop",
    type: "article",
    vertical: "The Group",
    title: "The compounding loop",
    excerpt:
      "Liquidity makes the wallet useful. The wallet distributes the AI. The AI deepens the markets. And every interaction enriches a shared memory.",
    author: "First Tech Group",
    date: "2026-05-02",
    readTime: "5 min read",
    tags: ["Network effects", "Backbone"],
  },
  {
    slug: "prv-copilot-voice-native",
    type: "story",
    vertical: "Applied AI",
    title: "PRV Copilot: voice-native, wallet-integrated",
    excerpt:
      "What it means to put a voice-native assistant inside a non-custodial wallet — and why the memory layer is the moat.",
    author: "First Tech Group",
    date: "2026-04-22",
    readTime: "6 min read",
    tags: ["PRVAI", "Voice", "PRV Wallet"],
  },
  {
    slug: "why-we-build-and-operate",
    type: "article",
    vertical: "The Group",
    title: "Why we build and operate, not just fund",
    excerpt:
      "Capital with conviction, a studio that ships, owners on the ground. The operator-investor model behind the group.",
    author: "First Tech Group",
    date: "2026-04-10",
    readTime: "5 min read",
    tags: ["Operator-investor", "Studio"],
  },
  {
    slug: "ftg-ventures-rolling-open",
    type: "news",
    vertical: "The Group",
    title: "FTG Ventures opens rolling submissions",
    excerpt:
      "We fund, build, and operate at the convergence of money and machine intelligence — pre-seed to Series A. Submissions are open.",
    author: "First Tech Group",
    date: "2026-04-01",
    readTime: "2 min read",
    tags: ["Ventures", "Open"],
  },
  {
    slug: "the-stack-ep-02-sovereign-ai",
    type: "podcast",
    vertical: "MENA",
    title: "The Stack — Ep. 02: Sovereign AI and the residency moment",
    excerpt:
      "Region-grade Arabic models matured and residency became a buying requirement. What that unlocks for an operator-investor in the Gulf.",
    author: "The Stack",
    date: "2026-03-24",
    readTime: "37 min listen",
    tags: ["Sovereign AI", "MENA"],
  },
];
