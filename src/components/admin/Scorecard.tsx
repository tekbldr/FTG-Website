"use client";

import { useMemo, useState, useTransition } from "react";
import { saveReview } from "@/lib/actions/admin";
import { Button, Textarea } from "@/components/ui";

type Criterion = { id: string; name: string; description: string | null; max_score: number; weight: number };
type Rec = "fund" | "discuss" | "decline";

export function Scorecard({
  submissionId,
  criteria,
  initial,
}: {
  submissionId: string;
  criteria: Criterion[];
  initial: { recommendation: Rec | null; comments: string; scores: Record<string, number> };
}) {
  const [scores, setScores] = useState<Record<string, number>>(initial.scores);
  const [rec, setRec] = useState<string>(initial.recommendation ?? "");
  const [comments, setComments] = useState(initial.comments);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const overall = useMemo(() => {
    const totalW = criteria.reduce((a, c) => a + Number(c.weight), 0);
    if (!totalW) return 0;
    return criteria.reduce((a, c) => a + (scores[c.id] ?? 0) * Number(c.weight), 0) / totalW;
  }, [criteria, scores]);

  function setScore(id: string, max: number, raw: string) {
    let n = Number(raw);
    if (Number.isNaN(n)) n = 0;
    n = Math.max(0, Math.min(max, n));
    setScores((p) => ({ ...p, [id]: n }));
    setSaved(false);
  }

  function save() {
    setSaved(false);
    start(async () => {
      const res = await saveReview({
        submissionId,
        overall: Number(overall.toFixed(2)),
        recommendation: (rec || null) as Rec | null,
        comments,
        scores: criteria.map((c) => ({ criterionId: c.id, score: scores[c.id] ?? 0 })),
      });
      if (res?.ok) setSaved(true);
    });
  }

  return (
    <div className="mt-4 border-t border-[var(--line)] pt-4">
      <div className="grid gap-2">
        {criteria.map((c) => (
          <label key={c.id} className="flex items-center justify-between gap-4">
            <span className="text-[13px]">
              <span className="text-paper">{c.name}</span>
              {c.description && <span className="block text-[11px] text-[var(--muted-2)]">{c.description}</span>}
            </span>
            <input
              type="number"
              min={0}
              max={c.max_score}
              value={scores[c.id] ?? ""}
              onChange={(e) => setScore(c.id, c.max_score, e.target.value)}
              className="w-16 bg-ink border border-[var(--line-2)] rounded-[2px] px-2 py-[6px] text-[14px] text-paper text-center focus:border-spark focus:outline-none"
              aria-label={`${c.name} score out of ${c.max_score}`}
            />
          </label>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted)]">Weighted score</span>
        <span className="font-mono text-[15px] font-bold text-spark">{overall.toFixed(1)} / 10</span>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="flex gap-2">
          {(["fund", "discuss", "decline"] as Rec[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRec(r);
                setSaved(false);
              }}
              className={
                "font-mono text-[11px] uppercase tracking-[.1em] rounded-[2px] border px-3 py-[7px] transition " +
                (rec === r ? "border-spark text-spark" : "border-[var(--line-2)] text-[var(--muted)] hover:text-paper")
              }
            >
              {r}
            </button>
          ))}
        </div>
        <Textarea
          rows={2}
          value={comments}
          onChange={(e) => {
            setComments(e.target.value);
            setSaved(false);
          }}
          placeholder="Notes for the committee…"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Button type="button" variant="spark" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save scorecard"}
        </Button>
        {saved && <span className="font-mono text-[11px] text-[#7fdca0]">Saved ✓</span>}
      </div>
    </div>
  );
}
