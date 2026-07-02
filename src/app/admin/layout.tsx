import { redirect } from "next/navigation";
import { requireUser, getProfile } from "@/lib/auth";
import { getMyRoles, isStaff, canCareers, canPitch, canInsights, isSuperAdmin } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const roles = await getMyRoles();
  if (!isStaff(roles)) redirect("/portal");
  const profile = await getProfile();

  return (
    <AdminShell
      user={{ email: profile?.email, name: profile?.full_name }}
      modules={{
        careers: canCareers(roles),
        pitch: canPitch(roles),
        insights: canInsights(roles),
        people: isSuperAdmin(roles),
        audit: isSuperAdmin(roles),
      }}
    >
      {children}
    </AdminShell>
  );
}
