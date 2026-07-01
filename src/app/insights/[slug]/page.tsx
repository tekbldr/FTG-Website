import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LinkButton } from "@/components/ui";
import { Prose } from "@/components/insights/Prose";
import { TYPE_LABEL, TYPE_CTA } from "@/content/insights";
import { getPublishedPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

const SITE = "https://www.ftg.vc";

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getPublishedPostBySlug(params.slug);
  if (!item) return { title: "Insights — First Tech Group" };
  const url = `${SITE}/insights/${item.slug}`;
  const images = item.cover ? [{ url: item.cover, width: 1200, height: 630, alt: item.title }] : ["/og.png?v=2"];
  return {
    title: `${item.title} — FTG Insights`,
    description: item.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url,
      siteName: "First Tech Group",
      type: "article",
      publishedTime: item.date,
      authors: [item.author],
      tags: item.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt,
      images: item.cover ? [item.cover] : ["/og.png?v=2"],
    },
  };
}

export default async function InsightDetail({ params }: { params: { slug: string } }) {
  const item = await getPublishedPostBySlug(params.slug);
  if (!item) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": item.type === "news" ? "NewsArticle" : "Article",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    dateModified: item.date,
    author: { "@type": "Organization", name: item.author, url: SITE },
    publisher: {
      "@type": "Organization",
      name: "First Tech Group",
      logo: { "@type": "ImageObject", url: `${SITE}/ftg-mark.png` },
    },
    image: item.cover ? `${SITE}${item.cover}` : `${SITE}/og.png`,
    mainEntityOfPage: `${SITE}/insights/${item.slug}`,
    articleSection: item.vertical,
    ...(item.tags && item.tags.length ? { keywords: item.tags.join(", ") } : {}),
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen pb-24 pt-[100px]">
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

          <h1 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-.02em] sm:text-[2.9rem]" style={{ textWrap: "balance" }}>
            {item.title}
          </h1>

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

          {item.cover ? (
            <div className="mt-8 overflow-hidden rounded-[3px] border border-[var(--line)]">
              <Image src={item.cover} alt={item.title} width={1200} height={630} priority className="h-auto w-full" />
            </div>
          ) : (
            <div className="grid-bg mt-8 h-48 rounded-[2px] border border-[var(--line)]" />
          )}

          <p className="mt-9 text-xl leading-[1.55] text-paper/90" style={{ textWrap: "pretty" }}>
            {item.excerpt}
          </p>

          {item.body ? (
            <div className="mt-3">
              <Prose content={item.body} />
            </div>
          ) : (
            <p className="mt-6 text-[15px] text-[var(--muted)]">
              The full {TYPE_CTA[item.type].toLowerCase()} is coming soon.
            </p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
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
