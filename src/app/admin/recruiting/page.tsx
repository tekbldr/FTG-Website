import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyRoles, canCareers } from "@/lib/rbac";
import { StageMover } from "@/components/admin/StageMover";
import { FileLink } from "@/components/admin/FileLink";
import { moveApplicationStage } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Recruiting — FTG Admin" };

type Stage = { id: string; name: string; sort_order: number; stage_type: string };

function fmtDate(s: string | null): string {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default async function RecruitingBoard() {
  if (!canCareers(await getMyRoles())) redirect("/admin");
  const supabase = createClient();

  const [{ data: appsRaw }, { data: stagesRaw }] = await Promise.all([
    supabase
      .from("applications")
      .select("id,status,current_stage_id,applied_at,candidate_id,job_id")
      .order("applied_at", { ascending: false }),
    supabase.from("ats_stages").select("id,name,sort_order,stage_type").order("sort_order", { ascending: true }),
  ]);
  const apps = appsRaw ?? [];
  const stages = (stagesRaw ?? []) as Stage[];
  const firstStageId = stages[0]?.id;

  const candIds = [...new Set(apps.map((a) => a.candidate_id))];
  const jobIds = [...new Set(apps.map((a) => a.job_id))];
  const appIds = apps.map((a) => a.id);

  const [{ data: cands }, { data: jobs }, { data: atts }] = await Promise.all([
    candIds.length
      ? supabase.from("candidates").select("id,first_name,last_name,email").in("id", candIds)
      : Promise.resolve({ data: [] as any[] }),
    jobIds.length ? supabase.from("jobs").select("id,title,slug").in("id", jobIds) : Promise.resolve({ data: [] as any[] }),
    appIds.length
      ? supabase.from("attachments").select("id,application_id,file_name,scan_status,type").in("application_id", appIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const candById = new Map((cands ?? []).map((c: any) => [c.id, c]));
  const jobById = new Map((jobs ?? []).map((j: any) => [j.id, j]));
  const resumeByApp = new Map<string, any>();
  (atts ?? []).forEach((a: any) => {
    if (a.type === "resume" && !resumeByApp.has(a.application_id)) resumeByApp.set(a.application_id, a);
  });

  const byStage = new Map<string, typeof apps>();
  stages.forEach((s) => byStage.set(s.id, []));
  apps.forEach((a) => {
    const sid = a.current_stage_id ?? firstStageId;
    if (sid && byStage.has(sid)) byStage.get(sid)!.push(a);
  });

  return (
    <div>
      <div>
        <div>
          <header className="border-b border-[var(--line)] pb-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="eyebrow">Recruiting · Admin</div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-.02em]">Candidate pipeline</h1>
            </div>
            <span className="font-mono text-[12px] text-[var(--muted-2)]">
              {apps.length} {apps.length === 1 ? "application" : "applications"}
            </span>
          </header>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-4">
            {stages.map((stage) => {
              const list = byStage.get(stage.id) ?? [];
              return (
                <section key={stage.id} className="w-[280px] shrink-0">
                  <div className="flex items-center justify-between border-b border-[var(--line-2)] pb-2 mb-3">
                    <span className="font-mono text-[11px] uppercase tracking-[.14em] text-paper">{stage.name}</span>
                    <span className="font-mono text-[11px] text-[var(--muted-2)]">{list.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {list.map((app) => {
                      const c = candById.get(app.candidate_id);
                      const j = jobById.get(app.job_id);
                      const resume = resumeByApp.get(app.id);
                      const name = c ? `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() || c.email : "Candidate";
                      return (
                        <article key={app.id} className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-4">
                          <div className="text-[14px] font-bold leading-tight">{name}</div>
                          {j && (
                            <Link
                              href={`/careers/${j.slug}`}
                              className="mt-1 block font-mono text-[10.5px] uppercase tracking-[.12em] text-[var(--muted)] hover:text-spark"
                            >
                              {j.title}
                            </Link>
                          )}
                          <div className="mt-1 font-mono text-[10.5px] text-[var(--muted-2)]">
                            Applied {fmtDate(app.applied_at)}
                          </div>
                          <StageMover value={stage.id} stages={stages} action={moveApplicationStage.bind(null, app.id)} />
                          {resume && (
                            <div className="mt-2 flex items-center gap-2">
                              {resume.scan_status === "clean" ? (
                                <FileLink id={resume.id} scope="attachment" label="Résumé" />
                              ) : (
                                <span className="font-mono text-[10.5px] text-[var(--muted-2)]">
                                  Résumé · {resume.scan_status}
                                </span>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })}
                    {list.length === 0 && (
                      <p className="font-mono text-[11px] text-[var(--muted-2)] py-3 text-center">—</p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
