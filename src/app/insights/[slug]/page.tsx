import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LinkButton } from "@/components/ui";
import { Prose, headingSlug } from "@/components/insights/Prose";
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
    keywords: item.tags,
    authors: [{ name: item.author }],
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url,
      siteName: "First Tech Group",
      type: "article",
      publishedTime: item.date,
      modifiedTime: item.date,
      authors: [item.author],
      section: item.vertical,
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

  const body = item.body ?? "";
  const headings = body
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const t = l.slice(3).replace(/\*\*|`/g, "").trim();
      return { text: t, id: headingSlug(t) };
    });
  const showToc = headings.length >= 4;
  const wordCount = body ? body.trim().split(/\s+/).length : undefined;
  const mins = parseInt((item.readTime || "").match(/\d+/)?.[0] || "0", 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": item.type === "news" ? "NewsArticle" : item.type === "research" ? "Report" : "Article",
    headline: item.title,
    alternativeHeadline: item.excerpt,
    description: item.excerpt,
    datePublished: item.date,
    dateModified: item.date,
    inLanguage: "en",
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: item.author, url: SITE },
    publisher: {
      "@type": "Organization",
      name: "First Tech Group",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/ftg-mark.png` },
    },
    image: item.cover ? `${SITE}${item.cover}` : `${SITE}/og.png`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/insights/${item.slug}` },
    articleSection: item.vertical,
    ...(wordCount ? { wordCount } : {}),
    ...(mins ? { timeRequired: `PT${mins}M` } : {}),
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

          {/* editorial byline */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-[var(--line)] py-4">
            <Image src="/ftg-mark.png" alt="" width={26} height={15} className="opacity-90" />
            <span className="text-[13.5px] font-bold text-paper">{item.author}</span>
            <span className="text-[var(--muted-2)]">·</span>
            <time dateTime={item.date} className="font-mono text-[11px] uppercase tracking-[.1em] text-[var(--muted-2)]">
              {fmtDate(item.date)}
            </time>
            {item.readTime ? (
              <>
                <span className="text-[var(--muted-2)]">·</span>
                <span className="font-mono text-[11px] uppercase tracking-[.1em] text-[var(--muted-2)]">{item.readTime}</span>
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

          {/* standfirst */}
          <p className="mt-9 text-xl leading-[1.55] text-paper/90" style={{ textWrap: "pretty" }}>
            {item.excerpt}
          </p>

          {/* table of contents for long reads */}
          {showToc && (
            <nav aria-label="Contents" className="mt-8 rounded-[3px] border border-[var(--line)] bg-[var(--ink-2)] p-5 sm:p-6">
              <div className="idx mb-3">CONTENTS</div>
              <ol className="space-y-2">
                {headings.map((h, i) => (
                  <li key={h.id} className="flex gap-3">
                    <span className="font-mono text-[11px] text-[var(--muted-2)]">{String(i + 1).padStart(2, "0")}</span>
                    <a href={`#${h.id}`} className="text-[14.5px] text-[var(--muted)] transition hover:text-spark">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {body ? (
            <div className="mt-4">
              <Prose content={body} />
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

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
            <LinkButton href="/insights" variant="ghost">
              ← Back to Insights
            </LinkButton>
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted-2)]">
              First Tech Group · Research
            </span>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
