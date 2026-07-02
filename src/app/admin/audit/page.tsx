import { redirect } from "next/navigation";
import { getMyRoles, isSuperAdmin } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audit — FTG Admin" };

type AuditRow = {
  id: string;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  summary: string | null;
  created_at: string;
};

function fmt(s: string): string {
  return new Date(s).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ACTION_TONE: Record<string, string> = {
  "role.grant": "text-spark",
  "post.status": "text-spark",
  "submission.decision": "text-spark",
};

export default async function AuditPage() {
  if (!isSuperAdmin(await getMyRoles())) redirect("/admin");

  const sb = createClient();
  const { data } = await sb
    .from("audit_log")
    .select("id,actor_email,action,entity_type,entity_id,summary,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data as AuditRow[]) ?? [];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Audit"
        title="Activity log"
        description="Every privileged action across the group — role changes, stage moves, decisions, and publishing. Most recent first."
        actions={<span className="font-mono text-[12px] text-[var(--muted-2)]">last {rows.length} events</span>}
      />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-[var(--line)] font-mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted-2)]">
              <th className="py-3 pr-4 font-normal">When</th>
              <th className="py-3 pr-4 font-normal">Who</th>
              <th className="py-3 pr-4 font-normal">Action</th>
              <th className="py-3 font-normal">Detail</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[var(--line)]">
                <td className="whitespace-nowrap py-3 pr-4 font-mono text-[11px] text-[var(--muted-2)]">
                  {fmt(r.created_at)}
                </td>
                <td className="py-3 pr-4 font-mono text-[11px] text-[var(--muted)]">{r.actor_email ?? "—"}</td>
                <td className="py-3 pr-4">
                  <span className={"font-mono text-[11px] uppercase tracking-[.08em] " + (ACTION_TONE[r.action] ?? "text-[var(--muted)]")}>
                    {r.action}
                  </span>
                </td>
                <td className="py-3 text-[13px] text-[var(--muted)]">{r.summary ?? r.entity_type ?? ""}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-[var(--muted-2)]">
                  No activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
