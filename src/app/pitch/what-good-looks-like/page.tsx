import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingEffects } from "@/components/marketing/MarketingEffects";
import { LinkButton } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { goodPitch, evaluationCriteria, founderInquiry } from "@/content/pitch";

export const metadata: Metadata = buildMetadata({
  title: "What a good FTG pitch looks like — FTG Ventures",
  description:
    "Practical guidance from the FTG investment team: lead with an expensive problem, make 'why now' undeniable, show the sharp edge, frame honest numbers, keep the deck short.",
  path: "/pitch/what-good-looks-like",
});

export default function GoodPitchPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pitch us", path: "/pitch" },
          { name: "What a good pitch looks like", path: "/pitch/what-good-looks-like" },
        ])}
      />
      <SiteHeader />
      <main className="wrap pt-[112px] pb-24 min-h-screen">
        <header className="border-b border-[var(--line)] pb-10 grid-bg">
          <Link href="/pitch" className="eyebrow product-back">
            ← Pitch us
          </Link>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-[-.02em] leading-[1.05] max-w-[22ch]">
            What a good FTG pitch looks like
          </h1>
          <p className="mt-4 text-[var(--muted)] max-w-[62ch] text-[15.5px] leading-[1.6]">
            We read every submission, so this is self-interest as much as generosity: the clearer your
            pitch, the faster and fairer our answer. Six things the strongest pitches we see get right.
          </p>
        </header>

        <section className="mt-10" aria-label="Pitch guidance">
          <ol className="grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {goodPitch.map((g, i) => (
              <li key={g.title} className="bg-ink p-7">
                <div className="font-mono text-[1.05rem] font-bold text-spark tracking-[.1em]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-3 text-[17px] font-bold tracking-[-.01em]">{g.title}</h2>
                <p className="mt-2 text-[var(--muted)] text-[14px] leading-[1.6]">{g.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <span className="idx">HOW IT&apos;S SCORED</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-.02em] max-w-[24ch]">
            Your pitch meets a rubric, not a mood.
          </h2>
          <p className="mt-3 text-[var(--muted)] max-w-[62ch] text-[14.5px] leading-[1.6]">
            Every submission is scored by the investment team against the same five criteria — so the
            guidance above maps directly to how you will be evaluated.
          </p>
          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {evaluationCriteria.map((c) => (
              <div key={c.k} className="bg-ink p-6">
                <div className="font-mono text-[11px] uppercase tracking-[.18em] text-paper">{c.k}</div>
                <p className="mt-2 text-[var(--muted)] text-[13px] leading-[1.55]">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href="/login?next=/portal/founder/new" variant="spark">
              Submit your company →
            </LinkButton>
            <Link href="/pitch/faq" className="btn">
              Founder FAQ
            </Link>
            <a
              href={`mailto:${founderInquiry.email}`}
              className="font-mono text-[12px] uppercase tracking-[.12em] text-[var(--muted)] hover:text-paper"
            >
              {founderInquiry.email}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MarketingEffects />
    </>
  );
}
