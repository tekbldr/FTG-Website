// Animated "concept vignettes" for products still in build — living interface
// sketches drawn in the FTG system (ink surfaces, one spark accent, mono for
// numbers) instead of empty placeholders or fake screenshots. Pure markup +
// CSS keyframes: zero JS, and the global reduced-motion rule freezes them.
// Every vignette is labelled CONCEPT — these illustrate intent, not shipped UI.

function ConceptTag() {
  return <span className="vg-tag">Concept</span>;
}

// ── Exx1: order book + drifting price line ──────────────────────────────────
function Exx1Vignette() {
  // Deterministic pseudo-depth bars (no Math.random — SSR-stable).
  const depths = [72, 54, 88, 40, 63, 31];
  const path = "M0,58 L40,52 L80,60 L120,44 L160,50 L200,34 L240,42 L280,26 L320,32 L360,18";
  return (
    <div className="vignette" role="img" aria-label="Concept sketch of the Exx1 trading venue: order book depth and a live price line.">
      <ConceptTag />
      <div className="vg-head">
        <span className="vg-title">EXX1 · ORDER BOOK</span>
        <span className="vg-live">
          <span className="vg-dot" /> MATCHING
        </span>
      </div>
      <div className="vg-exx1-grid">
        <div className="vg-book">
          {depths.map((d, i) => (
            <div className="vg-row" key={i} style={{ animationDelay: `${i * 0.35}s` }}>
              <span className="vg-depth" style={{ width: `${d}%` }} />
              <span className="vg-num">{(64280 - i * 12).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <svg className="vg-chart" viewBox="0 0 360 76" aria-hidden="true" preserveAspectRatio="none">
          <path className="vg-line" d={path} fill="none" stroke="var(--spark)" strokeWidth="1.6" />
          <circle className="vg-tip" r="3" fill="var(--spark)">
            <animateMotion dur="6s" repeatCount="indefinite" path={path} />
          </circle>
        </svg>
      </div>
      <div className="vg-foot">
        <span>Deterministic ordering</span>
        <span>No privileged fast path</span>
      </div>
    </div>
  );
}

// ── PRV Wallet: shielded balance card, keys on device ───────────────────────
function PrvWalletVignette() {
  return (
    <div className="vignette" role="img" aria-label="Concept sketch of PRV Wallet: a shielded balance with keys held on the device.">
      <ConceptTag />
      <div className="vg-card">
        <div className="vg-head">
          <span className="vg-title">PRV WALLET</span>
          <span className="vg-chip">NON-CUSTODIAL</span>
        </div>
        <div className="vg-balance" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span className="vg-mask" key={i} style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
        <div className="vg-addr">0x7f3a···e91c</div>
        <div className="vg-shield" aria-hidden="true">
          <span className="vg-ring" />
          <span className="vg-ring r2" />
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--spark)" strokeWidth="1.5">
            <path d="M12 3l7 3v5c0 4.4-3 8.2-7 9.5C8 19.2 5 15.4 5 11V6l7-3z" />
            <path d="M9.5 12l1.8 1.8L15 10" />
          </svg>
        </div>
      </div>
      <div className="vg-foot">
        <span>Keys derived on-device</span>
        <span>ZK where it counts</span>
      </div>
    </div>
  );
}

// ── PRVAI: voice bars + orbiting memory graph ───────────────────────────────
function PrvaiVignette() {
  const bars = [14, 30, 22, 42, 18, 36, 26, 44, 20, 32, 16, 38];
  return (
    <div className="vignette" role="img" aria-label="Concept sketch of PRVAI: a live voice waveform beside an orbiting memory graph.">
      <ConceptTag />
      <div className="vg-head">
        <span className="vg-title">PRVAI · VOICE + MEMORY</span>
        <span className="vg-live">
          <span className="vg-dot" /> LISTENING
        </span>
      </div>
      <div className="vg-ai-grid">
        <div className="vg-wave" aria-hidden="true">
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${h}px`, animationDelay: `${i * 0.09}s` }} />
          ))}
        </div>
        <div className="vg-orbit" aria-hidden="true">
          <span className="vg-core" />
          <span className="vg-sat s1" />
          <span className="vg-sat s2" />
          <span className="vg-sat s3" />
        </div>
      </div>
      <div className="vg-foot">
        <span>Rent the models</span>
        <span>Own the memory</span>
      </div>
    </div>
  );
}

// ── Diwan OS: Arabic-first conversation ─────────────────────────────────────
function DiwanVignette() {
  return (
    <div className="vignette" role="img" aria-label="Concept sketch of Diwan OS: an Arabic-first conversation with a persistent memory.">
      <ConceptTag />
      <div className="vg-head">
        <span className="vg-title">DIWAN OS</span>
        <span className="vg-chip">عربي أولاً</span>
      </div>
      <div className="vg-chat">
        <p className="vg-bubble user" dir="rtl" lang="ar">
          رتّب لي فواتير هذا الشهر
        </p>
        <p className="vg-bubble agent" dir="rtl" lang="ar">
          تم — ثلاث فواتير، جدولتها كما تفضّل دائماً
        </p>
        <div className="vg-bubble agent vg-typing" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="vg-foot">
        <span>One agent, many jobs</span>
        <span>One memory</span>
      </div>
    </div>
  );
}

const BY_SLUG: Record<string, () => JSX.Element> = {
  exx1: Exx1Vignette,
  "prv-wallet": PrvWalletVignette,
  prvai: PrvaiVignette,
  "diwan-os": DiwanVignette,
};

export function ProductVignette({ slug }: { slug: string }) {
  const V = BY_SLUG[slug];
  if (!V) return <div className="shot-ph grid-bg" aria-hidden />;
  return <V />;
}
