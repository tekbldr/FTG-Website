"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMyRoles, isSuperAdmin, type ModuleRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

// Grant/revoke module roles — super-admin only. Writes go through the
// service-role client (user_roles RLS already restricts to admins, but the
// action enforces super_admin explicitly).
export async function grantRole(userId: string, role: ModuleRole) {
  if (!isSuperAdmin(await getMyRoles())) return { ok: false, error: "Not authorized." };
  const {
    data: { user },
  } = await createClient().auth.getUser();
  const admin = createAdminClient();
  await admin.from("user_roles").upsert({ user_id: userId, role, granted_by: user?.id ?? null }, { onConflict: "user_id,role" });
  await logAudit({ action: "role.grant", entityType: "user_role", entityId: userId, summary: `Granted ${role}`, meta: { role } });
  revalidatePath("/admin/people");
  return { ok: true };
}

export async function revokeRole(userId: string, role: ModuleRole) {
  if (!isSuperAdmin(await getMyRoles())) return { ok: false, error: "Not authorized." };
  const admin = createAdminClient();
  await admin.from("user_roles").delete().eq("user_id", userId).eq("role", role);
  await logAudit({ action: "role.revoke", entityType: "user_role", entityId: userId, summary: `Revoked ${role}`, meta: { role } });
  revalidatePath("/admin/people");
  return { ok: true };
}
