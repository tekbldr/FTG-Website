import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { getMyRoles, canCareers, canPitch, canInsights, isSuperAdmin, ROLE_LABELS } from "@/lib/rbac";
import { insights } from "@/content/insights";

export const dynamic = "force-dynamic";
export const metadata = { title: "Operations — FTG Admin" };

async function count(table: string): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminOverview() {
  const [roles, profile] = await Promise.all([getMyRoles(), getProfile()]);
  const careers = canCareers(roles);
  const pitch = canPitch(roles);
  const ins = canInsights(roles);

  const [apps, subs] = await Promise.all([
    careers ? count("applications") : Promise.resolve(0),
    pitch ? count("submissions") : Promise.resolve(0),
  ]);

  const kpis: { label: string; value: string | number; href: string }[] = [];
  if (careers) kpis.push({ label: "Applications", value: apps, href: "/admin/recruiting" });
  if (pitch) kpis.push({ label: "Submissions", value: subs, href: "/admin/review" });
  if (ins) kpis.push({ label: "Insights pieces", value: insights.length, href: "/admin/insights" });

  const modules = [
    { show: careers, idx: "01", title: "Careers", body: "Move candidates through the hiring pipeline, scorecards, and stage history.", href: "/admin/recruiting" },
    { show: pitch, idx: "02", title: "Pitch", body: "Review submissions, rubric scoring, assignments, and funding decisions.", href: "/admin/review" },
    { show: ins, idx: "03", title: "Insights", body: "Write, review, and publish content across the editorial workflow.", href: "/admin/insights" },
    { show: isSuperAdmin(roles), idx: "04", title: "People & Roles", body: "Manage who has access and what they can do across the group.", href: "/admin/people" },
  ].filter((m) => m.show);

  return (
    <div>
      <header className="border-b border-[var(--line)] pb-7">
        <div className="eyebrow">Operations · {profile?.full_name ?? "FTG"}</div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-.02em] sm:text-4xl">The operating engine</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {roles.map((r) => (
            <span
              key={r}
              className="rounded-[2px] border border-[var(--line-2)] px-2 py-[5px] font-mono text-[10.5px] uppercase tracking-[.1em] text-[var(--muted)]"
            >
              {ROLE_LABELS[r]}
            </span>
          ))}
        </div>
      </header>

      {kpis.length > 0 && (
        <section className="mt-8 grid gap-px overflow-hidden rounded-[2px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
          {kpis.map((k) => (
            <Link key={k.label} href={k.href} className="bg-[var(--ink-2)] p-6 transition hover:bg-ink">
              <div className="font-mono text-[10.5px] uppercase tracking-[.18em] text-[var(--muted-2)]">{k.label}</div>
              <div className="mt-2 font-mono text-4xl font-bold tracking-[-.02em] text-paper">{k.value}</div>
            </Link>
          ))}
        </section>
      )}

      <section className="mt-8">
        <div className="idx mb-4">MODULES</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-6 transition hover:border-[var(--line-2)]"
            >
              <span className="idx">{m.idx}</span>
              <h2 className="mt-3 text-xl font-bold transition group-hover:text-spark">{m.title}</h2>
              <p className="mt-2 max-w-[42ch] text-[14px] text-[var(--muted)]">{m.body}</p>
              <span className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[.12em] text-spark">Open →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
