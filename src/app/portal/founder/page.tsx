import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Badge, LinkButton } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "My submissions — FTG Ventures" };

type Stage = { id: string; name: string; sort_order: number; stage_type: string };

function fmtDate(s: string | null): string {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function FounderPortal() {
  const user = await requireUser();
  const supabase = createClient();

  const { data: founder } = await supabase
    .from("founders")
    .select("id,name")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: subsRaw } = founder
    ? await supabase
        .from("submissions")
        .select("id,company_name,one_liner,status,current_stage_id,submitted_at,sector,amount_requested,currency")
        .eq("founder_id", founder.id)
        .order("submitted_at", { ascending: false })
    : { data: [] };
  const subs = subsRaw ?? [];

  const { data: stagesRaw } = await supabase
    .from("pitch_stages")
    .select("id,name,sort_order,stage_type")
    .order("sort_order", { ascending: true });
  const stages = (stagesRaw ?? []) as Stage[];
  const stageById = new Map(stages.map((s) => [s.id, s]));
  const trackStages = stages.filter((s) => s.stage_type !== "declined");

  const subIds = subs.map((s) => s.id);
  const { data: historyRaw } = subIds.length
    ? await supabase
        .from("submission_stage_history")
        .select("submission_id,to_stage_id,changed_at,reason")
        .in("submission_id", subIds)
        .order("changed_at", { ascending: true })
    : { data: [] };
  const history = historyRaw ?? [];

  return (
    <>
      <SiteHeader />
      <main className="pt-[112px] pb-24 min-h-screen">
        <div className="mx-auto max-w-[860px] px-5 sm:px-8">
          <header className="border-b border-[var(--line)] pb-8 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="eyebrow">Founder portal</div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-[-.02em]">
                {founder?.name ? `Welcome, ${founder.name.split(" ")[0]}.` : "My submissions"}
              </h1>
              <p className="mt-3 text-[var(--muted)] text-[15px]">
                Track your company through the FTG Ventures review pipeline.
              </p>
            </div>
            <LinkButton href="/portal/founder/new" variant="spark">
              New submission →
            </LinkButton>
          </header>

          {subs.length === 0 ? (
            <div className="mt-8 rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-10 text-center">
              <p className="font-mono text-[12px] uppercase tracking-[.16em] text-[var(--muted-2)]">
                No submissions yet
              </p>
              <p className="mt-3 text-[var(--muted)] text-[15px]">
                Pitch your company and track it through diligence, here, in real time.
              </p>
              <div className="mt-6">
                <LinkButton href="/portal/founder/new" variant="spark">
                  Submit your company →
                </LinkButton>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-4">
              {subs.map((sub) => {
                const current = sub.current_stage_id ? stageById.get(sub.current_stage_id) : undefined;
                const declined = sub.status === "declined" || current?.stage_type === "declined";
                const funded = sub.status === "funded" || current?.stage_type === "funded";
                const currentIdx = current ? trackStages.findIndex((s) => s.id === current.id) : -1;
                const events = history.filter((h) => h.submission_id === sub.id);
                const amount =
                  sub.amount_requested != null
                    ? `${sub.currency || "USD"} ${Number(sub.amount_requested).toLocaleString()}`
                    : null;

                return (
                  <article key={sub.id} className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold">{sub.company_name ?? "Submission"}</h2>
                        {sub.one_liner && (
                          <p className="mt-1 text-[var(--muted)] text-[14px] max-w-[60ch]">{sub.one_liner}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sub.sector && <Badge>{sub.sector}</Badge>}
                          {amount && <Badge>{amount}</Badge>}
                          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted-2)] self-center">
                            Submitted {fmtDate(sub.submitted_at)}
                          </span>
                        </div>
                      </div>
                      <Badge tone={declined ? "muted" : funded ? "ok" : "spark"}>
                        {declined ? "Declined" : current?.name ?? "Submitted"}
                      </Badge>
                    </div>

                    {!declined && (
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
                    {declined && (
                      <p className="mt-4 text-[14px] text-[var(--muted)]">
                        This submission isn&apos;t moving forward right now. Thank you — we&apos;d welcome a future pitch.
                      </p>
                    )}

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
