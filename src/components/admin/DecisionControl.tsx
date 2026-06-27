"use client";

import { useState, useTransition } from "react";
import { recordDecision } from "@/lib/actions/admin";

type Decision = "funded" | "declined" | "waitlisted";

export function DecisionControl({ submissionId }: { submissionId: string }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState<string | null>(null);

  function decide(decision: Decision) {
    start(async () => {
      const r = await recordDecision({ submissionId, decision });
      if (r?.ok) setDone(decision);
    });
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted-2)]">Decision</span>
      {(["funded", "declined", "waitlisted"] as Decision[]).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => decide(d)}
          disabled={pending}
          className="font-mono text-[11px] uppercase tracking-[.1em] rounded-[2px] border border-[var(--line-2)] text-[var(--muted)] hover:text-paper hover:border-paper px-3 py-[6px] disabled:opacity-50"
        >
          {d}
        </button>
      ))}
      {done && <span className="font-mono text-[11px] text-[#7fdca0]">Recorded: {done} ✓</span>}
    </div>
  );
}
