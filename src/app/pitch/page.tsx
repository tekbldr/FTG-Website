import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LinkButton } from "@/components/ui";
import { pitchCopy, whatWeFund, pitchProcess, evaluationCriteria } from "@/content/pitch";

export const metadata: Metadata = {
  title: "Pitch us — FTG Ventures",
  description: "We fund, build, and operate at the convergence of money and machine intelligence. Pre-seed to Series A.",
};

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

        {/* Evaluate */}
        <Section idx="03 — WHAT WE EVALUATE" title="A clear, consistent scorecard." anchor="evaluate">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {evaluationCriteria.map((c) => (
              <div key={c.k} className="bg-ink p-6">
                <div className="font-mono text-[11px] uppercase tracking-[.18em] text-paper">{c.k}</div>
                <p className="mt-2 text-[var(--muted)] text-[13px] leading-[1.55]">{c.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Closing CTA */}
        <section className="mt-20 border-t border-[var(--line)] pt-14 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-[-.02em] max-w-[24ch] mx-auto">
            Building something at the convergence of money and machine intelligence?
          </h2>
          <div className="mt-8">
            <LinkButton href={submitHref} variant="spark">
              Submit your company →
            </LinkButton>
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
