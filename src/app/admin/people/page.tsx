import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyRoles, isSuperAdmin, type ModuleRole } from "@/lib/rbac";
import { UserRoles } from "@/components/admin/UserRoles";
import { AdminPageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "People & Roles — FTG Admin" };

export default async function PeoplePage() {
  if (!isSuperAdmin(await getMyRoles())) redirect("/admin");

  const supabase = createClient();
  const [{ data: profiles }, { data: ur }] = await Promise.all([
    supabase.from("profiles").select("id,email,full_name,role").order("email"),
    supabase.from("user_roles").select("user_id,role"),
  ]);

  const byUser = new Map<string, ModuleRole[]>();
  (ur ?? []).forEach((r) => {
    const arr = byUser.get(r.user_id as string) ?? [];
    arr.push(r.role as ModuleRole);
    byUser.set(r.user_id as string, arr);
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="People &amp; Roles"
        title="Who can do what"
        description="Grant module roles. A person can hold several; a super admin can do everything across the group."
        actions={
          <span className="font-mono text-[12px] text-[var(--muted-2)]">
            {(profiles ?? []).length} {(profiles ?? []).length === 1 ? "person" : "people"}
          </span>
        }
      />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-[var(--line)] font-mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted-2)]">
              <th className="py-3 pr-4 font-normal">Person</th>
              <th className="py-3 font-normal">Roles</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => (
              <tr key={p.id as string} className="border-b border-[var(--line)] align-top">
                <td className="py-4 pr-6">
                  <div className="text-[14px] font-bold">{(p.full_name as string) || "—"}</div>
                  <div className="font-mono text-[11px] text-[var(--muted-2)]">
                    {p.email as string}
                    {p.role === "admin" ? " · legacy admin" : ""}
                  </div>
                </td>
                <td className="py-4">
                  <UserRoles userId={p.id as string} initial={byUser.get(p.id as string) ?? []} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
