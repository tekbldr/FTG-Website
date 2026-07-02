import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { HeroCanvas } from "@/components/marketing/HeroCanvas";
import { MarketingEffects } from "@/components/marketing/MarketingEffects";
import {
  hero,
  heroStats,
  model,
  group,
  pillars,
  pillarX,
  loopIntro,
  loopLegend,
  whyNow,
  founders,
  closing,
  site,
} from "@/content/site";
import { SocialLink } from "@/components/marketing/SocialIcons";
import { ParallaxImage } from "@/components/marketing/ParallaxImage";
import { CompoundLoop } from "@/components/marketing/CompoundLoop";
import { getProduct, LOGO_DIM } from "@/content/products";

const d = (i: number) => (i ? ` d${i}` : "");

// Visual-balance heights for the portfolio card logos: wide wordmarks sit
// shorter, squarer lockups taller, so all five read as the same size.
const PILLAR_LOGO_H: Record<string, number> = {
  "/exx1": 42,
  "/prvai": 34,
  "/prv-wallet": 46,
  "/diwan-os": 44,
  "/eqwt1": 56,
};

// Home canonical (title/description/OG inherit from the root layout).
export const metadata: Metadata = { alternates: { canonical: "https://www.ftg.vc" } };

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <HeroCanvas />
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <div className="eyebrow reveal">{hero.eyebrow}</div>
              <h1 className="reveal d1">{hero.headline}</h1>
              <p className="lead reveal d2">{hero.lead}</p>
              <div className="cta-row reveal d3">
                <Link href="#pillars" className="btn solid">
                  Explore the group →
                </Link>
                <Link href="#loop" className="btn">
                  How it compounds
                </Link>
              </div>
              <div className="tagline reveal d3">
                <span className="rule" />
                {site.tagline}
              </div>
            </div>
            <ParallaxImage className="hero-art reveal d2" drift={38} scale={0.05} tilt={3}>
              <Image
                src="/hero-stack.png"
                alt="Region-grade Arabic AI and data residency converging into FTG's applications, platform, data and infrastructure stack."
                width={721}
                height={863}
                priority
                unoptimized
                className="hero-art-img"
              />
            </ParallaxImage>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          <div className="wrap">
            <div className="grid4">
              {heroStats.map((s, i) => (
                <div className={`stat reveal${d(i)}`} key={s.label}>
                  <div className="n">
                    {s.n}
                    {s.u && <span className="u">{s.u}</span>}
                  </div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODEL */}
        <section className="blk" id="model">
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">01 — THE MODEL</span>
              <h2>We fund, build, and operate.</h2>
              <p>
                {
                  "FTG is a venture firm that doesn't stop at the cheque. We back exceptional founders, incubate companies in-house, and stay on as operators — sharing one identity, intelligence, and memory backbone across everything we touch."
                }
              </p>
            </div>
            <div className="drivers">
              {model.map((m, i) => (
                <div className={`driver reveal${d(i)}`} key={m.key}>
                  <div className="num mono">{m.key}</div>
                  <h4>{m.title}</h4>
                  <p>{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GROUP */}
        <section className="blk" id="group" style={{ paddingTop: 0 }}>
          <div className="wrap group-grid">
            <div className="group-copy">
              <div className="sechead reveal">
                <span className="idx">02 — THE GROUP</span>
                <h2>{group.heading}</h2>
                <p>{group.body}</p>
              </div>
              <blockquote className="quote reveal d1">
                {"“"}
                {group.quoteLead}
                <span className="spark">{group.quoteSpark}</span>
                {group.quoteTail}
                {"”"}
              </blockquote>
            </div>
            <ParallaxImage className="group-art reveal d1" drift={64} scale={0.07} rotate={-2.5} tilt={2.4}>
              <Image
                src="/group-rocket.png"
                alt="FTG wireframe rocket launching from its platform — funding, building, and operating the stack."
                width={1254}
                height={1254}
                unoptimized
                className="group-art-img"
              />
            </ParallaxImage>
          </div>
        </section>

        {/* PILLARS */}
        <section className="blk" id="pillars" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">03 — THE PORTFOLIO</span>
              <h2>Five products. One system.</h2>
            </div>
            <div className="pillars">
              {pillars.map((p, i) => {
                const prod = getProduct(p.href.replace("/", ""));
                const logo = prod?.wordmark ?? prod?.mark;
                const dim = logo ? LOGO_DIM[logo] : undefined;
                // Per-logo height so wildly different lockup aspect ratios read
                // as the same visual size across the row.
                const logoH = PILLAR_LOGO_H[p.href] ?? 40;
                return (
                  <div className={`pillar reveal${d(i % 3)}`} key={p.name}>
                    <span className="pk">{p.kicker}</span>
                    <Link href={p.href} className="pillar-card-link" aria-label={p.name}>
                      <span className="pillar-logo-box">
                        {logo && dim ? (
                          <Image
                            src={logo}
                            alt={p.name}
                            width={dim[0]}
                            height={dim[1]}
                            unoptimized
                            className="pillar-logo"
                            style={{ height: logoH, width: "auto" }}
                          />
                        ) : (
                          <h3>
                            {p.name}
                            <span className="dot">.</span>
                          </h3>
                        )}
                      </span>
                      <span className="role">{p.role}</span>
                    </Link>
                    <p>{p.body}</p>
                    <Link href={p.href} className="more">
                      Explore {p.name} →
                    </Link>
                    <div className="tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                      {pillarX[p.name] && (
                        <SocialLink kind="x" handle={pillarX[p.name].handle} url={pillarX[p.name].url} compact />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LOOP */}
        <section className="blk" id="loop" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">04 — HOW IT COMPOUNDS</span>
              <h2>{loopIntro.heading}</h2>
              <p>{loopIntro.body}</p>
            </div>
            <div className="loop">
              <CompoundLoop />
              <div className="legend reveal d1">
                {loopLegend.map((l) => (
                  <div className="li" data-i={l.i} key={l.i}>
                    <span className="k">{l.k}</span>
                    <div>
                      <h4>{l.title}</h4>
                      <p>{l.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY NOW */}
        <section className="blk" id="why" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">05 — WHY NOW</span>
              <h2>The window is open — briefly.</h2>
            </div>
            <div className="drivers">
              {whyNow.map((dr, i) => (
                <div className={`driver reveal${d(i)}`} key={dr.num}>
                  <div className="num">{dr.num}</div>
                  <h4>{dr.title}</h4>
                  <p>{dr.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* JOIN US / PITCH US */}
        <section className="blk" id="founders" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">06 — JOIN US</span>
              <h2>
                {founders.heading} <span className="spark">{founders.headingSpark}</span>
              </h2>
              <p>{founders.body}</p>
            </div>
            <div className="cta-row reveal d1" style={{ marginTop: 32 }}>
              <Link href="/pitch" className="btn solid">
                Pitch your company →
              </Link>
              <Link href="/careers" className="btn">
                View open roles
              </Link>
              <Link
                href="/pitch/what-good-looks-like"
                className="font-mono text-[12px] uppercase tracking-[.12em] text-[var(--muted)] transition hover:text-paper"
              >
                What a good pitch looks like →
              </Link>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="closing" id="contact">
          <div className="wrap">
            <span className="eyebrow reveal">{closing.leadEyebrow}</span>
            <h2 className="reveal d1" style={{ marginTop: 20 }}>
              {closing.parts.map((part, i) =>
                i % 2 === 1 ? (
                  <span className="spark" key={i}>
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h2>
            <a className="em reveal d2" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MarketingEffects />
    </>
  );
}
