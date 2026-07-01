// Seeds/updates the Insights `posts` from the plan below + markdown bodies in
// src/content/insights-md/{slug}.md. Run with Node 22:
//   ~/.nvm/versions/node/v22.8.0/bin/node scripts/seed-insights.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const MD = new URL("../src/content/insights-md/", import.meta.url);
function body(slug) {
  try {
    return readFileSync(new URL(slug + ".md", MD), "utf8").trim();
  } catch {
    return null;
  }
}

// slug, title, dek(excerpt), type, vertical, author, date, read, featured?, tags
const plan = [
  // ---- AI research flagships (2026) -----------------------------------------
  { slug: "the-agent-economy", type: "research", vertical: "Applied AI", author: "FTG Research", date: "2026-06-24", read: "11 min read", featured: true, tags: ["Agentic AI", "Payments", "Convergence"],
    title: "The agent economy: what changes when software can spend",
    dek: "AI can plan a purchase and then stall at the checkout, because every payment rail ever built assumes a human tapping 'confirm.' The unsolved problem of machines that can pay — and the wallet-shaped answer." },
  { slug: "context-is-the-moat", type: "research", vertical: "Applied AI", author: "FTG Research", date: "2026-06-27", read: "10 min read", tags: ["AI Memory", "Context", "Agents"],
    title: "Context is the moat: why AI memory beats model size",
    dek: "Bigger context windows don't fix memory — a growing pile of research shows they can make it worse. Why durable, structured memory, not parameter count, is the real frontier of useful AI." },
  { slug: "sovereign-ai-decoded", type: "research", vertical: "Applied AI", author: "FTG Research", date: "2026-06-30", read: "12 min read", tags: ["Sovereign AI", "Compute", "Geopolitics"],
    title: "Sovereign AI, decoded: the real economics and dependencies",
    dek: "Every nation wants sovereign AI, then builds it on foreign chips under foreign licenses. An honest map of the sovereignty you can actually own — and the parts that are, for now, out of anyone's hands." },
  { slug: "the-arabic-ai-gap", type: "research", vertical: "Applied AI", author: "FTG Research", date: "2026-07-01", read: "12 min read", featured: true, tags: ["Arabic AI", "NLP", "Sovereignty"],
    title: "The Arabic AI gap: why models fail 400 million speakers",
    dek: "Four hundred million people speak Arabic; the machines were barely taught from it. The structural reasons models fail — diglossia, morphology, tokenization — and how the region is closing the gap at home." },

  // ---- Backdated history: Aug 2025 -> Feb 2026 -------------------------------
  { slug: "ftg-launch", type: "news", vertical: "The Group", author: "First Tech Group", date: "2025-08-06", read: "3 min read", tags: ["Launch", "Thesis"],
    title: "First Tech Group launches to build the digital economy's operating stack",
    dek: "We're launching First Tech Group to fund, build, and operate the core infrastructure of the digital economy — the venue where value trades, the wallet where it is held, and the intelligence that acts on both." },
  { slug: "founding-thesis-money-machine-readable", type: "article", vertical: "The Group", author: "First Tech Group", date: "2025-08-21", read: "8 min read", featured: true, tags: ["Thesis", "Operator-investor"],
    title: "Our founding thesis: money is becoming machine-readable",
    dek: "Value is turning programmable and machine-readable at the same moment intelligence is becoming an agent that can act on it. Our founding memo on why the next era needs an operating stack — owned, not just funded." },
  { slug: "gulf-financial-infrastructure-head-start", type: "research", vertical: "MENA", author: "FTG Research", date: "2025-09-17", read: "16 min read", featured: true, tags: ["MENA", "Regulation", "Vision 2030"],
    title: "The Gulf's head start: why the next financial infrastructure is being built in the UAE and Saudi Arabia",
    dek: "Regulatory clarity, sovereign capital, and a young, digital-native population have turned the Gulf into a launchpad for the next financial infrastructure. The data behind the why-here." },
  { slug: "exchange-is-the-keystone", type: "article", vertical: "Markets", author: "First Tech Group", date: "2025-10-09", read: "7 min read", tags: ["Markets", "Liquidity", "Exchange"],
    title: "Why the exchange is the keystone of the stack",
    dek: "Liquidity is the gravity of the digital economy. Why the venue where value trades is the first position we take — the layer everything else settles against." },
  { slug: "after-ftx-self-custody-default", type: "article", vertical: "Money", author: "First Tech Group", date: "2025-11-13", read: "7 min read", tags: ["Self-custody", "Security", "PRV Wallet"],
    title: "After FTX: making self-custody the default",
    dek: "“Not your keys, not your coins” stopped being a slogan and became a design requirement. Why self-custody is the right default — and what it takes to make it safe enough for everyone." },
  { slug: "arabic-first-not-translated", type: "article", vertical: "Applied AI", author: "First Tech Group", date: "2025-12-04", read: "8 min read", tags: ["Sovereign AI", "Arabic", "PRVAI"],
    title: "Arabic-first, not Arabic-translated: the case for sovereign AI",
    dek: "Arabic is not a translation target; it is a first-class design constraint. The case for region-grade, sovereign AI built for the language, the culture, and the law." },
  { slug: "stablecoins-become-plumbing", type: "research", vertical: "Money", author: "FTG Research", date: "2026-01-15", read: "14 min read", tags: ["Stablecoins", "Settlement", "Regulation"],
    title: "Stablecoins become plumbing: settlement, regulation, and the dirham",
    dek: "Stablecoins are quietly becoming the settlement layer of the internet. What the Gulf's payment-token frameworks signal — and why regulated stablecoins are infrastructure, not speculation." },
  { slug: "agents-will-need-wallets", type: "article", vertical: "Applied AI", author: "First Tech Group", date: "2026-02-19", read: "8 min read", tags: ["Agentic", "Convergence", "Wallets"],
    title: "Agents will need wallets: the convergence of money and machine intelligence",
    dek: "As AI agents begin to transact, they need somewhere to hold value, a rail to move it, and rules to act within. Why the wallet becomes the surface where money meets machine intelligence." },

  // ---- Existing pieces (dates preserved) ------------------------------------
  { slug: "the-stack-ep-02-sovereign-ai", type: "podcast", vertical: "MENA", author: "The Stack", date: "2026-03-24", read: "37 min listen", tags: ["Sovereign AI", "MENA"],
    title: "The Stack — Ep. 02: Sovereign AI and the residency moment",
    dek: "Region-grade Arabic models matured and residency became a buying requirement. What that unlocks for an operator-investor in the Gulf." },
  { slug: "ftg-ventures-rolling-open", type: "news", vertical: "The Group", author: "First Tech Group", date: "2026-04-01", read: "3 min read", tags: ["Ventures", "Open"],
    title: "FTG Ventures opens rolling submissions",
    dek: "We fund, build, and operate at the convergence of money and machine intelligence — pre-seed to Series A. Submissions are open." },
  { slug: "why-we-build-and-operate", type: "article", vertical: "The Group", author: "First Tech Group", date: "2026-04-10", read: "6 min read", tags: ["Operator-investor", "Studio"],
    title: "Why we build and operate, not just fund",
    dek: "Capital with conviction, a studio that ships, owners on the ground. The operator-investor model behind the group." },
  { slug: "prv-copilot-voice-native", type: "story", vertical: "Applied AI", author: "First Tech Group", date: "2026-04-22", read: "6 min read", tags: ["PRVAI", "Voice", "PRV Wallet"],
    title: "PRV Copilot: voice-native, wallet-integrated",
    dek: "What it means to put a voice-native assistant inside a non-custodial wallet — and why the memory layer is the moat." },
  { slug: "the-compounding-loop", type: "article", vertical: "The Group", author: "First Tech Group", date: "2026-05-02", read: "5 min read", tags: ["Network effects", "Backbone"],
    title: "The compounding loop",
    dek: "Liquidity makes the wallet useful. The wallet distributes the AI. The AI deepens the markets. And every interaction enriches a shared memory." },
  { slug: "mena-digital-economy-outlook-2026", type: "research", vertical: "MENA", author: "FTG Research", date: "2026-05-14", read: "22 min read", tags: ["MENA", "Sovereign", "Why now"],
    title: "MENA Digital-Economy Infrastructure — 2026 outlook",
    dek: "Sovereign AI crossed an inflection, residency became law, and money and intelligence are converging. The why-now for the region, with numbers." },
  { slug: "the-stack-ep-01", type: "podcast", vertical: "The Group", author: "The Stack", date: "2026-05-20", read: "41 min listen", tags: ["Podcast", "Thesis"],
    title: "The Stack — Ep. 01: Owning markets, money, and intelligence",
    dek: "The first episode of FTG's series on building digital-economy infrastructure: the convergence thesis and what it takes to operate, not just fund." },
  { slug: "inside-diwan-os", type: "story", vertical: "Applied AI", author: "First Tech Group", date: "2026-05-28", read: "8 min read", tags: ["PRVAI", "Diwan OS", "Memory graph"],
    title: "Inside Diwan OS: an Arabic-first lifecycle OS",
    dek: "One agent, many jobs, one memory. How PRVAI's flagship rents the best foundation models and owns the durable layer — voice, memory, orchestration." },
  { slug: "privacy-as-mathematics-prv-wallet", type: "article", vertical: "Money", author: "First Tech Group", date: "2026-06-05", read: "6 min read", tags: ["PRV Wallet", "ZK", "Self-custody"],
    title: "Privacy as mathematics: the PRV Wallet thesis",
    dek: "Non-custodial by default, keys derived and encrypted on-device, ZK where it counts. Why privacy has to be provable, not promised." },
  { slug: "building-exx1-from-the-metal-up", type: "story", vertical: "Markets", author: "First Tech Group", date: "2026-06-12", read: "9 min read", tags: ["Exx1", "In build"],
    title: "Building Exx1 from the metal up",
    dek: "Inside the build of a global digital-asset exchange — matching engine, custody discipline, and the liquidity layer the rest of the group settles against. Status: in active build." },
  { slug: "markets-money-intelligence-one-stack", type: "article", vertical: "The Group", author: "First Tech Group", date: "2026-06-18", read: "7 min read", featured: true, tags: ["Thesis", "Operator-investor"],
    title: "Markets · Money · Intelligence: why we own the stack",
    dek: "Three companies, one identity and memory backbone, a compounding loop between them. The thesis behind funding, building, and operating as one system." },
  { slug: "state-of-the-digital-asset-stack-2026", type: "research", vertical: "Markets", author: "FTG Research", date: "2026-06-20", read: "28 min read", featured: true, tags: ["Benchmark", "Exchange", "Index"],
    title: "State of the Digital-Asset Stack — 2026",
    dek: "Our inaugural annual benchmark: where liquidity, custody, and on-chain settlement are actually consolidating — and the index we'll track every year." },
];

const rows = plan.map((p) => ({
  slug: p.slug,
  title: p.title,
  dek: p.dek,
  body: body(p.slug),
  type: p.type,
  vertical: p.vertical,
  read_time: p.read,
  featured: !!p.featured,
  tags: p.tags ?? [],
  author_name: p.author,
  cover: `/insights/${p.slug}.png`,
  status: "published",
  published_at: new Date(p.date + "T09:00:00Z").toISOString(),
}));

const missing = rows.filter((r) => !r.body).map((r) => r.slug);
if (missing.length) console.log("NOTE: no markdown body yet for:", missing.join(", "));

const { error } = await sb.from("posts").upsert(rows, { onConflict: "slug" });
if (error) {
  console.error("seed failed:", error.message);
  process.exit(1);
}
const { count } = await sb.from("posts").select("id", { count: "exact", head: true });
console.log(`seeded/updated ${rows.length} posts ✅  (${rows.length - missing.length} with bodies)  total in DB: ${count}`);
