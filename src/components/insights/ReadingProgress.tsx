"use client";

import { useEffect, useRef } from "react";

// Thin spark progress line under the header on long reads — position feedback,
// not decoration, so it stays useful under prefers-reduced-motion too.
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={bar} className="read-progress" aria-hidden="true" />;
}
