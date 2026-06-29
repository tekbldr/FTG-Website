"use client";

import { useMemo, useState } from "react";
import { InsightCard } from "./InsightCard";
import {
  INSIGHT_TYPES,
  INSIGHT_VERTICALS,
  type Insight,
  type InsightType,
  type InsightVertical,
} from "@/content/insights";

const PAGE = 9;

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "rounded-[2px] border px-3 py-[7px] font-mono text-[11px] uppercase tracking-[.12em] transition " +
        (active ? "border-spark text-spark" : "border-[var(--line-2)] text-[var(--muted)] hover:text-paper")
      }
    >
      {children}
    </button>
  );
}

export function InsightsFeed({ items }: { items: Insight[] }) {
  const [type, setType] = useState<InsightType | "all">("all");
  const [vertical, setVertical] = useState<InsightVertical | "all">("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [count, setCount] = useState(PAGE);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter(
      (it) =>
        (type === "all" || it.type === type) &&
        (vertical === "all" || it.vertical === vertical) &&
        (!query ||
          it.title.toLowerCase().includes(query) ||
          it.excerpt.toLowerCase().includes(query) ||
          (it.tags || []).some((t) => t.toLowerCase().includes(query)))
    );
  }, [items, type, vertical, q]);

  const shown = filtered.slice(0, count);
  const reset = () => setCount(PAGE);

  return (
    <section className="mt-14" id="feed" aria-label="All insights">
      {/* Type tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-5">
        <Pill active={type === "all"} onClick={() => { setType("all"); reset(); }}>All</Pill>
        {INSIGHT_TYPES.map((t) => (
          <Pill key={t.key} active={type === t.key} onClick={() => { setType(t.key); reset(); }}>
            {t.label}
          </Pill>
        ))}
      </div>

      {/* Topic + search + view */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[.18em] text-[var(--muted-2)]">Topic</span>
          <Pill active={vertical === "all"} onClick={() => { setVertical("all"); reset(); }}>All</Pill>
          {INSIGHT_VERTICALS.map((v) => (
            <Pill key={v} active={vertical === v} onClick={() => { setVertical(v); reset(); }}>
              {v}
            </Pill>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); reset(); }}
            placeholder="Search insights…"
            aria-label="Search insights"
            className="w-[200px] rounded-[2px] border border-[var(--line-2)] bg-[var(--ink-2)] px-3 py-[8px] text-[13px] text-paper placeholder:text-[var(--muted-2)] focus:border-spark focus:outline-none"
          />
          <div className="flex overflow-hidden rounded-[2px] border border-[var(--line-2)]">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                aria-label={`${v} view`}
                className={
                  "px-3 py-[7px] font-mono text-[10.5px] uppercase tracking-[.1em] transition " +
                  (view === v ? "bg-[var(--line)] text-paper" : "text-[var(--muted)] hover:text-paper")
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted-2)]">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-[var(--muted)]">Nothing matches those filters yet.</p>
      ) : view === "grid" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((it) => (
            <InsightCard key={it.slug} item={it} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {shown.map((it) => (
            <a key={it.slug} href={`/insights/${it.slug}`} className="group flex items-baseline gap-4 py-4 transition hover:bg-[var(--ink-2)]">
              <span className="w-[120px] shrink-0 font-mono text-[10.5px] uppercase tracking-[.14em] text-[var(--muted-2)]">
                {it.vertical}
              </span>
              <span className="flex-1">
                <span className="text-[15px] font-bold transition group-hover:text-spark">{it.title}</span>
                {it.isNew && <span className="ml-2 font-mono text-[10px] uppercase tracking-[.12em] text-spark">new</span>}
              </span>
              <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[.1em] text-[var(--muted-2)] sm:block">
                {it.readTime}
              </span>
            </a>
          ))}
        </div>
      )}

      {count < filtered.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setCount((c) => c + PAGE)}
            className="rounded-[2px] border border-[var(--line-2)] px-5 py-3 font-mono text-[12px] uppercase tracking-[.14em] text-paper transition hover:border-paper"
          >
            Load more
          </button>
        </div>
      )}
    </section>
  );
}
