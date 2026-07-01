import Link from "next/link";
import Image from "next/image";
import { TYPE_LABEL, type Insight } from "@/content/insights";

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function InsightCard({ item, featured }: { item: Insight; featured?: boolean }) {
  return (
    <Link
      href={`/insights/${item.slug}`}
      aria-label={item.title}
      className="group block overflow-hidden rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] transition hover:border-[var(--line-2)]"
    >
      {/* branded cover */}
      <div className="relative aspect-[1200/630] overflow-hidden border-b border-[var(--line)]">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.015]"
          />
        ) : (
          <div className="grid-bg absolute inset-0 flex items-end p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] uppercase tracking-[.18em] text-spark">{TYPE_LABEL[item.type]}</span>
              <span className="text-[var(--muted-2)]">·</span>
              <span className="font-mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted)]">{item.vertical}</span>
            </div>
          </div>
        )}
        {item.isNew && (
          <span className="absolute right-3 top-3 rounded-[2px] border border-spark bg-[rgba(11,11,14,.72)] px-2 py-[3px] font-mono text-[10px] uppercase tracking-[.14em] text-spark backdrop-blur-sm">
            New
          </span>
        )}
      </div>

      <div className="p-5">
        {/* the title lives on the branded cover; keep it in the DOM for SEO + a11y */}
        <h3 className="sr-only">{item.title}</h3>
        <p className={"leading-[1.55] text-[var(--muted)] " + (featured ? "line-clamp-3 text-[15px]" : "line-clamp-2 text-[14px]")}>
          {item.excerpt}
        </p>
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
