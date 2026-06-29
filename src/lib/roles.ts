// Pure role constants/types — NO server imports, so client components can use these.
export type ModuleRole =
  | "super_admin"
  | "careers_admin"
  | "careers_recruiter"
  | "pitch_admin"
  | "pitch_reviewer"
  | "insights_admin"
  | "insights_editor";

export const ROLE_LABELS: Record<ModuleRole, string> = {
  super_admin: "Super admin",
  careers_admin: "Careers admin",
  careers_recruiter: "Recruiter",
  pitch_admin: "Pitch admin",
  pitch_reviewer: "Reviewer",
  insights_admin: "Insights admin",
  insights_editor: "Editor",
};

export const ROLE_GROUPS: { module: string; roles: ModuleRole[] }[] = [
  { module: "Group", roles: ["super_admin"] },
  { module: "Careers", roles: ["careers_admin", "careers_recruiter"] },
  { module: "Pitch", roles: ["pitch_admin", "pitch_reviewer"] },
  { module: "Insights", roles: ["insights_admin", "insights_editor"] },
];

export const ALL_ROLES = Object.keys(ROLE_LABELS) as ModuleRole[];

export type AdminModules = { careers: boolean; pitch: boolean; insights: boolean; people: boolean; audit: boolean };
