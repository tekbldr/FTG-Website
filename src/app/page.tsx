import Link from "next/link";
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
  loopIntro,
  loopNodes,
  loopLegend,
  whyNow,
  founders,
  closing,
  site,
} from "@/content/site";

const d = (i: number) => (i ? ` d${i}` : "");

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <HeroCanvas />
          <div className="wrap hero-inner">
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
          <div className="wrap">
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
        </section>

        {/* PILLARS */}
        <section className="blk" id="pillars" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sechead reveal">
              <span className="idx">03 — THE PORTFOLIO</span>
              <h2>Three businesses. One system.</h2>
            </div>
            <div className="pillars">
              {pillars.map((p, i) => (
                <div className={`pillar reveal${d(i)}`} key={p.name}>
                  <span className="pk">{p.kicker}</span>
                  <h3>
                    {p.name}
                    <span className="dot">.</span>
                  </h3>
                  <span className="role">{p.role}</span>
                  <p>{p.body}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
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
              <svg
                className="loopsvg reveal"
                viewBox="0 0 420 420"
                role="img"
                aria-label="The FTG compounding loop"
              >
                <defs>
                  <marker id="arr" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#FF5E2C" />
                  </marker>
                </defs>
                <g fill="none" stroke="var(--line-2)" strokeWidth="1.4">
                  <path className="flow" d="M210,70 A140,140 0 0,1 350,210" markerEnd="url(#arr)" />
                  <path className="flow" d="M350,210 A140,140 0 0,1 210,350" markerEnd="url(#arr)" />
                  <path className="flow" d="M210,350 A140,140 0 0,1 70,210" markerEnd="url(#arr)" />
                  <path className="flow" d="M70,210 A140,140 0 0,1 210,70" markerEnd="url(#arr)" />
                </g>
                <circle cx="210" cy="210" r="34" fill="none" stroke="var(--line-2)" />
                <text
                  x="210"
                  y="214"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="15"
                  fontWeight="700"
                  fill="#FAFAF7"
                >
                  FTG
                </text>
                {loopNodes.map((n) => (
                  <g className="node" data-i={n.i} key={n.i}>
                    <circle cx={n.cx} cy={n.cy} r="30" fill="var(--ink-2)" stroke="var(--line-2)" />
                    <text
                      x={n.cx}
                      y={n.cy + 4}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={n.fontSize}
                      fill="#FAFAF7"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
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
