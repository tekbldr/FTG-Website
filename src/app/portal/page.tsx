import Link from "next/link";
import { requireUser, getProfile } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your portal — First Tech Group" };

export default async function PortalHub() {
  await requireUser();
  const profile = await getProfile();
  const isStaff = profile?.role === "recruiter" || profile?.role === "reviewer" || profile?.role === "admin";

  return (
    <>
      <SiteHeader />
      <main className="pt-[112px] pb-24 min-h-screen">
        <div className="mx-auto max-w-[960px] px-5 sm:px-8">
          <header className="border-b border-[var(--line)] pb-8">
            <div className="eyebrow">Your portal</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-[-.02em]">
              {profile?.full_name ? profile.full_name : "Welcome"}
            </h1>
            <p className="mt-3 text-[var(--muted)] text-[15px]">Pick up where you left off.</p>
          </header>

          <div className="mt-8 grid sm:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[2px] overflow-hidden">
            <Card href="/portal/candidate" idx="01" title="My applications" body="Track your job applications through the FTG hiring pipeline." />
            <Card href="/portal/founder" idx="02" title="My submissions" body="Track the companies you've pitched to FTG Ventures." />
          </div>

          {isStaff && (
            <div className="mt-6 flex flex-wrap gap-3">
              {(profile?.role === "recruiter" || profile?.role === "admin") && (
                <Link href="/admin/recruiting" className="btn">
                  Recruiting admin →
                </Link>
              )}
              {(profile?.role === "reviewer" || profile?.role === "admin") && (
                <Link href="/admin/review" className="btn">
                  Review admin →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Card({ href, idx, title, body }: { href: string; idx: string; title: string; body: string }) {
  return (
    <Link href={href} className="bg-ink hover:bg-[var(--ink-2)] transition p-8 min-h-[180px] flex flex-col">
      <span className="idx">{idx}</span>
      <h2 className="mt-3 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-[var(--muted)] text-[14px] max-w-[40ch]">{body}</p>
      <span className="mt-auto pt-5 font-mono text-[12px] uppercase tracking-[.12em] text-spark">Open →</span>
    </Link>
  );
}
