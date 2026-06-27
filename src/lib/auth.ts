import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "member" | "recruiter" | "reviewer" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
};

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .single();
  return (data as Profile) ?? null;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

const RANK: Record<AppRole, number> = { member: 0, reviewer: 1, recruiter: 1, admin: 2 };

// Gate staff areas. recruiter → careers admin, reviewer → pitch review, admin → both.
export async function requireRole(...allowed: AppRole[]) {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const ok = allowed.includes(profile.role) || profile.role === "admin";
  if (!ok) redirect("/portal");
  return profile;
}
