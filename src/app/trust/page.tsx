import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingEffects } from "@/components/marketing/MarketingEffects";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { LEGAL_DOCS } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Trust & Compliance — First Tech Group",
  description:
    "How FTG handles data, security, and compliance: privacy notices for users, candidates, and founders; terms; cookies; security architecture; and accessibility.",
  path: "/trust",
});

// The three disciplines that recur across every notice — surfaced up front so
// visitors get the posture without reading seven documents.
const posture = [
  {
    title: "Data lives in the EU",
    body: "Application data and uploaded documents are stored in Frankfurt, Germany, with transfers safeguarded for GDPR, Saudi PDPL, and UAE PDPL.",
  },
  {
    title: "Private, scanned, signed",
    body: "Every upload goes into private storage, is malware-scanned before anyone can open it, and is retrieved only through 60-second signed links by authorised staff.",
  },
  {
    title: "Deletion on a timer",
    body: "Unsuccessful applications and declined submissions are purged automatically — files included — six months after the decision. Retention that runs on a schedule actually happens.",
  },
];

export default function TrustPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Trust & Compliance", path: "/trust" },
        ])}
      />
      <SiteHeader />
      <main className="min-h-screen">
        <section className="product-hero grid-bg">
          <div className="wrap">
            <div className="eyebrow reveal">FIRST TECH GROUP</div>
            <h1 className="reveal d1" style={{ fontSize: "clamp(2rem,4.4vw,3.4rem)", maxWidth: "22ch", margin: "18px 0 20px", fontWeight: 700, letterSpacing: "-.022em", lineHeight: 1.08 }}>
              Trust &amp; Compliance
            </h1>
            <p className="lead reveal d2" style={{ color: "var(--muted)", maxWidth: "62ch", lineHeight: 1.62 }}>
              FTG collects sensitive things — candidates&apos; CVs, founders&apos; decks and financials, users&apos; accounts.
              This section states, in plain language, how they are protected, what we do and don&apos;t do with them,
              and the rights you keep. No legalese where plain words will do.
            </p>
          </div>
        </section>

        <section className="blk">
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">THE POSTURE</span>
              <h2>Three disciplines, everywhere.</h2>
            </div>
            <div className="drivers">
              {posture.map((p, i) => (
                <div className={"driver reveal" + (i ? ` d${i}` : "")} key={p.title}>
                  <h4>{p.title}</h4>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">THE DOCUMENTS</span>
              <h2>Everything, in writing.</h2>
            </div>
            <div className="trust-grid reveal d1">
              {LEGAL_DOCS.map((d) => (
                <Link key={d.slug} href={`/legal/${d.slug}`} className="trust-card">
                  <h3>{d.title}</h3>
                  <p>{d.description}</p>
                  <span className="open">Read →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">CONTACT</span>
              <h2>A human answers.</h2>
              <p>
                Privacy requests, security reports, accessibility problems, or media inquiries — write to{" "}
                <a href={`mailto:${site.email}`} className="text-spark underline underline-offset-2">{site.email}</a>.
                Founders with questions about how submissions are handled can reach{" "}
                <a href={`mailto:${site.foundersEmail}`} className="text-spark underline underline-offset-2">{site.foundersEmail}</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MarketingEffects />
    </>
  );
}
