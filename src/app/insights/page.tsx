import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { InsightCard } from "@/components/insights/InsightCard";
import { InsightsFeed } from "@/components/insights/InsightsFeed";
import { NewsletterSignup } from "@/components/insights/NewsletterSignup";
import { getPublishedInsights } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights — First Tech Group",
  description:
    "FTG's research, founder stories, and field notes on building and operating the digital economy's core infrastructure.",
};

export default async function InsightsPage() {
  const sorted = await getPublishedInsights();
  const featured = sorted.filter((i) => i.featured).slice(0, 2);

  return (
    <>
      <SiteHeader />
      <main className="pt-[100px] pb-24 min-h-screen">
        <div className="wrap">
          <header className="grid-bg border-b border-[var(--line)] pb-9">
            <div className="eyebrow">Insights · Markets · Money · Intelligence</div>
            <h1 className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.04] tracking-[-.02em] sm:text-6xl">
              Ideas, not just capital.
            </h1>
            <p className="mt-5 max-w-[62ch] text-lg leading-[1.6] text-[var(--muted)]">
              First Tech Group&apos;s research, founder stories, and field notes on building and operating the digital
              economy&apos;s core infrastructure.
            </p>
          </header>

          {featured.length > 0 && (
            <section className="mt-8" aria-label="Featured">
              <div className="idx mb-4">FEATURED</div>
              <div className="grid gap-4 md:grid-cols-2">
                {featured.map((i) => (
                  <InsightCard key={i.slug} item={i} featured />
                ))}
              </div>
            </section>
          )}

          {sorted.length > 0 ? (
            <InsightsFeed items={sorted} />
          ) : (
            <p className="mt-16 text-center text-[var(--muted)]">No insights published yet.</p>
          )}

          <div className="mt-16">
            <NewsletterSignup />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
