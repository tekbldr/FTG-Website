import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Badge, LinkButton } from "@/components/ui";
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
};

async function getJob(slug: string): Promise<Job | null> {
  const supabase = createClient();
  const { data } = await supabase.from("jobs").select("*").eq("slug", slug).maybeSingle();
  return (data as Job) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getJob(params.slug);
  if (!job) return { title: "Role — First Tech Group" };
  return { title: `${job.title} — First Tech Group`, description: job.summary ?? undefined };
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
