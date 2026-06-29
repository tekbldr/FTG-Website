import Link from "next/link";
import { TYPE_LABEL, type Insight } from "@/content/insights";

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function InsightCard({ item, featured }: { item: Insight; featured?: boolean }) {
  return (
    <Link
      href={`/insights/${item.slug}`}
      className="group block overflow-hidden rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] transition hover:border-[var(--line-2)]"
    >
      {/* engineered "cover" */}
      <div className={"relative grid-bg flex items-end border-b border-[var(--line)] p-4 " + (featured ? "h-52" : "h-32")}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(11,11,14,.55)]" />
        <div className="relative flex items-center gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[.18em] text-spark">{TYPE_LABEL[item.type]}</span>
          <span className="text-[var(--muted-2)]">·</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted)]">{item.vertical}</span>
        </div>
        {item.isNew && (
          <span className="absolute right-3 top-3 rounded-[2px] border border-spark px-2 py-[3px] font-mono text-[10px] uppercase tracking-[.14em] text-spark">
            New
          </span>
        )}
      </div>
      <div className="p-5">
        <h3
          className={
            "font-bold tracking-[-.01em] transition group-hover:text-spark " + (featured ? "text-2xl leading-[1.12]" : "text-[17px]")
          }
        >
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[14px] leading-[1.55] text-[var(--muted)]">{item.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[.1em] text-[var(--muted-2)]">
          <span>{item.author}</span>
          <span>·</span>
          <span>{fmtDate(item.date)}</span>
          <span>·</span>
          <span>{item.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
