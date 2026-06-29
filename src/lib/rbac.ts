import { createClient } from "@/lib/supabase/server";
import type { ModuleRole } from "@/lib/roles";

// Re-export the pure constants/types so server consumers can keep importing
// everything from "@/lib/rbac". Client components must import from "@/lib/roles".
export * from "@/lib/roles";

// The current user's module roles (from user_roles), bridged with the legacy
// profiles.role enum so existing admins/recruiters/reviewers keep working.
export async function getMyRoles(): Promise<ModuleRole[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const roles = new Set<ModuleRole>((data ?? []).map((r) => r.role as ModuleRole));

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const legacy = profile?.role as string | undefined;
  if (legacy === "admin") roles.add("super_admin");
  if (legacy === "recruiter") roles.add("careers_admin");
  if (legacy === "reviewer") roles.add("pitch_admin");

  return [...roles];
}

function can(r: ModuleRole[], ...allowed: ModuleRole[]) {
  return r.includes("super_admin") || allowed.some((x) => r.includes(x));
}

export const isSuperAdmin = (r: ModuleRole[]) => r.includes("super_admin");
export const canCareers = (r: ModuleRole[]) => can(r, "careers_admin", "careers_recruiter");
export const canPitch = (r: ModuleRole[]) => can(r, "pitch_admin", "pitch_reviewer");
export const canInsights = (r: ModuleRole[]) => can(r, "insights_admin", "insights_editor");
export const isStaff = (r: ModuleRole[]) => r.length > 0;
