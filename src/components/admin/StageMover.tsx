"use client";

import { useTransition } from "react";

type Stage = { id: string; name: string };

// Compact stage selector used on admin Kanban cards. Calls a server action that
// updates the row + appends history + revalidates, so the card re-flows columns.
export function StageMover({
  value,
  stages,
  action,
}: {
  value: string;
  stages: Stage[];
  action: (toStageId: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, start] = useTransition();
  return (
    <select
      value={value}
      disabled={pending}
      aria-label="Move to stage"
      onChange={(e) => {
        const v = e.target.value;
        start(() => {
          void action(v);
        });
      }}
      className="mt-3 w-full bg-ink border border-[var(--line-2)] rounded-[2px] px-2 py-[7px] font-mono text-[11px] uppercase tracking-[.1em] text-paper focus:border-spark focus:outline-none disabled:opacity-50"
    >
      {stages.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
