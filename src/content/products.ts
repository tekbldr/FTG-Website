// ============================================================================
// FTG product pages — typed content (CMS-ready, mirrors src/content/site.ts).
// One entry per product. Copy is grounded in the FTG Research insights and each
// product's own brand docs. Reputation discipline: products in build are labelled
// as such; no invented live metrics; superlatives are framed as intent, not fact.
// EQWT1 guardrail: disclose only that it "may act as counterparty" — never
// describe A/B-book routing, dealing-desk, or per-user risk logic.
// ============================================================================

export type ProductStatus = "in_build" | "in_development" | "live";

export type Audience = { who: string; need: string };
export type Diff = { title: string; body: string };
export type TrustItem = { title: string; body: string };
export type Shot = { img?: string; caption: string };
export type ProductCTA = { label: string; href: string; solid?: boolean; external?: boolean };

export type Product = {
  slug: string;
  name: string;
  // Logo artwork under /public/brands/<slug>/. `wordmark` is the wide lockup,
  // `mark` the square icon. Either may be absent (fall back to typographic name).
  wordmark?: string;
  wordmarkTall?: boolean; // vertical lockups need more height than wide ones
  mark?: string;
  logoAlt: string;
  markContain?: boolean; // render mark within padding (icons that fill the frame)
  eyebrow: string;
  isPillar: boolean;
  pillarRole?: string; // Liquidity / Intelligence / Distribution
  tagline: string;
  status: ProductStatus;
  statusLabel: string;
  lead: string;
  live: string[]; // "What is in place today"
  building: string[]; // "What is currently being built"
  serves: Audience[];
  different: Diff[];
  looksLike: Shot[];
  trust: TrustItem[];
  metaTitle: string;
  metaDescription: string;
  cta: ProductCTA;
  secondaryCta?: ProductCTA;
  related: string[]; // insight slugs — resolved to titles at render
  // Answer-first Q&A — rendered on the page AND emitted as FAQPage JSON-LD,
  // so answer engines and LLMs can quote the canonical version directly.
  faq: { q: string; a: string }[];
  x?: { handle: string; url: string };
};

export const products: Product[] = [
  // ── EXX1 ──────────────────────────────────────────────────────────────────
  {
    slug: "exx1",
    name: "Exx1",
    wordmark: "/brands/exx1/logo.png",
    logoAlt: "Exx1",
    eyebrow: "Pillar 01 · Digital-asset markets",
    isPillar: true,
    pillarRole: "Liquidity",
    tagline: "The exchange, built from the metal up.",
    status: "in_build",
    statusLabel: "In active build",
    lead:
      "A centralized exchange built for global markets — the group's fiat ↔ digital gateway and the liquidity layer the rest of FTG settles against. We are building the matching engine, custody stack, and surveillance machinery ourselves, because the parts a white-label vendor hides are the exact parts that decide whether an exchange deserves to exist.",
    live: [
      "The architectural decision that shapes everything: build from the metal up, not a white-labelled engine wrapped in a brand.",
      "A design that serves two roles at once — an excellent standalone venue, and dependable internal infrastructure for the whole group.",
      "A published engineering thesis on matching-engine fairness, custody discipline, and provable reserves (see the FTG Research pieces below).",
      "A public identity and channel: @exx1_com.",
    ],
    building: [
      "The matching engine — deterministic ordering, predictable behavior under load, no privileged fast path for anyone.",
      "Custody as a first-class discipline: segregation of customer assets, institutional-standard key management, controls designed to be proven rather than promised.",
      "Compliant fiat on- and off-ramps and the liquidity surface the wallet and the intelligence layer transact against.",
      "Market-conduct, reporting, and surveillance controls treated as product requirements from the first commit.",
    ],
    serves: [
      { who: "Traders", need: "A venue whose fairness and custody they can reason about — not take on faith." },
      { who: "Institutions", need: "Exchange-grade matching, segregated custody, and a clear regulatory posture." },
      { who: "The FTG group", need: "The fiat-to-digital gateway and liquidity layer the wallet and AI settle against." },
    ],
    different: [
      { title: "Built, not rented", body: "Matching, custody, and surveillance are owned all the way down. A keystone you rent is a keystone someone else can reprice, throttle, or fail on." },
      { title: "Custody as engineering", body: "The failure mode that actually destroys exchanges is custody and operations, not trading. We treat it as the first-class discipline it is." },
      { title: "Verifiable, not promised", body: "“Trust us” is not a market-integrity strategy. The direction is proof-of-reserves and independent attestation — provable over promised." },
      { title: "Regulation as a product requirement", body: "Compliance and market-conduct controls are built in from the beginning, in a region that wrote clear rules for digital-asset venues early." },
    ],
    looksLike: [
      { caption: "An exchange-grade trading surface for spot and beyond — engineered for traders and institutions alike. Interface preview to follow at launch." },
    ],
    trust: [
      { title: "Segregation by design", body: "Customer assets are architected to be segregated from the firm's — the single discipline whose absence caused the industry's largest collapses." },
      { title: "Provable reserves", body: "Controls are designed to be attested independently, in line with the industry's move toward proof-of-reserves." },
      { title: "Regulatory posture", body: "Reporting, market-conduct, and surveillance controls are product requirements, not retrofits — built for the jurisdictions Exx1 operates in." },
    ],
    metaTitle: "Exx1 — The exchange, built from the metal up | FTG",
    metaDescription:
      "Exx1 is FTG's centralized digital-asset exchange — matching engine, custody, and surveillance built in-house. The group's fiat-to-digital gateway and liquidity layer. In active build.",
    cta: { label: "Follow build updates on X", href: "https://x.com/exx1_com", external: true, solid: true },
    secondaryCta: { label: "Partner or list — talk to us", href: "mailto:hello@ftg.vc?subject=Exx1%20inquiry" },
    related: ["exchange-is-the-keystone", "building-exx1-from-the-metal-up", "state-of-the-digital-asset-stack-2026", "what-supervisors-say-about-ai-in-finance"],
    faq: [
      {
        q: "What is Exx1?",
        a: "Exx1 is a centralized digital-asset exchange being built in-house by First Tech Group — the matching engine, custody stack, and market surveillance are all built rather than white-labelled. It is designed to be both an excellent standalone venue and the fiat-to-digital gateway the rest of the FTG group settles against.",
      },
      {
        q: "Is Exx1 live for trading?",
        a: "Not yet. Exx1 is in active build, and FTG does not claim live trading, volumes, or user metrics for it. Build updates are published on X at @exx1_com and in FTG Insights.",
      },
      {
        q: "What makes Exx1 different from other exchanges?",
        a: "Three choices: build over rent (the matching engine, custody, and surveillance are owned all the way down), custody treated as a first-class engineering discipline with segregation of customer assets and a direction of provable reserves, and regulatory posture treated as a product requirement from the first commit rather than a retrofit.",
      },
    ],
    x: { handle: "exx1_com", url: "https://x.com/exx1_com" },
  },

  // ── PRVAI ─────────────────────────────────────────────────────────────────
  {
    slug: "prvai",
    name: "PRVAI",
    wordmark: "/brands/prvai/logo.png",
    logoAlt: "PRVAI",
    eyebrow: "Pillar 02 · Applied AI division",
    isPillar: true,
    pillarRole: "Intelligence",
    tagline: "Rent the models. Own the durable layer.",
    status: "in_development",
    statusLabel: "In development",
    lead:
      "The arm that builds and owns every AI product in the group. The model market moves too fast and costs too much to bet a company on training your own frontier model each year — so PRVAI rents the best foundation models available at any moment and owns the layer above them that actually compounds: voice, memory, and orchestration. It ships PRV Copilot and the Arabic-first flagship, Diwan OS.",
    live: [
      "A clear operating philosophy: the model is a commodity; the private, per-user memory is the moat.",
      "Two products defined and in development — PRV Copilot (voice-native, wallet-resident) and Diwan OS (Arabic-first lifecycle OS).",
      "A shared memory-and-identity backbone designed to thread every FTG product.",
      "A public channel: @Prv_ai.",
    ],
    building: [
      "The durable layer — voice, memory, and orchestration — above rented, Arabic-native and general foundation models.",
      "PRV Copilot: a voice-native assistant that lives inside PRV Wallet and acts within permissions you grant.",
      "Diwan OS: one agent, many jobs, one memory — an Arabic-first operating system for a person's digital life.",
      "The private memory graph: durable, per-user context, private by construction rather than by policy.",
    ],
    serves: [
      { who: "Arabic-speaking users", need: "An assistant fluent in dialect and voice — not a translated afterthought." },
      { who: "FTG's own products", need: "The intelligence and memory backbone the wallet and the exchange draw from." },
      { who: "Everyday people", need: "One agent that remembers them and gets things done, instead of a fleet of forgetful bots." },
    ],
    different: [
      { title: "Memory is the moat", body: "Anyone can call the same models. No one can reconstruct your private memory — and it compounds with every interaction." },
      { title: "Own the durable layer", body: "Models keep getting better and cheaper on someone else's schedule. PRVAI owns voice, memory, and orchestration — the parts that last." },
      { title: "Private by construction", body: "A memory this personal is treated as a design constraint, not a disclaimer — private by architecture rather than by promise." },
      { title: "Arabic-first", body: "Dialect, voice, and cultural context are first-class inputs, and region-residency is designed in — not bolted on." },
    ],
    looksLike: [
      { caption: "PRVAI is a division, not a single screen — its surfaces are PRV Copilot inside the wallet and Diwan OS. See those product pages for what they look like." },
    ],
    trust: [
      { title: "Rented models, owned memory", body: "Foundation models are a rented, fast-depreciating input; the durable, private layer is what PRVAI owns and protects." },
      { title: "Private by construction", body: "The per-user memory graph is held under the user's control and engineered to be private by design." },
      { title: "Region-resident by design", body: "“Arabic-first” also means data residency is a design property, aligned with regional requirements." },
    ],
    metaTitle: "PRVAI — Rent the models, own the durable layer | FTG",
    metaDescription:
      "PRVAI is FTG's applied-AI division: voice, memory, and orchestration above rented foundation models. It builds PRV Copilot and the Arabic-first Diwan OS. In development.",
    cta: { label: "Explore Diwan OS", href: "/diwan-os", solid: true },
    secondaryCta: { label: "Follow @Prv_ai", href: "https://x.com/Prv_ai", external: true },
    related: ["the-agent-economy", "context-is-the-moat", "the-arabic-ai-gap", "reading-the-2026-ai-index"],
    faq: [
      {
        q: "What is PRVAI?",
        a: "PRVAI is First Tech Group's applied-AI division. It rents the best available foundation models and owns the durable layer above them — voice, memory, and orchestration. It builds PRV Copilot (the voice-native assistant inside PRV Wallet) and Diwan OS (the Arabic-first lifecycle operating system). Both are in development.",
      },
      {
        q: "Why rent foundation models instead of training your own?",
        a: "Because frontier models commoditize and depreciate on someone else's schedule and budget. The value that compounds is the private, per-user memory and orchestration layer — competitors can call the same models, but none can reconstruct a user's memory. PRVAI owns that layer.",
      },
      {
        q: "How does PRVAI handle privacy?",
        a: "The per-user memory graph is designed to be private by construction rather than by policy — held under the user's control, enriched only by their own interactions, with data residency treated as a design requirement for the region.",
      },
    ],
    x: { handle: "Prv_ai", url: "https://x.com/Prv_ai" },
  },

  // ── PRV WALLET ──────────────────────────────────────────────────────────────
  {
    slug: "prv-wallet",
    name: "PRV Wallet",
    wordmark: "/brands/prv-wallet/logo.png",
    logoAlt: "PRV Wallet",
    eyebrow: "Pillar 03 · Privacy fintech",
    isPillar: true,
    pillarRole: "Distribution",
    tagline: "Privacy as mathematics, not a promise.",
    status: "in_development",
    statusLabel: "In development",
    lead:
      "A multichain, non-custodial wallet where privacy is a property of the system, not a pledge on a page. Keys are derived and encrypted on-device; zero-knowledge techniques apply privacy where it counts; and PRV Copilot is built in. It is the consumer surface where the group's three threads — markets, money, and intelligence — meet in your hand.",
    live: [
      "A foundational principle: remove the counterparty. The group never takes possession of user funds.",
      "A published design thesis on non-custodial architecture, on-device keys, and provable privacy.",
      "PRV Copilot defined as a built-in, voice-native assistant that helps without ever holding the keys.",
      "A public channel: @Prv1_com.",
    ],
    building: [
      "Non-custodial key management — keys derived and encrypted on the device, with no privileged server-side copy.",
      "Provable privacy where it counts, using zero-knowledge and confidential-transaction approaches applied deliberately.",
      "Sane recovery and safe defaults, so a lost device is an inconvenience rather than a catastrophe.",
      "PRV Copilot built in — bounded, revocable delegation that never touches the keys.",
    ],
    serves: [
      { who: "Self-custody users", need: "Their keys and their coins — with no honeypot and no counterparty to fail." },
      { who: "Everyday people", need: "Self-custody safe enough for someone who is not a security engineer. “Usable by your family.”" },
      { who: "The agent era", need: "A place where what you own and do is protected, as money becomes machine-readable." },
    ],
    different: [
      { title: "Non-custodial by default", body: "No honeypot to breach, no balance sheet to commingle, no counterparty whose insolvency takes your assets down. Self-custody deletes that risk." },
      { title: "Keys are mathematics", body: "Keys are derived and encrypted on your device — there is no privileged copy waiting to be subpoenaed, leaked, or sold." },
      { title: "Provable privacy", body: "Zero-knowledge where it counts: demonstrate what genuinely needs demonstrating without exposing everything else." },
      { title: "Usable self-custody", body: "The real engineering is ergonomics — sane recovery and safe defaults, because self-custody failed on usability, not philosophy." },
    ],
    looksLike: [
      { caption: "A consumer wallet with PRV Copilot built in — the most personal, most-opened surface the group makes. Interface preview to follow." },
    ],
    trust: [
      { title: "Your keys, your coins", body: "Non-custodial by default. The group never holds user funds, so there is no custodian whose failure becomes your loss." },
      { title: "On-device cryptography", body: "The cryptography that controls your assets lives with you — not on a server you are asked to trust." },
      { title: "Provable, not blanket", body: "Privacy is applied as a mathematical property where it matters — something anyone can reason about, not a vague pledge of secrecy." },
    ],
    metaTitle: "PRV Wallet — Privacy as mathematics, not a promise | FTG",
    metaDescription:
      "PRV Wallet is FTG's multichain, non-custodial wallet: keys derived and encrypted on-device, zero-knowledge where it counts, PRV Copilot built in. In development.",
    cta: { label: "Follow @Prv1_com", href: "https://x.com/Prv1_com", external: true, solid: true },
    secondaryCta: { label: "Read the design thesis", href: "/insights/privacy-as-mathematics-prv-wallet" },
    related: ["privacy-as-mathematics-prv-wallet", "after-ftx-self-custody-default", "agents-will-need-wallets", "the-340-billion-question"],
    faq: [
      {
        q: "What is PRV Wallet?",
        a: "PRV Wallet is a multichain, non-custodial wallet being built by First Tech Group, where privacy is a property of the system rather than a promise: keys are derived and encrypted on the user's device, zero-knowledge techniques apply privacy where it counts, and the PRV Copilot assistant is built in. It is in development.",
      },
      {
        q: "Does FTG ever hold my funds or keys?",
        a: "No. PRV Wallet is non-custodial by default — the group never takes possession of user funds, and there is no privileged server-side copy of your keys. The cryptography that controls your assets lives on your device.",
      },
      {
        q: "What is PRV Copilot?",
        a: "PRV Copilot is the voice-native assistant that lives inside PRV Wallet. It operates strictly within permissions you grant — scoped, auditable, revocable in one move — and it never holds the keys. Delegation is bounded by design, never a blank cheque.",
      },
    ],
    x: { handle: "Prv1_com", url: "https://x.com/Prv1_com" },
  },

  // ── DIWAN OS ────────────────────────────────────────────────────────────────
  {
    slug: "diwan-os",
    name: "Diwan OS",
    wordmark: "/brands/diwan-os/logo.png",
    logoAlt: "Diwan OS",
    eyebrow: "A PRVAI product · Applied AI",
    isPillar: false,
    tagline: "One agent, many jobs, one memory.",
    status: "in_development",
    statusLabel: "In development",
    lead:
      "A diwan is an old idea — a council, a register, a place where affairs are recorded and conducted over time. Diwan OS is PRVAI's Arabic-first lifecycle operating system: one agent that handles many jobs, over a long relationship, with a single private memory running underneath all of it. It is built against the two failures no one notices anymore — amnesia and fragmentation.",
    live: [
      "A defined product thesis: an operating system for a person's digital life, not a chatbot with a personality bolted on.",
      "The core design — one agent, many jobs, one memory — grounded in a published field-notes piece.",
      "An Arabic-first, region-resident-by-design approach to voice, dialect, and data.",
      "A public channel: @d1wan_ai.",
    ],
    building: [
      "One agent that spans jobs across your lifecycle, so context from one task informs the next.",
      "The memory graph — a durable, private structure of what matters to you, held under your control.",
      "Arabic voice and dialect handled as first-class inputs, not errors to be corrected.",
      "Orchestration above rented foundation models — the coordinating layer that sits over apps and models.",
    ],
    serves: [
      { who: "Arabic-speaking users", need: "An assistant that assumes cultural context and handles dialect and voice natively." },
      { who: "People with too many bots", need: "One agent with one memory, instead of a fleet of strangers each holding a shard of context." },
      { who: "The region", need: "Sovereignty as a direction of travel — region-resident data as a design property." },
    ],
    different: [
      { title: "One agent, many jobs", body: "Genuinely the same agent with the same memory across tasks — continuity that turns clever answers into cumulative understanding." },
      { title: "The memory graph", body: "A private graph of what matters to you — the moat competitors cannot reconstruct, and a responsibility taken as a design constraint." },
      { title: "Why “operating system”", body: "An OS manages resources, remembers state, and coordinates jobs — the layer other things run on, not just another app." },
      { title: "Arabic-first, truly", body: "Dialect, voice, and cultural context are first-class; residency is designed in. Arabic-first means region-resident by design." },
    ],
    looksLike: [
      { caption: "A voice-first, Arabic-native assistant with a persistent memory — the coordinating intelligence above your apps. Interface preview to follow." },
    ],
    trust: [
      { title: "Private by construction", body: "A memory this personal is engineered to be private by architecture, not by a policy that can change on a Tuesday." },
      { title: "Under your control", body: "The memory graph is held under the user's control and enriched only by their own interactions." },
      { title: "Region-resident", body: "Data residency is a design property — the honest version of “sovereign” as a direction of travel." },
    ],
    metaTitle: "Diwan OS — One agent, many jobs, one memory | FTG",
    metaDescription:
      "Diwan OS is PRVAI's Arabic-first lifecycle operating system: one agent, one private memory, voice and dialect as first-class inputs. In development at First Tech Group.",
    cta: { label: "Follow @d1wan_ai", href: "https://x.com/d1wan_ai", external: true, solid: true },
    secondaryCta: { label: "Read: Inside Diwan OS", href: "/insights/inside-diwan-os" },
    related: ["inside-diwan-os", "sovereign-ai-decoded", "the-arabic-ai-gap"],
    faq: [
      {
        q: "What is Diwan OS?",
        a: "Diwan OS is PRVAI's Arabic-first lifecycle operating system: one agent that handles many jobs over a long relationship, with a single private memory underneath. It is built against the two chronic failures of today's assistants — amnesia and fragmentation. It is in development at First Tech Group.",
      },
      {
        q: "What does Arabic-first actually mean?",
        a: "Dialect and voice are treated as first-class inputs rather than errors to correct, cultural context is assumed rather than bolted on, and data residency in the region is a design property. Arabic is the design constraint, not a translation target.",
      },
      {
        q: "Why call it an operating system?",
        a: "Because it is the layer other things run on, not another app: it manages resources, remembers state, and coordinates jobs on your behalf — the coordinating intelligence above the apps and the models, holding one memory across all of it.",
      },
    ],
    x: { handle: "d1wan_ai", url: "https://x.com/d1wan_ai" },
  },

  // ── EQWT1 ─────────────────────────────────────────────────────────────────
  // Guardrail: public copy discloses ONLY that EQWT1 may act as counterparty.
  // Never describe A/B-book routing, dealing-desk mechanics, or per-user risk logic.
  {
    slug: "eqwt1",
    name: "EQWT1",
    wordmark: "/brands/eqwt1/lockup.png",
    wordmarkTall: true,
    logoAlt: "EQWT1",
    eyebrow: "An FTG product · Multi-asset trading",
    isPillar: false,
    tagline: "Prime execution. Markets, refined.",
    status: "in_development",
    statusLabel: "Platform prototype · pre-launch",
    lead:
      "EQWT1 is a multi-asset trading platform — forex, CFDs, and crypto — with copy trading and funded accounts, built institutional-premium and dark-first. It gives every trader the execution quality, transparency, and tooling that used to belong only to institutions, wrapped in one of the most refined interfaces in the market.",
    live: [
      "A complete brand and design system — obsidian base, ice accent, and mono-precise, tabular numerics throughout.",
      "A high-fidelity platform prototype: trade terminal, order ticket, positions blotter, live charting, analytics, and an economic calendar.",
      "Copy trading and funded accounts designed as first-class, beautiful surfaces — not buried sub-menus.",
      "A public marketing site and identity.",
    ],
    building: [
      "Connection to a licensed trading and liquidity backend, replacing the simulated price feed.",
      "Account funding, verification, and payments.",
      "Live market data and production-grade order routing.",
      "Mobile and continued interface refinement toward launch.",
    ],
    serves: [
      { who: "Active traders", need: "Fast, modern execution and instrument-grade numerics — not a skinned legacy terminal." },
      { who: "Copy-trading followers", need: "Verified track records, risk scores, and one-tap copying with proportional controls." },
      { who: "Funded / prop traders", need: "Challenge progress and drawdown tracked as a clear, first-class surface." },
      { who: "Partners & IBs", need: "A partner portal with transparent funnels, codes, and payouts." },
    ],
    different: [
      { title: "Modern, not MetaTrader", body: "A genuinely modern, fast, obsidian-grade interface — built to beat terminals anchored to the dated MT4/MT5 feel." },
      { title: "Mono-precise numerics", body: "Every price, P&L, and balance is set in tabular mono so columns align perfectly — the strongest premium signal in a trading UI." },
      { title: "Copy & funded, first-class", body: "Copy trading and funded accounts are treated as beautiful, front-and-center surfaces rather than afterthoughts." },
      { title: "Speed is the brand", body: "Sub-100ms interactions, optimistic UI, and streaming quotes that never stutter. Jank reads as risk." },
    ],
    looksLike: [
      { img: "/brands/eqwt1/terminal.png", caption: "The EQWT1 trade terminal — obsidian and ice, tabular mono numerics, live charting and order ticket. High-fidelity prototype." },
    ],
    trust: [
      { title: "Risk, communicated plainly", body: "Trading forex, CFDs, and leveraged products carries significant risk of loss and is not suitable for everyone. Risk is shown plainly, never buried." },
      { title: "Counterparty disclosure", body: "For some order flow, EQWT1 may act as counterparty to client trades. The client agreement discloses this clearly." },
      { title: "Segregation & controls", body: "The platform is designed around client-fund segregation and institutional-grade operational controls, disclosed transparently at launch." },
    ],
    metaTitle: "EQWT1 — Prime execution. Markets, refined. | FTG",
    metaDescription:
      "EQWT1 is FTG's multi-asset trading platform — forex, CFDs, crypto — with copy trading and funded accounts. Institutional-premium, dark-first. Platform prototype, pre-launch.",
    cta: { label: "Visit eqwt1.com", href: "https://eqwt1.com", external: true, solid: true },
    secondaryCta: { label: "Partner or IB inquiry", href: "mailto:hello@ftg.vc?subject=EQWT1%20partner%20inquiry" },
    related: ["exchange-is-the-keystone", "state-of-the-digital-asset-stack-2026", "markets-money-intelligence-one-stack"],
    faq: [
      {
        q: "What is EQWT1?",
        a: "EQWT1 is a multi-asset trading platform from First Tech Group — forex, CFDs, and crypto — with copy trading and funded accounts designed as first-class surfaces. Its positioning is institutional-premium and dark-first: 'Prime execution. Markets, refined.'",
      },
      {
        q: "Is EQWT1 live?",
        a: "EQWT1 is a high-fidelity platform prototype, pre-launch. The brand system, trade terminal, analytics, and copy/funded surfaces exist; connection to a licensed trading and liquidity backend, payments, and live market data are currently in build.",
      },
      {
        q: "What are the risks of trading on EQWT1?",
        a: "Trading forex, CFDs, and other leveraged products carries significant risk of loss and is not suitable for everyone. For some order flow, EQWT1 may act as counterparty to client trades; this is disclosed in the client agreement. Risk is communicated plainly on the platform, never buried.",
      },
    ],
  },
];

// Intrinsic pixel dimensions of the brand artwork under /public/brands, keyed by
// path. next/image needs width+height; display size is controlled via CSS.
export const LOGO_DIM: Record<string, [number, number]> = {
  "/brands/exx1/logo.png": [448, 188],
  "/brands/eqwt1/lockup.png": [1100, 894],
  "/brands/eqwt1/terminal.png": [1600, 920],
  "/brands/prv-wallet/logo.png": [937, 440],
  "/brands/prvai/logo.png": [934, 209],
  "/brands/diwan-os/logo.png": [978, 428],
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

// Slugs in canonical display order (pillars first, then other products).
export const productSlugs = products.map((p) => p.slug);
