import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingEffects } from "@/components/marketing/MarketingEffects";
import { LinkButton } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { founderFaq, founderInquiry } from "@/content/pitch";

export const metadata: Metadata = buildMetadata({
  title: "Founder FAQ — FTG Ventures",
  description:
    "Everything founders ask before pitching FTG: what we invest in, stage and geography, how the process works, how decks are protected, NDAs, and what happens if we pass.",
  path: "/pitch/faq",
});

export default function FounderFaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pitch us", path: "/pitch" },
            { name: "Founder FAQ", path: "/pitch/faq" },
          ]),
          faqSchema(founderFaq.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      <SiteHeader />
      <main className="wrap pt-[112px] pb-24 min-h-screen">
        <header className="border-b border-[var(--line)] pb-10 grid-bg">
          <Link href="/pitch" className="eyebrow product-back">
            ← Pitch us
          </Link>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-[-.02em] leading-[1.05] max-w-[20ch]">
            Founder FAQ
          </h1>
          <p className="mt-4 text-[var(--muted)] max-w-[62ch] text-[15.5px] leading-[1.6]">
            The questions founders ask before creating an account — answered plainly, before we ask
            you for anything. Still unsure about something? Email{" "}
            <a href={`mailto:${founderInquiry.email}`} className="text-spark underline underline-offset-2">
              {founderInquiry.email}
            </a>
            .
          </p>
        </header>

        <section className="mt-10 max-w-[76ch]" aria-label="Frequently asked questions">
          {founderFaq.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="q">{f.q}</span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <section className="mt-14 border-t border-[var(--line)] pt-10">
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href="/login?next=/portal/founder/new" variant="spark">
              Submit your company →
            </LinkButton>
            <Link href="/pitch/what-good-looks-like" className="btn">
              What a good pitch looks like
            </Link>
            <Link href="/legal/founder-privacy" className="font-mono text-[12px] uppercase tracking-[.12em] text-[var(--muted)] hover:text-paper">
              How your materials are protected →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MarketingEffects />
    </>
  );
}
