import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Badge, LinkButton } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "My applications — First Tech Group" };

type Stage = { id: string; name: string; sort_order: number; stage_type: string };

function fmtDate(s: string | null): string {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function CandidatePortal() {
  const user = await requireUser();
  const supabase = createClient();

  const { data: cand } = await supabase
    .from("candidates")
    .select("id,first_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: appsRaw } = cand
    ? await supabase
        .from("applications")
        .select("id,job_id,status,current_stage_id,applied_at")
        .eq("candidate_id", cand.id)
        .order("applied_at", { ascending: false })
    : { data: [] };
  const apps = appsRaw ?? [];

  // Reference data: stages (RLS-readable to any authed user) + history (own rows).
  const { data: stagesRaw } = await supabase
    .from("ats_stages")
    .select("id,name,sort_order,stage_type")
    .order("sort_order", { ascending: true });
  const stages = (stagesRaw ?? []) as Stage[];
  const stageById = new Map(stages.map((s) => [s.id, s]));
  const trackStages = stages.filter((s) => s.stage_type !== "rejected");

  const appIds = apps.map((a) => a.id);
  const { data: historyRaw } = appIds.length
    ? await supabase
        .from("application_stage_history")
        .select("application_id,to_stage_id,changed_at,reason")
        .in("application_id", appIds)
        .order("changed_at", { ascending: true })
    : { data: [] };
  const history = historyRaw ?? [];

  // Job titles via service role so they show even if a role later closes.
  const jobIds = [...new Set(apps.map((a) => a.job_id))];
  const jobById = new Map<string, { title: string; slug: string }>();
  if (jobIds.length) {
    const admin = createAdminClient();
    const { data: jobs } = await admin.from("jobs").select("id,title,slug").in("id", jobIds);
    (jobs ?? []).forEach((j) => jobById.set(j.id as string, { title: j.title as string, slug: j.slug as string }));
  }

  return (
    <>
      <SiteHeader />
      <main className="pt-[112px] pb-24 min-h-screen">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <header className="border-b border-[var(--line)] pb-8">
            <div className="eyebrow">Candidate portal</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-[-.02em]">
              {cand?.first_name ? `Welcome, ${cand.first_name}.` : "My applications"}
            </h1>
            <p className="mt-3 text-[var(--muted)] text-[15px]">
              Track every application through the FTG hiring pipeline in real time.
            </p>
          </header>

          {apps.length === 0 ? (
            <div className="mt-8 rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-10 text-center">
              <p className="font-mono text-[12px] uppercase tracking-[.16em] text-[var(--muted-2)]">
                No applications yet
              </p>
              <p className="mt-3 text-[var(--muted)] text-[15px]">
                When you apply to a role, it&apos;ll appear here with a live status timeline.
              </p>
              <div className="mt-6">
                <LinkButton href="/careers" variant="spark">
                  Browse open roles →
                </LinkButton>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-4">
              {apps.map((app) => {
                const job = jobById.get(app.job_id);
                const current = app.current_stage_id ? stageById.get(app.current_stage_id) : undefined;
                const rejected = app.status === "rejected" || current?.stage_type === "rejected";
                const hired = app.status === "hired" || current?.stage_type === "hired";
                const currentIdx = current ? trackStages.findIndex((s) => s.id === current.id) : -1;
                const events = history.filter((h) => h.application_id === app.id);

                return (
                  <article key={app.id} className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {job ? (
                          <Link href={`/careers/${job.slug}`} className="text-xl font-bold hover:text-spark transition">
                            {job.title}
                          </Link>
                        ) : (
                          <span className="text-xl font-bold">Role</span>
                        )}
                        <div className="mt-1 font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted-2)]">
                          Applied {fmtDate(app.applied_at)}
                        </div>
                      </div>
                      <Badge tone={rejected ? "muted" : hired ? "ok" : "spark"}>
                        {rejected ? "Closed" : current?.name ?? "Applied"}
                      </Badge>
                    </div>

                    {/* Pipeline */}
                    {!rejected && (
                      <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
                        {trackStages.map((s, i) => {
                          const done = currentIdx >= 0 && i < currentIdx;
                          const isCurrent = current?.id === s.id;
                          return (
                            <li key={s.id} className="flex items-center gap-2">
                              <span
                                className={
                                  "font-mono text-[10.5px] uppercase tracking-[.1em] rounded-[2px] border px-2 py-[5px] " +
                                  (isCurrent
                                    ? "border-spark text-spark"
                                    : done
                                      ? "border-[var(--line-2)] text-[var(--muted)]"
                                      : "border-[var(--line)] text-[var(--muted-2)]")
                                }
                              >
                                {done ? "✓ " : ""}
                                {s.name}
                              </span>
                              {i < trackStages.length - 1 && (
                                <span className="text-[var(--muted-2)] text-[11px]">→</span>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    )}
                    {rejected && (
                      <p className="mt-4 text-[14px] text-[var(--muted)]">
                        This application isn&apos;t moving forward. Thank you for your interest — we&apos;d welcome a
                        future application.
                      </p>
                    )}

                    {/* Timeline */}
                    {events.length > 0 && (
                      <div className="mt-5 border-t border-[var(--line)] pt-4">
                        <ul className="flex flex-col gap-2">
                          {events.map((e, i) => (
                            <li key={i} className="flex gap-3 text-[13px]">
                              <span className="font-mono text-[11px] text-[var(--muted-2)] w-24 shrink-0 pt-[1px]">
                                {fmtDate(e.changed_at)}
                              </span>
                              <span className="text-[var(--muted)]">
                                {e.to_stage_id ? stageById.get(e.to_stage_id)?.name ?? "Updated" : "Updated"}
                                {e.reason ? ` — ${e.reason}` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
