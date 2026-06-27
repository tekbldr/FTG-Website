import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser, getProfile } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LinkButton } from "@/components/ui";
import { IntakeWizard } from "@/components/pitch/IntakeWizard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Submit your company — FTG Ventures" };

export default async function NewSubmissionPage() {
  const user = await requireUser();
  const supabase = createClient();

  const { data: program } = await supabase
    .from("programs")
    .select("id,name,status")
    .eq("status", "open")
    .order("opens_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const profile = await getProfile();
  const prefill = {
    founderName: profile?.full_name ?? "",
    founderEmail: profile?.email ?? user.email ?? "",
  };

  return (
    <>
      <SiteHeader />
      <main className="pt-[112px] pb-24 min-h-screen">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <Link
            href="/portal/founder"
            className="font-mono text-[12px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-paper"
          >
            ← My submissions
          </Link>

          <header className="mt-5 border-b border-[var(--line)] pb-7">
            <div className="eyebrow">{program?.name ?? "FTG Ventures"}</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-[-.02em]">Submit your company</h1>
            <p className="mt-3 text-[var(--muted)] text-[15px]">
              A few minutes. Everything reaches the FTG investment team directly.
            </p>
          </header>

          <div className="mt-8">
            {program ? (
              <IntakeWizard programId={program.id} prefill={prefill} />
            ) : (
              <div className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-8">
                <h2 className="font-mono text-[12px] uppercase tracking-[.16em] text-spark">No open program</h2>
                <p className="mt-3 text-[var(--muted)] text-[15px]">
                  We aren&apos;t accepting submissions right now.{" "}
                  <Link href="/pitch" className="text-spark">
                    Read about FTG Ventures
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
