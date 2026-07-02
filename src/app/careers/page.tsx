import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingEffects } from "@/components/marketing/MarketingEffects";
import { Badge, Button, LinkButton, Input, Select } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import {
  careersIntro,
  culture,
  benefits,
  interviewStages,
  interviewNote,
  visaRelocation,
  teamStories,
  hiringCta,
} from "@/content/careers";
import {
  EMPLOYMENT_LABELS,
  WORK_MODE_LABELS,
  EMPLOYMENT_OPTIONS,
  WORK_MODE_OPTIONS,
  firstParam,
} from "@/lib/format";

export const metadata: Metadata = buildMetadata({
  title: "Careers — First Tech Group",
  description:
    "Open roles across Exx1, PRVAI, PRV Wallet, Diwan OS, and EQWT1 — plus how we work, benefits, the interview process, and our visa & relocation policy.",
  path: "/careers",
});

type JobRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  location: string | null;
  employment_type: string;
  work_mode: string;
  department_id: string | null;
};

export default async function CareersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();

  const q = firstParam(searchParams.q);
  const department = firstParam(searchParams.department);
  const type = firstParam(searchParams.type);
  const mode = firstParam(searchParams.mode);

  const { data: departments } = await supabase
    .from("departments")
    .select("id,name")
    .order("name");
  const deptName = new Map((departments ?? []).map((d) => [d.id as string, d.name as string]));

  let query = supabase
    .from("jobs")
    .select("id,title,slug,summary,location,employment_type,work_mode,department_id")
    .eq("status", "open");

  if (department) query = query.eq("department_id", department);
  if (type) query = query.eq("employment_type", type);
  if (mode) query = query.eq("work_mode", mode);
  if (q) {
    // Sanitize for the PostgREST or() grammar (commas/parens are delimiters).
    const safe = q.replace(/[,()*\\%]/g, " ").trim();
    if (safe) query = query.or(`title.ilike.%${safe}%,summary.ilike.%${safe}%`);
  }

  const { data, error } = await query.order("posted_at", { ascending: false });
  const jobs = (data ?? []) as JobRow[];
  const hasFilters = Boolean(q || department || type || mode);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ])}
      />
      <SiteHeader />
      <main id="top" className="wrap pt-[112px] pb-24 min-h-screen scroll-mt-[100px]">
        {/* Header */}
        <header className="border-b border-[var(--line)] pb-10 grid-bg">
          <div className="eyebrow">{careersIntro.eyebrow}</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-[-.02em] leading-[1.05] max-w-[22ch]">
            {careersIntro.headline}
          </h1>
          <p className="mt-4 text-[var(--muted)] max-w-[60ch] text-[15px]">{careersIntro.sub}</p>
          {/* Everything a candidate wants to know before applying, one scroll away. */}
          <div className="mt-6 flex flex-wrap gap-2">
            <a href="#how-we-work" className="more-chip">Life at FTG</a>
            <a href="#benefits" className="more-chip">Benefits</a>
            <a href="#how-we-hire" className="more-chip">How we hire</a>
            <a href="#visas" className="more-chip">Visas &amp; relocation</a>
          </div>
        </header>

        {/* Filters */}
        <form method="get" className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input name="q" defaultValue={q} placeholder="Search roles…" aria-label="Search roles" />
          <Select name="department" defaultValue={department} aria-label="Department">
            <option value="">All departments</option>
            {(departments ?? []).map((dep) => (
              <option key={dep.id as string} value={dep.id as string}>
                {dep.name as string}
              </option>
            ))}
          </Select>
          <Select name="type" defaultValue={type} aria-label="Employment type">
            <option value="">All types</option>
            {EMPLOYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <Select name="mode" defaultValue={mode} aria-label="Work mode">
            <option value="">Any location type</option>
            {WORK_MODE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <div className="lg:col-span-4 flex items-center gap-3">
            <Button type="submit" variant="spark">
              Filter roles
            </Button>
            {hasFilters && (
              <LinkButton href="/careers" variant="ghost">
                Clear
              </LinkButton>
            )}
            <span className="ml-auto font-mono text-[12px] text-[var(--muted-2)]">
              {jobs.length} {jobs.length === 1 ? "role" : "roles"}
            </span>
          </div>
        </form>

        {/* Results */}
        <section className="mt-8 grid gap-3" aria-label="Open roles">
          {error && (
            <p className="text-[var(--muted)] text-sm" role="alert">
              We couldn&apos;t load roles right now. Please try again shortly.
            </p>
          )}
          {!error && jobs.length === 0 && (
            <div className="border border-[var(--line)] rounded-[2px] bg-[var(--ink-2)] p-10 text-center">
              <p className="font-mono text-[12px] uppercase tracking-[.16em] text-[var(--muted-2)]">
                No roles match
              </p>
              <p className="mt-3 text-[var(--muted)] text-[15px]">
                {hasFilters
                  ? "Try clearing filters — or check back soon."
                  : "No open roles right now. Check back soon, or pitch us instead."}
              </p>
            </div>
          )}
          {jobs.map((job, i) => (
            <Link
              key={job.id}
              href={`/careers/${job.slug}`}
              className="group block border border-[var(--line)] rounded-[2px] bg-[var(--ink-2)] p-6 transition hover:border-[var(--line-2)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-[.18em] text-[var(--muted-2)]">
                    {String(i + 1).padStart(2, "0")} —{" "}
                    {job.department_id ? deptName.get(job.department_id) ?? "First Tech Group" : "First Tech Group"}
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-[-.01em] transition group-hover:text-spark">
                    {job.title}
                  </h2>
                  {job.summary && (
                    <p className="mt-2 text-[var(--muted)] text-[14.5px] max-w-[64ch]">{job.summary}</p>
                  )}
                </div>
                <span className="font-mono text-[12px] uppercase tracking-[.12em] text-spark whitespace-nowrap">
                  View →
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.location && <Badge>{job.location}</Badge>}
                <Badge>{EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}</Badge>
                <Badge>{WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}</Badge>
              </div>
            </Link>
          ))}
        </section>

        {/* ── Employer brand: the context candidates deserve before applying ── */}

        {/* How we work */}
        <section id="how-we-work" className="mt-20 scroll-mt-[100px]">
          <span className="idx">01 — HOW WE WORK</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-.02em]">
            Culture, stated as operating principles.
          </h2>
          <div className="mt-7 grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {culture.map((c) => (
              <div key={c.title} className="bg-ink p-7">
                <h3 className="text-[16.5px] font-bold tracking-[-.01em]">{c.title}</h3>
                <p className="mt-2 text-[var(--muted)] text-[14px] leading-[1.6]">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="mt-16 scroll-mt-[100px]">
          <span className="idx">02 — BENEFITS</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-.02em]">
            The basics, done properly.
          </h2>
          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {benefits.map((b) => (
              <div key={b.title} className="bg-ink p-6">
                <h3 className="text-[15px] font-bold">{b.title}</h3>
                <p className="mt-2 text-[var(--muted)] text-[13.5px] leading-[1.55]">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How we hire */}
        <section id="how-we-hire" className="mt-16 scroll-mt-[100px]">
          <span className="idx">03 — HOW WE HIRE</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-.02em]">
            Five stages, no black hole.
          </h2>
          <ol className="mt-7 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {interviewStages.map((s) => (
              <li key={s.n} className="bg-ink p-6">
                <div className="font-mono text-[1.1rem] font-bold text-spark tracking-[.1em]">{s.n}</div>
                <h3 className="mt-3 text-[15px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[var(--muted)] text-[13px] leading-[1.55]">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[var(--muted)] text-[14px] max-w-[70ch] leading-[1.6]">
            {interviewNote} Your data is handled per the{" "}
            <Link href="/legal/candidate-privacy" className="text-spark underline underline-offset-2">
              Candidate Privacy Notice
            </Link>
            .
          </p>
        </section>

        {/* Visas & relocation */}
        <section id="visas" className="mt-16 scroll-mt-[100px]">
          <span className="idx">04 — VISAS &amp; RELOCATION</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-.02em] max-w-[24ch]">
            {visaRelocation.heading}
          </h2>
          <p className="mt-4 text-[var(--muted)] max-w-[70ch] text-[15px] leading-[1.65]">
            {visaRelocation.body}
          </p>
        </section>

        {/* Inside the team */}
        <section className="mt-16">
          <span className="idx">05 — INSIDE THE TEAM</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-.02em]">
            What the work is actually like.
          </h2>
          <div className="mt-7 grid md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {teamStories.map((t) => (
              <div key={t.role} className="bg-ink p-7">
                <div className="font-mono text-[11px] uppercase tracking-[.2em] text-spark">{t.role}</div>
                <h3 className="mt-3 text-[16px] font-bold tracking-[-.01em]">{t.title}</h3>
                <p className="mt-2 text-[var(--muted)] text-[14px] leading-[1.6]">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hiring CTA */}
        <section className="mt-20 border-t border-[var(--line)] pt-14 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-[-.02em] max-w-[24ch] mx-auto">
            {hiringCta.heading}
          </h2>
          <p className="mt-4 text-[var(--muted)] max-w-[56ch] mx-auto text-[15px] leading-[1.6]">
            {hiringCta.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <LinkButton href="#top" variant="spark">
              View open roles ↑
            </LinkButton>
            <a href={`mailto:${hiringCta.email}?subject=Careers%20at%20FTG`} className="btn">
              {hiringCta.email}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MarketingEffects />
    </>
  );
}
