import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Badge, LinkButton } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, buildMetadata, jobPostingSchema } from "@/lib/seo";
import { interviewStages, interviewNote } from "@/content/careers";
import { EMPLOYMENT_LABELS, WORK_MODE_LABELS, formatSalary } from "@/lib/format";

type Job = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  location: string | null;
  employment_type: string;
  work_mode: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  department_id: string | null;
  posted_at: string | null;
};

async function getJob(slug: string): Promise<Job | null> {
  const supabase = createClient();
  const { data } = await supabase.from("jobs").select("*").eq("slug", slug).maybeSingle();
  return (data as Job) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getJob(params.slug);
  if (!job) return { title: "Role — First Tech Group" };
  return buildMetadata({
    title: `${job.title} — Careers at First Tech Group`,
    description:
      job.summary ??
      `${job.title} at First Tech Group — build the operating stack for the digital economy.`,
    path: `/careers/${job.slug}`,
  });
}

function Prose({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section className="mt-10">
      <h2 className="font-mono text-[12px] uppercase tracking-[.18em] text-spark">{title}</h2>
      <div className="mt-3 text-[var(--muted)] text-[15px] leading-[1.7] whitespace-pre-line max-w-[68ch]">
        {body}
      </div>
    </section>
  );
}

export default async function RolePage({ params }: { params: { slug: string } }) {
  const job = await getJob(params.slug);
  if (!job) notFound();

  const supabase = createClient();
  let deptName: string | null = null;
  if (job.department_id) {
    const { data: dep } = await supabase
      .from("departments")
      .select("name")
      .eq("id", job.department_id)
      .maybeSingle();
    deptName = (dep?.name as string) ?? null;
  }

  const user = await getUser();
  const applyHref = `/careers/${job.slug}/apply`;
  const ctaHref = user ? applyHref : `/login?next=${encodeURIComponent(applyHref)}`;
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: job.title, path: `/careers/${job.slug}` },
          ]),
          jobPostingSchema({
            title: job.title,
            slug: job.slug,
            description: job.summary ?? job.description ?? job.title,
            datePosted: job.posted_at ?? undefined,
            employmentType: (EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type)
              .toUpperCase()
              .replace(/[\s-]/g, "_"),
            location: job.location ?? undefined,
            remote: job.work_mode === "remote",
          }),
        ]}
      />
      <SiteHeader />
      <main className="wrap pt-[112px] pb-24 min-h-screen">
        <Link
          href="/careers"
          className="font-mono text-[12px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-paper"
        >
          ← All roles
        </Link>

        <header className="mt-6 border-b border-[var(--line)] pb-8">
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-[var(--muted-2)]">
            {deptName ?? "First Tech Group"}
          </div>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-[-.02em] leading-[1.05] max-w-[24ch]">
            {job.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {job.location && <Badge>{job.location}</Badge>}
            <Badge>{EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}</Badge>
            <Badge>{WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}</Badge>
            {salary && <Badge tone="spark">{salary}</Badge>}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <LinkButton href={ctaHref} variant="spark">
              Apply for this role →
            </LinkButton>
            {!user && (
              <span className="font-mono text-[12px] text-[var(--muted-2)]">
                You&apos;ll sign in first — it takes a minute.
              </span>
            )}
          </div>
        </header>

        {job.summary && (
          <p className="mt-8 text-lg text-paper/90 leading-[1.6] max-w-[68ch]">{job.summary}</p>
        )}

        <Prose title="About the role" body={job.description} />
        <Prose title="What you'll do" body={job.responsibilities} />
        <Prose title="What we're looking for" body={job.requirements} />

        {/* Context before the sign-in wall: what applying actually involves. */}
        <section className="mt-12 border-t border-[var(--line)] pt-10" aria-label="What happens after you apply">
          <h2 className="font-mono text-[12px] uppercase tracking-[.18em] text-spark">
            What happens after you apply
          </h2>
          <ol className="mt-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            {interviewStages.map((s) => (
              <li key={s.n} className="bg-ink p-5">
                <span className="font-mono text-[13px] font-bold text-spark tracking-[.1em]">{s.n}</span>
                <h3 className="mt-2 text-[14px] font-bold">{s.title}</h3>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[var(--muted)] text-[13.5px] max-w-[70ch] leading-[1.6]">
            {interviewNote} Your application is handled per the{" "}
            <Link href="/legal/candidate-privacy" className="text-spark underline underline-offset-2">
              Candidate Privacy Notice
            </Link>{" "}
            — humans review it, and unsuccessful applications are deleted after six months. Curious about{" "}
            <Link href="/careers#benefits" className="text-spark underline underline-offset-2">
              benefits
            </Link>{" "}
            or{" "}
            <Link href="/careers#visas" className="text-spark underline underline-offset-2">
              visas &amp; relocation
            </Link>
            ? It&apos;s all on the careers page.
          </p>
        </section>

        <div className="mt-12 border-t border-[var(--line)] pt-8 flex flex-wrap items-center gap-4">
          <LinkButton href={ctaHref} variant="spark">
            Apply for this role →
          </LinkButton>
          <Link
            href="/careers"
            className="font-mono text-[12px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-paper"
          >
            ← Back to all roles
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
