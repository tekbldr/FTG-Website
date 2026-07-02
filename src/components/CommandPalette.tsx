"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ⌘K command palette — keyboard-first navigation across the whole site.
// Opens on Cmd/Ctrl+K or the header trigger (window event "ftg:cmdk").
// Static routes ship in the bundle; insight titles load once from /api/nav-index.

type Item = { label: string; href: string; group: string };

const STATIC_ITEMS: Item[] = [
  { label: "Home", href: "/", group: "Company" },
  { label: "FTG Insights", href: "/insights", group: "Company" },
  { label: "Careers — open roles", href: "/careers", group: "Company" },
  { label: "Trust & Compliance", href: "/trust", group: "Company" },
  { label: "Exx1 — the exchange", href: "/exx1", group: "Products" },
  { label: "PRVAI — applied AI", href: "/prvai", group: "Products" },
  { label: "PRV Wallet — privacy fintech", href: "/prv-wallet", group: "Products" },
  { label: "Diwan OS — Arabic-first AI", href: "/diwan-os", group: "Products" },
  { label: "EQWT1 — multi-asset trading", href: "/eqwt1", group: "Products" },
  { label: "Pitch us", href: "/pitch", group: "Founders" },
  { label: "Founder FAQ", href: "/pitch/faq", group: "Founders" },
  { label: "What a good pitch looks like", href: "/pitch/what-good-looks-like", group: "Founders" },
  { label: "Submit your company", href: "/login?next=/portal/founder/new", group: "Founders" },
  { label: "Privacy Notice", href: "/legal/privacy", group: "Legal" },
  { label: "Terms of Use", href: "/legal/terms", group: "Legal" },
  { label: "Cookie Notice", href: "/legal/cookies", group: "Legal" },
  { label: "Candidate Privacy Notice", href: "/legal/candidate-privacy", group: "Legal" },
  { label: "Founder Submission Privacy", href: "/legal/founder-privacy", group: "Legal" },
  { label: "Security", href: "/legal/security", group: "Legal" },
  { label: "Accessibility Statement", href: "/legal/accessibility", group: "Legal" },
];

const GROUP_ORDER = ["Products", "Company", "Founders", "Insights", "Legal"];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [insights, setInsights] = useState<Item[] | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Open/close wiring: ⌘K / Ctrl+K, header trigger event, Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onTrigger = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ftg:cmdk", onTrigger);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ftg:cmdk", onTrigger);
    };
  }, []);

  // On first open: focus the input, lazily fetch insight titles.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    if (insights === null) {
      fetch("/api/nav-index")
        .then((r) => (r.ok ? r.json() : { insights: [] }))
        .then((d) =>
          setInsights(
            (d.insights ?? []).map((i: { label: string; href: string }) => ({ ...i, group: "Insights" }))
          )
        )
        .catch(() => setInsights([]));
    }
    return () => clearTimeout(t);
  }, [open, insights]);

  const results = useMemo(() => {
    const all = [...STATIC_ITEMS, ...(insights ?? [])];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all
          .filter((i) => i.label.toLowerCase().includes(q))
          .sort((a, b) => Number(b.label.toLowerCase().startsWith(q)) - Number(a.label.toLowerCase().startsWith(q)))
      : all;
    // Stable group ordering, insights capped when browsing without a query.
    const grouped = GROUP_ORDER.flatMap((g) => {
      const items = filtered.filter((i) => i.group === g);
      return g === "Insights" && !q ? items.slice(0, 5) : items;
    });
    return grouped.slice(0, 24);
  }, [query, insights]);

  const go = useCallback(
    (item: Item) => {
      setOpen(false);
      router.push(item.href);
    },
    [router]
  );

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  // Keep the active row in view while arrowing.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="cmdk-overlay" onMouseDown={() => setOpen(false)}>
      <div
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cmdk-inputrow">
          <span className="cmdk-glyph" aria-hidden>
            →
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Go to… products, insights, careers, legal"
            aria-label="Search pages"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
          />
          <kbd>esc</kbd>
        </div>
        <div className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
          {results.length === 0 && <p className="cmdk-empty">Nothing matches — try fewer letters.</p>}
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <div key={item.href + item.label}>
                {header && <div className="cmdk-group">{header}</div>}
                <button
                  type="button"
                  data-idx={i}
                  role="option"
                  aria-selected={i === active}
                  className={"cmdk-item" + (i === active ? " active" : "")}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item)}
                >
                  <span className="cmdk-label">{item.label}</span>
                  <span className="cmdk-href">{item.href.split("?")[0]}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="cmdk-foot">
          <span>
            <kbd>↑↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>⌘K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
