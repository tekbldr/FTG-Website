import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LinkButton } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { pitchCopy, whatWeFund, pitchProcess, evaluationCriteria, afterSubmit, founderInquiry } from "@/content/pitch";

export const metadata: Metadata = buildMetadata({
  title: "Pitch us — FTG Ventures",
  description:
    "We fund, build, and operate at the convergence of money and machine intelligence. Pre-seed to Series A. Read the Founder FAQ and pitch guidance, then submit — every submission reaches the investment team directly.",
  path: "/pitch",
});

export default async function PitchPage() {
  const supabase = createClient();
  const { data: program } = await supabase
    .from("programs")
    .select("name,description,slug,status")
    .eq("status", "open")
    .order("opens_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const user = await getUser();
  const submitHref = user ? "/portal/founder/new" : "/login?next=/portal/founder/new";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pitch us", path: "/pitch" },
        ])}
      />
      <SiteHeader />
      <main className="wrap pt-[112px] pb-24 min-h-screen">
        {/* Hero */}
        <header className="border-b border-[var(--line)] pb-12 grid-bg">
          <div className="eyebrow">{pitchCopy.eyebrow}</div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-.02em] leading-[1.04] max-w-[20ch]">
            {pitchCopy.headline}
          </h1>
          <p className="mt-5 text-[var(--muted)] max-w-[62ch] text-lg leading-[1.6]">
            {program?.description ?? pitchCopy.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href={submitHref} variant="spark">
              Submit your company →
            </LinkButton>
            <a
              href="#evaluate"
              className="font-mono text-[12.5px] uppercase tracking-[.12em] text-[var(--muted)] hover:text-paper"
            >
              How we evaluate
            </a>
            {program?.name && (
              <span className="ml-auto font-mono text-[11px] uppercase tracking-[.16em] text-[var(--muted-2)]">
                {program.name} · Open
              </span>
            )}
          </div>
          {/* Read-before-you-register: guidance founders get with no account required. */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/pitch/what-good-looks-like" className="more-chip">
              What a good FTG pitch looks like →
            </Link>
            <Link href="/pitch/faq" className="more-chip">
              Founder FAQ →
            </Link>
            <Link href="/legal/founder-privacy" className="more-chip">
              How your deck is protected →
            </Link>
          </div>
        </header>

        {/* What we fund */}
        <Section idx="01 — WHAT WE FUND" title="One stack: markets, money, intelligence.">
          <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {whatWeFund.map((t) => (
              <div key={t.k} className="bg-ink p-7">
                <div className="font-mono text-[11px] uppercase tracking-[.2em] text-spark">{t.k}</div>
                <p className="mt-3 text-[var(--muted)] text-[14.5px] leading-[1.6]">{t.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Process */}
        <Section idx="02 — THE PROCESS" title="From submission to funded.">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {pitchProcess.map((s) => (
              <li key={s.n} className="bg-ink p-6">
                <div className="font-mono text-[1.1rem] font-bold text-spark tracking-[.1em]">{s.n}</div>
                <h3 className="mt-3 text-[15px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[var(--muted)] text-[13px] leading-[1.55]">{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* After you submit — transparency before the account wall */}
        <Section idx="03 — AFTER YOU SUBMIT" title={afterSubmit.heading}>
          <p className="text-[var(--muted)] max-w-[62ch] text-[15px] leading-[1.65]">{afterSubmit.body}</p>
          <ul className="mt-6 grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {afterSubmit.points.map((p) => (
              <li key={p} className="bg-ink p-6 text-[var(--muted)] text-[14px] leading-[1.6]">
                {p}
              </li>
            ))}
          </ul>
        </Section>

        {/* Evaluate */}
        <Section idx="04 — WHAT WE EVALUATE" title="A clear, consistent scorecard." anchor="evaluate">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {evaluationCriteria.map((c) => (
              <div key={c.k} className="bg-ink p-6">
                <div className="font-mono text-[11px] uppercase tracking-[.18em] text-paper">{c.k}</div>
                <p className="mt-2 text-[var(--muted)] text-[13px] leading-[1.55]">{c.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Partner / direct inquiry — the escape hatch beside the intake wizard */}
        <Section idx="05 — DIRECT INQUIRY" title={founderInquiry.heading}>
          <p className="text-[var(--muted)] max-w-[62ch] text-[15px] leading-[1.65]">{founderInquiry.body}</p>
          <div className="mt-6">
            <a href={`mailto:${founderInquiry.email}`} className="btn">
              {founderInquiry.email}
            </a>
          </div>
        </Section>

        {/* Closing CTA */}
        <section className="mt-20 border-t border-[var(--line)] pt-14 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-[-.02em] max-w-[24ch] mx-auto">
            Building something at the convergence of money and machine intelligence?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <LinkButton href={submitHref} variant="spark">
              Submit your company →
            </LinkButton>
            <Link href="/pitch/faq" className="btn">
              Founder FAQ
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  idx,
  title,
  anchor,
  children,
}: {
  idx: string;
  title: string;
  anchor?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={anchor} className="mt-16 scroll-mt-[100px]">
      <div className="max-w-[60ch]">
        <span className="idx">{idx}</span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-.02em]">{title}</h2>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}
