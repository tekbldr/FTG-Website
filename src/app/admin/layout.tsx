import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getMyRoles, isStaff, canCareers, canPitch, canInsights, isSuperAdmin } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const roles = await getMyRoles();
  if (!isStaff(roles)) redirect("/portal");

  return (
    <AdminShell
      modules={{
        careers: canCareers(roles),
        pitch: canPitch(roles),
        insights: canInsights(roles),
        people: isSuperAdmin(roles),
      }}
    >
      {children}
    </AdminShell>
  );
}
