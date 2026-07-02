import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingEffects } from "@/components/marketing/MarketingEffects";
import { SocialLink } from "@/components/marketing/SocialIcons";
import { ProductVignette } from "@/components/marketing/ProductVignette";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/seo";
import { LOGO_DIM, type Product } from "@/content/products";
import { getPublishedInsights } from "@/lib/posts";

function BrandImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [w, h] = LOGO_DIM[src] ?? [400, 400];
  return <Image src={src} alt={alt} width={w} height={h} className={className} unoptimized priority />;
}

// A CTA link that renders either an internal <Link> or an external <a>.
function Cta({ label, href, solid, external }: Product["cta"]) {
  const cls = "btn" + (solid ? " solid" : "");
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export async function ProductPage({ product }: { product: Product }) {
  // Resolve related-insight slugs to live titles from the CMS (best-effort).
  let related: { slug: string; title: string }[] = [];
  try {
    const posts = await getPublishedInsights();
    const bySlug = new Map(posts.map((p) => [p.slug, p.title]));
    related = product.related
      .filter((s) => bySlug.has(s))
      .map((s) => ({ slug: s, title: bySlug.get(s) as string }));
  } catch {
    // Insights are DB-backed; never let a fetch failure break a product page.
  }

  const hasWordmark = !!product.wordmark;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/#pillars" },
            { name: product.name, path: `/${product.slug}` },
          ]),
          productSchema({
            name: product.name,
            slug: product.slug,
            description: product.metaDescription,
            image: product.looksLike.find((s) => s.img)?.img ?? product.mark ?? product.wordmark,
          }),
          faqSchema(product.faq),
        ]}
      />
      <SiteHeader />
      <main id="top" className="product">
        {/* HERO */}
        <section className="product-hero grid-bg">
          <div className="wrap">
            <Link href="/#pillars" className="eyebrow reveal product-back">
              ← First Tech Group
            </Link>
            <div className="product-lockup reveal d1">
              {product.mark && (
                <BrandImg
                  src={product.mark}
                  alt={`${product.logoAlt} logo`}
                  className={"product-mark" + (product.markContain ? " contain" : "")}
                />
              )}
              {hasWordmark ? (
                <BrandImg
                  src={product.wordmark as string}
                  alt={`${product.logoAlt} logo`}
                  className={"product-wordmark" + (product.wordmarkTall ? " tall" : "")}
                />
              ) : (
                <span className="product-name">{product.name}</span>
              )}
            </div>
            <div className="product-eyebrow reveal d1">{product.eyebrow}</div>
            <h1 className="reveal d1">{product.tagline}</h1>
            <div className="product-status reveal d2">
              <span className="dot" aria-hidden />
              {product.statusLabel}
              {product.pillarRole && <span className="role-tag">· {product.pillarRole}</span>}
            </div>
            <p className="lead reveal d2">{product.lead}</p>
            <div className="cta-row reveal d3">
              <Cta {...product.cta} />
              {product.secondaryCta && <Cta {...product.secondaryCta} />}
              {product.x && <SocialLink kind="x" handle={product.x.handle} url={product.x.url} />}
            </div>
          </div>
        </section>

        {/* STATUS — in place today / in build */}
        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="product-status-grid">
              <div className="status-col reveal">
                <span className="idx">IN PLACE TODAY</span>
                <ul className="ticks">
                  {product.live.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
              <div className="status-col building reveal d1">
                <span className="idx">CURRENTLY BUILDING</span>
                <ul className="ticks build">
                  {product.building.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHO IT SERVES */}
        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">WHO IT SERVES</span>
              <h2>Built for the people who depend on it.</h2>
            </div>
            <div className="drivers">
              {product.serves.map((s, i) => (
                <div className={"driver reveal" + (i ? ` d${i}` : "")} key={s.who}>
                  <h4>{s.who}</h4>
                  <p>{s.need}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY DIFFERENT */}
        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">WHY IT'S DIFFERENT</span>
              <h2>{product.tagline}</h2>
            </div>
            <div className="product-diff">
              {product.different.map((dd, i) => (
                <div className={"diff reveal" + (i % 2 ? " d1" : "")} key={dd.title}>
                  <h4>{dd.title}</h4>
                  <p>{dd.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT IT LOOKS LIKE */}
        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">WHAT IT LOOKS LIKE</span>
              <h2>The surface, and the discipline underneath.</h2>
            </div>
            <div className="product-gallery reveal d1">
              {product.looksLike.map((shot, i) => (
                <figure className={"shot" + (shot.img ? " has-img" : "")} key={i}>
                  {shot.img ? (
                    <BrandImg src={shot.img} alt={shot.caption} className="shot-img" />
                  ) : (
                    <ProductVignette slug={product.slug} />
                  )}
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST / SECURITY / COMPLIANCE */}
        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">TRUST · SECURITY · COMPLIANCE</span>
              <h2>How trust is engineered, not asserted.</h2>
            </div>
            <div className="drivers">
              {product.trust.map((t, i) => (
                <div className={"driver reveal" + (i ? ` d${i}` : "")} key={t.title}>
                  <h4>{t.title}</h4>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
            <p className="product-trust-note reveal">
              Read how FTG handles data, security, and compliance across every product on the{" "}
              <Link href="/trust">Trust &amp; Compliance</Link> page.
            </p>
          </div>
        </section>

        {/* FAQ — answer-first, mirrored in FAQPage JSON-LD above */}
        <section className="blk" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">QUESTIONS, ANSWERED</span>
              <h2>The short version.</h2>
            </div>
            <div className="mt-8 max-w-[76ch]">
              {product.faq.map((f, i) => (
                <details key={f.q} className="faq-item" open={i === 0}>
                  <summary>
                    <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="q">{f.q}</span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED READING */}
        {related.length > 0 && (
          <section className="blk" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="sechead reveal">
                <span className="idx">RELATED READING</span>
                <h2>The thinking behind {product.name}.</h2>
              </div>
              <div className="related-grid reveal d1">
                {related.map((r) => (
                  <Link key={r.slug} href={`/insights/${r.slug}`} className="related-link">
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CLOSING CTA */}
        <section className="closing" id="contact">
          <div className="wrap">
            <span className="eyebrow reveal">{product.name}</span>
            <h2 className="reveal d1" style={{ marginTop: 20 }}>
              {product.tagline}
            </h2>
            <div className="cta-row reveal d2" style={{ justifyContent: "center", marginTop: 34 }}>
              <Cta {...product.cta} />
              {product.secondaryCta && <Cta {...product.secondaryCta} />}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MarketingEffects />
    </>
  );
}
