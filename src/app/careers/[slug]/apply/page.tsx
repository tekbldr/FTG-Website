import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser, getProfile } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LinkButton } from "@/components/ui";
import { ApplyWizard } from "@/components/careers/ApplyWizard";

export const dynamic = "force-dynamic";

export default async function ApplyPage({ params }: { params: { slug: string } }) {
  const applyPath = `/careers/${params.slug}/apply`;
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(applyPath)}`);

  const supabase = createClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("id,title,slug,status")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!job) notFound();

  const profile = await getProfile();
  const nameParts = (profile?.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const prefill = {
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" "),
    email: profile?.email ?? user.email ?? "",
  };

  // Already applied?
  let already = false;
  const { data: cand } = await supabase.from("candidates").select("id").eq("user_id", user.id).maybeSingle();
  if (cand) {
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("candidate_id", cand.id)
      .eq("job_id", job.id)
      .maybeSingle();
    already = !!existing;
  }

  const closed = job.status !== "open";

  return (
    <>
      <SiteHeader />
      <main className="pt-[112px] pb-24 min-h-screen">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <Link
            href={`/careers/${job.slug}`}
            className="font-mono text-[12px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-paper"
          >
            ← {job.title}
          </Link>

          <header className="mt-5 border-b border-[var(--line)] pb-7">
            <div className="eyebrow">Apply</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-[-.02em]">{job.title}</h1>
          </header>

          <div className="mt-8">
            {closed ? (
              <Notice title="This role is closed">
                This role is no longer accepting applications.{" "}
                <Link href="/careers" className="text-spark">
                  Browse open roles
                </Link>
                .
              </Notice>
            ) : already ? (
              <Notice title="You've already applied">
                You&apos;ve already submitted an application for this role. Track its status in your portal.
                <div className="mt-5">
                  <LinkButton href="/portal/candidate" variant="spark">
                    Go to my applications →
                  </LinkButton>
                </div>
              </Notice>
            ) : (
              <ApplyWizard job={{ id: job.id, title: job.title }} prefill={prefill} />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-8">
      <h2 className="font-mono text-[12px] uppercase tracking-[.16em] text-spark">{title}</h2>
      <p className="mt-3 text-[var(--muted)] text-[15px] leading-[1.6]">{children}</p>
    </div>
  );
}
