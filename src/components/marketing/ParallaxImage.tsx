"use client";

import { useEffect, useRef } from "react";

// Scroll-animated feature images: drift, scale, and a slight rotation are all
// driven by the element's position in the viewport, plus a gentle pointer tilt
// and idle float (CSS, .img-float). Transform-only, rAF-throttled, and fully
// inert under prefers-reduced-motion.
export function ParallaxImage({
  children,
  className,
  drift = 34, // max px of scroll drift (±)
  scale = 0.05, // extra scale at viewport center (0.05 → up to 1.05)
  rotate = 0, // max deg of scroll-linked z-rotation (±)
  tilt = 3, // max deg of pointer tilt
}: {
  children: React.ReactNode;
  className?: string;
  drift?: number;
  scale?: number;
  rotate?: number;
  tilt?: number;
}) {
  const layer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let ry = 0, rx = 0; // pointer tilt
    let ty = 0, sc = 1, rz = 0; // scroll-driven drift/scale/rotation

    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (element entering from below) … +1 (leaving above); 0 at center.
      const offset = Math.max(-1, Math.min(1, (((r.top + r.height / 2) / vh - 0.5) * 2)));
      ty = offset * drift;
      sc = 1 + (1 - Math.abs(offset)) * scale; // grows toward viewport center
      rz = offset * rotate;
    };

    const apply = () => {
      raf = 0;
      el.style.transform =
        `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})` +
        ` rotateZ(${rz.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
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
      ry = ((e.clientX - r.left) / r.width - 0.5) * tilt;
      rx = -((e.clientY - r.top) / r.height - 0.5) * tilt;
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
  }, [drift, scale, rotate, tilt]);

  return (
    <div className={className} style={{ perspective: "900px" }}>
      <div ref={layer} className="plx-layer">
        <div className="img-float">{children}</div>
      </div>
    </div>
  );
}
