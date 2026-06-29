import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyRoles, canPitch, isSuperAdmin } from "@/lib/rbac";
import { Badge } from "@/components/ui";
import { StageMover } from "@/components/admin/StageMover";
import { FileLink } from "@/components/admin/FileLink";
import { Scorecard } from "@/components/admin/Scorecard";
import { DecisionControl } from "@/components/admin/DecisionControl";
import { moveSubmissionStage } from "@/lib/actions/admin";
import { DOC_LABELS, type DocType } from "@/lib/pitch";

export const dynamic = "force-dynamic";
export const metadata = { title: "Deal review — FTG Admin" };

type Stage = { id: string; name: string; sort_order: number; stage_type: string };
type Criterion = { id: string; name: string; description: string | null; max_score: number; weight: number };

export default async function ReviewBoard() {
  const roles = await getMyRoles();
  if (!canPitch(roles)) redirect("/admin");
  const isAdmin = isSuperAdmin(roles) || roles.includes("pitch_admin");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: subsRaw }, { data: stagesRaw }, { data: critRaw }] = await Promise.all([
    supabase
      .from("submissions")
      .select("id,company_name,one_liner,sector,stage_of_company,amount_requested,currency,current_stage_id,status,founder_id,details")
      .order("submitted_at", { ascending: false }),
    supabase.from("pitch_stages").select("id,name,sort_order,stage_type").order("sort_order", { ascending: true }),
    supabase.from("rubric_criteria").select("id,name,description,max_score,weight,sort_order").order("sort_order", { ascending: true }),
  ]);
  const subs = subsRaw ?? [];
  const stages = (stagesRaw ?? []) as Stage[];
  const criteria = (critRaw ?? []) as Criterion[];

  const founderIds = [...new Set(subs.map((s) => s.founder_id))];
  const subIds = subs.map((s) => s.id);

  const [{ data: founders }, { data: docs }, { data: myReviews }] = await Promise.all([
    founderIds.length
      ? supabase.from("founders").select("id,name,organization").in("id", founderIds)
      : Promise.resolve({ data: [] as any[] }),
    subIds.length
      ? supabase.from("documents").select("id,submission_id,type,file_name,scan_status").in("submission_id", subIds)
      : Promise.resolve({ data: [] as any[] }),
    subIds.length
      ? supabase.from("reviews").select("id,submission_id,recommendation,comments").eq("reviewer_id", user?.id ?? "")
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const reviewIds = (myReviews ?? []).map((r: any) => r.id);
  const { data: myScores } = reviewIds.length
    ? await supabase.from("review_scores").select("review_id,criterion_id,score").in("review_id", reviewIds)
    : { data: [] as any[] };

  const founderById = new Map((founders ?? []).map((f: any) => [f.id, f]));
  const docsBySub = new Map<string, any[]>();
  (docs ?? []).forEach((d: any) => {
    if (!docsBySub.has(d.submission_id)) docsBySub.set(d.submission_id, []);
    docsBySub.get(d.submission_id)!.push(d);
  });
  const reviewBySub = new Map((myReviews ?? []).map((r: any) => [r.submission_id, r]));
  const scoresByReview = new Map<string, Record<string, number>>();
  (myScores ?? []).forEach((s: any) => {
    if (!scoresByReview.has(s.review_id)) scoresByReview.set(s.review_id, {});
    scoresByReview.get(s.review_id)![s.criterion_id] = Number(s.score);
  });

  const byStage = new Map<string, typeof subs>();
  stages.forEach((s) => byStage.set(s.id, []));
  const firstStageId = stages[0]?.id;
  subs.forEach((s) => {
    const sid = s.current_stage_id ?? firstStageId;
    if (sid && byStage.has(sid)) byStage.get(sid)!.push(s);
  });

  return (
    <div>
      <div className="mx-auto max-w-[960px]">
          <header className="border-b border-[var(--line)] pb-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="eyebrow">Deal review · {isAdmin ? "Admin" : "Reviewer"}</div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-.02em]">Pitch pipeline</h1>
            </div>
            <span className="font-mono text-[12px] text-[var(--muted-2)]">
              {subs.length} {subs.length === 1 ? "submission" : "submissions"}
            </span>
          </header>

          {subs.length === 0 && (
            <p className="mt-10 text-center text-[var(--muted)] text-[15px]">
              No submissions {isAdmin ? "yet" : "assigned to you yet"}.
            </p>
          )}

          {stages.map((stage) => {
            const list = byStage.get(stage.id) ?? [];
            if (list.length === 0) return null;
            return (
              <section key={stage.id} className="mt-9">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[11px] uppercase tracking-[.16em] text-spark">{stage.name}</span>
                  <span className="h-px flex-1 bg-[var(--line)]" />
                  <span className="font-mono text-[11px] text-[var(--muted-2)]">{list.length}</span>
                </div>

                <div className="flex flex-col gap-3">
                  {list.map((sub) => {
                    const founder = founderById.get(sub.founder_id);
                    const subDocs = docsBySub.get(sub.id) ?? [];
                    const review = reviewBySub.get(sub.id);
                    const scores = review ? scoresByReview.get(review.id) ?? {} : {};
                    const details = (sub.details ?? {}) as { traction?: string; whyNow?: string };
                    const amount =
                      sub.amount_requested != null
                        ? `${sub.currency || "USD"} ${Number(sub.amount_requested).toLocaleString()}`
                        : null;

                    return (
                      <article key={sub.id} className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h2 className="text-xl font-bold">{sub.company_name ?? "Submission"}</h2>
                            {sub.one_liner && <p className="mt-1 text-[var(--muted)] text-[14px]">{sub.one_liner}</p>}
                            <div className="mt-2 flex flex-wrap gap-2">
                              {sub.sector && <Badge>{sub.sector}</Badge>}
                              {sub.stage_of_company && <Badge>{sub.stage_of_company}</Badge>}
                              {amount && <Badge tone="spark">{amount}</Badge>}
                              {founder?.name && (
                                <span className="font-mono text-[11px] uppercase tracking-[.12em] text-[var(--muted-2)] self-center">
                                  {founder.name}
                                </span>
                              )}
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="w-[150px] shrink-0">
                              <StageMover value={stage.id} stages={stages} action={moveSubmissionStage.bind(null, sub.id)} />
                            </div>
                          )}
                        </div>

                        {(details.traction || details.whyNow) && (
                          <div className="mt-4 grid sm:grid-cols-2 gap-4">
                            {details.traction && (
                              <Detail k="Traction" v={details.traction} />
                            )}
                            {details.whyNow && <Detail k="Why now" v={details.whyNow} />}
                          </div>
                        )}

                        {subDocs.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-4">
                            {subDocs.map((d) =>
                              d.scan_status === "clean" ? (
                                <FileLink key={d.id} id={d.id} scope="document" label={DOC_LABELS[d.type as DocType] ?? d.type} />
                              ) : (
                                <span key={d.id} className="font-mono text-[11px] text-[var(--muted-2)]">
                                  {DOC_LABELS[d.type as DocType] ?? d.type} · {d.scan_status}
                                </span>
                              )
                            )}
                          </div>
                        )}

                        <Scorecard
                          submissionId={sub.id}
                          criteria={criteria}
                          initial={{
                            recommendation: (review?.recommendation as "fund" | "discuss" | "decline" | null) ?? null,
                            comments: review?.comments ?? "",
                            scores,
                          }}
                        />

                        {isAdmin && <DecisionControl submissionId={sub.id} />}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted-2)]">{k}</div>
      <p className="mt-1 text-[13.5px] text-[var(--muted)] leading-[1.5]">{v}</p>
    </div>
  );
}
