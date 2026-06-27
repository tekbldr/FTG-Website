// Shared display helpers for careers + pitch surfaces.

export const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export const WORK_MODE_LABELS: Record<string, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

export const EMPLOYMENT_OPTIONS = Object.entries(EMPLOYMENT_LABELS).map(([value, label]) => ({ value, label }));
export const WORK_MODE_OPTIONS = Object.entries(WORK_MODE_LABELS).map(([value, label]) => ({ value, label }));

function k(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency: string | null = "USD"
): string | null {
  if (!min && !max) return null;
  const cur = currency || "USD";
  if (min && max) return `${cur} ${k(min)}–${k(max)}`;
  return `${cur} ${k((min || max) as number)}`;
}

// First value of a Next searchParams entry (string | string[] | undefined).
export function firstParam(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}
