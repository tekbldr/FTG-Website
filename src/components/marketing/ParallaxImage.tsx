"use client";

import { useEffect, useRef } from "react";

// Depth for the marketing feature images: a slow scroll drift + a gentle
// pointer tilt on the inner layer, plus an idle float (CSS, .img-float).
// Research-backed restraint: transform-only, rAF-throttled, small multipliers,
// and fully inert under prefers-reduced-motion.
export function ParallaxImage({
  children,
  className,
  drift = 18, // max px of scroll drift (±)
  tilt = 3.2, // max deg of pointer tilt
}: {
  children: React.ReactNode;
  className?: string;
  drift?: number;
  tilt?: number;
}) {
  const layer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let ry = 0, rx = 0; // pointer tilt targets
    let ty = 0; // scroll drift target

    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (element below viewport center) … +1 (above): drift against scroll.
      const offset = ((r.top + r.height / 2) / vh - 0.5) * 2;
      ty = Math.max(-1, Math.min(1, offset)) * drift;
    };

    const apply = () => {
      raf = 0;
      el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      compute();
      queue();
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry = px * tilt;
      rx = -py * tilt;
      queue();
    };
    const onLeave = () => {
      ry = 0;
      rx = 0;
      queue();
    };

    compute();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [drift, tilt]);

  return (
    <div className={className} style={{ perspective: "900px" }}>
      <div ref={layer} className="plx-layer">
        <div className="img-float">{children}</div>
      </div>
    </div>
  );
}
