// One-off: seed the Insights CMS `posts` table from the original static content.
// Run: node scripts/seed-posts.mjs   (reads keys from .env.local)
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

const insights = [
  { slug: "state-of-the-digital-asset-stack-2026", type: "research", vertical: "Markets", title: "State of the Digital-Asset Stack — 2026", excerpt: "Our inaugural annual benchmark: where liquidity, custody, and on-chain settlement are actually consolidating — and the index we'll track every year.", author: "FTG Research", date: "2026-06-20", readTime: "28 min read", featured: true, tags: ["Benchmark", "Exchange", "Index"], body: "This is the first edition of FTG's annual State of the Digital-Asset Stack — a data-backed read on how the markets, money, and intelligence layers of the digital economy are consolidating, and the named index we will publish every year." },
  { slug: "markets-money-intelligence-one-stack", type: "article", vertical: "The Group", title: "Markets · Money · Intelligence: why we own the stack", excerpt: "Three companies, one identity and memory backbone, a compounding loop between them. The thesis behind funding, building, and operating as one system.", author: "First Tech Group", date: "2026-06-18", readTime: "7 min read", featured: true, tags: ["Thesis", "Operator-investor"], body: "We are not building features. We are assembling the operating stack for how value will move, be secured, and be acted upon — owned as one system before others unbundle it." },
  { slug: "building-exx1-from-the-metal-up", type: "story", vertical: "Markets", title: "Building Exx1 from the metal up", excerpt: "Inside the build of a global digital-asset exchange — matching engine, custody discipline, and the liquidity layer the rest of the group settles against. Status: in active build.", author: "First Tech Group", date: "2026-06-12", readTime: "9 min read", featured: false, tags: ["Exx1", "In build"], body: null },
  { slug: "privacy-as-mathematics-prv-wallet", type: "article", vertical: "Money", title: "Privacy as mathematics: the PRV Wallet thesis", excerpt: "Non-custodial by default, keys derived and encrypted on-device, ZK where it counts. Why privacy has to be provable, not promised.", author: "First Tech Group", date: "2026-06-05", readTime: "6 min read", featured: false, tags: ["PRV Wallet", "ZK", "Self-custody"], body: null },
  { slug: "inside-diwan-os", type: "story", vertical: "Applied AI", title: "Inside Diwan OS: an Arabic-first lifecycle OS", excerpt: "One agent, many jobs, one memory. How PRVAI's flagship rents the best foundation models and owns the durable layer — voice, memory, orchestration.", author: "First Tech Group", date: "2026-05-28", readTime: "8 min read", featured: false, tags: ["PRVAI", "Diwan OS", "Memory graph"], body: null },
  { slug: "the-stack-ep-01", type: "podcast", vertical: "The Group", title: "The Stack — Ep. 01: Owning markets, money, and intelligence", excerpt: "The first episode of FTG's series on building digital-economy infrastructure: the convergence thesis and what it takes to operate, not just fund.", author: "The Stack", date: "2026-05-20", readTime: "41 min listen", featured: false, tags: ["Podcast", "Thesis"], body: null },
  { slug: "mena-digital-economy-outlook-2026", type: "research", vertical: "MENA", title: "MENA Digital-Economy Infrastructure — 2026 outlook", excerpt: "Sovereign AI crossed an inflection, residency became law, and money and intelligence are converging. The why-now for the region, with numbers.", author: "FTG Research", date: "2026-05-14", readTime: "22 min read", featured: false, tags: ["MENA", "Sovereign", "Why now"], body: null },
  { slug: "the-compounding-loop", type: "article", vertical: "The Group", title: "The compounding loop", excerpt: "Liquidity makes the wallet useful. The wallet distributes the AI. The AI deepens the markets. And every interaction enriches a shared memory.", author: "First Tech Group", date: "2026-05-02", readTime: "5 min read", featured: false, tags: ["Network effects", "Backbone"], body: null },
  { slug: "prv-copilot-voice-native", type: "story", vertical: "Applied AI", title: "PRV Copilot: voice-native, wallet-integrated", excerpt: "What it means to put a voice-native assistant inside a non-custodial wallet — and why the memory layer is the moat.", author: "First Tech Group", date: "2026-04-22", readTime: "6 min read", featured: false, tags: ["PRVAI", "Voice", "PRV Wallet"], body: null },
  { slug: "why-we-build-and-operate", type: "article", vertical: "The Group", title: "Why we build and operate, not just fund", excerpt: "Capital with conviction, a studio that ships, owners on the ground. The operator-investor model behind the group.", author: "First Tech Group", date: "2026-04-10", readTime: "5 min read", featured: false, tags: ["Operator-investor", "Studio"], body: null },
  { slug: "ftg-ventures-rolling-open", type: "news", vertical: "The Group", title: "FTG Ventures opens rolling submissions", excerpt: "We fund, build, and operate at the convergence of money and machine intelligence — pre-seed to Series A. Submissions are open.", author: "First Tech Group", date: "2026-04-01", readTime: "2 min read", featured: false, tags: ["Ventures", "Open"], body: null },
  { slug: "the-stack-ep-02-sovereign-ai", type: "podcast", vertical: "MENA", title: "The Stack — Ep. 02: Sovereign AI and the residency moment", excerpt: "Region-grade Arabic models matured and residency became a buying requirement. What that unlocks for an operator-investor in the Gulf.", author: "The Stack", date: "2026-03-24", readTime: "37 min listen", featured: false, tags: ["Sovereign AI", "MENA"], body: null },
];

const rows = insights.map((i) => ({
  slug: i.slug,
  title: i.title,
  dek: i.excerpt,
  body: i.body ?? null,
  type: i.type,
  vertical: i.vertical,
  read_time: i.readTime,
  featured: i.featured ?? false,
  tags: i.tags ?? [],
  author_name: i.author,
  status: "published",
  published_at: new Date(i.date + "T09:00:00Z").toISOString(),
}));

const { error } = await sb.from("posts").upsert(rows, { onConflict: "slug" });
if (error) {
  console.error("seed failed:", error.message);
  process.exit(1);
}
const { count } = await sb.from("posts").select("id", { count: "exact", head: true });
console.log("seeded ✅  posts in DB:", count);
