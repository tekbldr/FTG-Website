import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { getMyRoles, canCareers, canPitch, canInsights, isSuperAdmin, ROLE_LABELS } from "@/lib/rbac";
import { AdminPageHeader, StatGrid, StatCard, RoleChips } from "@/components/admin/ui";
import { getAllPosts } from "@/lib/posts";

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

  const [apps, subs, jobs, posts] = await Promise.all([
    careers ? count("applications") : Promise.resolve(0),
    pitch ? count("submissions") : Promise.resolve(0),
    careers ? count("jobs") : Promise.resolve(0),
    ins ? getAllPosts().then((p) => p.length).catch(() => 0) : Promise.resolve(0),
  ]);

  const kpis: { label: string; value: string | number; hint?: string; href: string }[] = [];
  if (careers) kpis.push({ label: "Applications", value: apps, hint: `${jobs} open roles`, href: "/admin/recruiting" });
  if (pitch) kpis.push({ label: "Submissions", value: subs, hint: "Pitch pipeline", href: "/admin/review" });
  if (ins) kpis.push({ label: "Insights pieces", value: posts, hint: "Editorial CMS", href: "/admin/insights" });

  const modules = [
    { show: careers, idx: "01", title: "Careers", body: "Move candidates through the hiring pipeline, scorecards, and stage history.", href: "/admin/recruiting" },
    { show: pitch, idx: "02", title: "Pitch", body: "Review submissions, rubric scoring, assignments, and funding decisions.", href: "/admin/review" },
    { show: ins, idx: "03", title: "Insights", body: "Write, review, and publish content across the editorial workflow.", href: "/admin/insights" },
    { show: isSuperAdmin(roles), idx: "04", title: "People & Roles", body: "Manage who has access and what they can do across the group.", href: "/admin/people" },
  ].filter((m) => m.show);

  return (
    <div>
      <AdminPageHeader
        eyebrow={`Operations · ${profile?.full_name ?? "FTG"}`}
        title="The operating engine"
        description="One console for the whole platform — hiring, deal review, editorial, access, and the audit trail."
        meta={<RoleChips labels={roles.map((r) => ROLE_LABELS[r])} />}
      />

      {kpis.length > 0 && (
        <StatGrid>
          {kpis.map((k) => (
            <StatCard key={k.label} label={k.label} value={k.value} hint={k.hint} href={k.href} />
          ))}
        </StatGrid>
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
