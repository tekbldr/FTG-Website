import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingEffects } from "@/components/marketing/MarketingEffects";
import { Prose } from "@/components/insights/Prose";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { LEGAL_DOCS, getLegalDoc } from "@/content/legal";

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getLegalDoc(params.slug);
  if (!doc) return {};
  return buildMetadata({
    title: `${doc.title} — First Tech Group`,
    description: doc.description,
    path: `/legal/${doc.slug}`,
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const doc = getLegalDoc(params.slug);
  if (!doc) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Trust & Compliance", path: "/trust" },
          { name: doc.title, path: `/legal/${doc.slug}` },
        ])}
      />
      <SiteHeader />
      <main className="wrap pt-[120px] pb-24 min-h-screen">
        <header className="border-b border-[var(--line)] pb-10">
          <Link href="/trust" className="eyebrow product-back">
            ← Trust &amp; Compliance
          </Link>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-[-.02em] leading-[1.06] max-w-[22ch]">
            {doc.title}
          </h1>
          <p className="mt-4 font-mono text-[11.5px] uppercase tracking-[.16em] text-[var(--muted-2)]">
            Last updated{" "}
            <time dateTime={doc.updated}>{fmtDate(doc.updated)}</time>
          </p>
        </header>
        <article className="mt-10 max-w-[72ch]">
          <Prose content={doc.body} />
        </article>
        <nav aria-label="Other trust documents" className="mt-16 pt-8 border-t border-[var(--line)]">
          <span className="idx">ALL TRUST DOCUMENTS</span>
          <div className="mt-4 flex flex-wrap gap-2">
            {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
              <Link key={d.slug} href={`/legal/${d.slug}`} className="more-chip">
                {d.title}
              </Link>
            ))}
          </div>
        </nav>
      </main>
      <SiteFooter />
      <MarketingEffects />
    </>
  );
}
