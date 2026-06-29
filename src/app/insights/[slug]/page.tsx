import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LinkButton } from "@/components/ui";
import { TYPE_LABEL, TYPE_CTA } from "@/content/insights";
import { getPublishedPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getPublishedPostBySlug(params.slug);
  if (!item) return { title: "Insights — First Tech Group" };
  return { title: `${item.title} — FTG Insights`, description: item.excerpt };
}

export default async function InsightDetail({ params }: { params: { slug: string } }) {
  const item = await getPublishedPostBySlug(params.slug);
  if (!item) notFound();

  return (
    <>
      <SiteHeader />
      <main className="pt-[100px] pb-24 min-h-screen">
        <article className="mx-auto max-w-[760px] px-5 sm:px-8">
          <Link
            href="/insights"
            className="font-mono text-[12px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-paper"
          >
            ← Insights
          </Link>

          <div className="mt-6 flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[.18em] text-spark">{TYPE_LABEL[item.type]}</span>
            <span className="text-[var(--muted-2)]">·</span>
            <span className="font-mono text-[11px] uppercase tracking-[.16em] text-[var(--muted)]">{item.vertical}</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-[1.06] tracking-[-.02em] sm:text-5xl">{item.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[.1em] text-[var(--muted-2)]">
            <span>{item.author}</span>
            <span>·</span>
            <span>{fmtDate(item.date)}</span>
            {item.readTime ? (
              <>
                <span>·</span>
                <span>{item.readTime}</span>
              </>
            ) : null}
          </div>

          <div className="grid-bg mt-8 h-48 rounded-[2px] border border-[var(--line)]" />

          <p className="mt-8 text-lg leading-[1.6] text-paper/90">{item.excerpt}</p>

          {item.body ? (
            <div className="mt-6 whitespace-pre-line text-[15.5px] leading-[1.75] text-[var(--muted)]">{item.body}</div>
          ) : (
            <p className="mt-6 text-[15px] text-[var(--muted)]">
              The full {TYPE_CTA[item.type].toLowerCase()} is coming soon.
            </p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-[2px] border border-[var(--line-2)] px-2 py-[5px] font-mono text-[10.5px] uppercase tracking-[.1em] text-[var(--muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 border-t border-[var(--line)] pt-8">
            <LinkButton href="/insights" variant="ghost">
              ← Back to Insights
            </LinkButton>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
