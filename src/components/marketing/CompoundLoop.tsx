import { loopNodes } from "@/content/site";

// The section-04 compounding loop, rebuilt as a dimensional "orbital" diagram:
// a glossy FTG hub, satellite discs with icons on the orbit ring, a slow
// rotating glow sweep, and gradient flow arrows. Pure markup + CSS — the
// existing MarketingEffects wiring (.node[data-i] hover ↔ .legend sync +
// auto-rotate "hot" state) keeps working unchanged.

const ICONS: Record<number, JSX.Element> = {
  // Exx1 — candlesticks (markets)
  0: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M7 4v3M7 15v3M4.8 7h4.4v8H4.8zM17 6v2M17 18v2M14.8 8h4.4v10h-4.4z" />
    </svg>
  ),
  // Wallet
  1: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9z" />
      <path d="M15 11.5h5v3h-5a1.5 1.5 0 0 1 0-3z" />
    </svg>
  ),
  // PRVAI — chip
  2: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    </svg>
  ),
  // Memory — graph
  3: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="8" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M8 7l7.8.9M7 7.8l4 8.2M16.6 9.8L13 16.2" />
    </svg>
  ),
};

// Node centers sit on the orbit ring (inset 8% → radius 42%).
const POS: Record<number, { left: string; top: string }> = {
  0: { left: "50%", top: "8%" },
  1: { left: "92%", top: "50%" },
  2: { left: "50%", top: "92%" },
  3: { left: "8%", top: "50%" },
};

// Clockwise arcs between nodes on r=193 (of a 460 box), 17° clear of each disc.
const ARCS = [
  "M286.4,45.5 A193,193 0 0 1 414.6,173.6",
  "M414.6,286.4 A193,193 0 0 1 286.4,414.5",
  "M173.6,414.5 A193,193 0 0 1 45.5,286.4",
  "M45.5,173.6 A193,193 0 0 1 173.6,45.5",
];

export function CompoundLoop() {
  return (
    <div className="orbit reveal" role="img" aria-label="The FTG compounding loop: Exx1, Wallet, PRVAI, and Memory orbiting the group.">
      <span className="orbit-halo" aria-hidden />
      <span className="orbit-ring" aria-hidden />
      <span className="orbit-sweep" aria-hidden />
      <svg className="orbit-arrows" viewBox="0 0 460 460" aria-hidden>
        <defs>
          <marker id="oarr" markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#FF5E2C" />
          </marker>
        </defs>
        {ARCS.map((d) => (
          <path key={d} className="flow orbit-arc" d={d} markerEnd="url(#oarr)" />
        ))}
      </svg>
      <div className="orbit-center">
        <span>FTG</span>
      </div>
      {loopNodes.map((n) => (
        <div className="node orbit-node" data-i={n.i} key={n.i} style={POS[n.i]} tabIndex={0}>
          {ICONS[n.i]}
          <span className="nl">{n.label}</span>
        </div>
      ))}
    </div>
  );
}
