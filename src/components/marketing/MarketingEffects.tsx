"use client";

import { useEffect } from "react";

// Scroll-reveal + interactive compounding-loop. Renders nothing; wires behavior
// to server-rendered markup (.reveal, .node[data-i], .legend .li[data-i]).
export function MarketingEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Count-up for stat numbers ("3", "400M", …) — animates only the leading
    // text node so suffix spans (e.g. the spark "+") are untouched.
    const counted = new WeakSet<HTMLElement>();
    const countUp = (root: HTMLElement) => {
      root.querySelectorAll<HTMLElement>(".stat .n").forEach((n) => {
        if (counted.has(n)) return;
        counted.add(n);
        const textNode = Array.from(n.childNodes).find(
          (c) => c.nodeType === Node.TEXT_NODE && (c.textContent ?? "").trim()
        );
        const m = (textNode?.textContent ?? "").trim().match(/^(\d+)([A-Za-z%]*)$/);
        if (!textNode || !m) return;
        const target = parseInt(m[1], 10);
        const suffix = m[2] ?? "";
        const t0 = performance.now();
        const dur = 950;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          textNode.textContent = `${Math.round(target * eased)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        textNode.textContent = `0${suffix}`;
        requestAnimationFrame(tick);
      });
    };

    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    let io: IntersectionObserver | null = null;
    if (reduce) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              countUp(e.target as HTMLElement);
              io?.unobserve(e.target);
            }
          }),
        { threshold: 0.14 }
      );
      revealEls.forEach((el) => io!.observe(el));
    }

    // Loop interactivity
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".node"));
    const lis = Array.from(document.querySelectorAll<HTMLElement>(".legend .li"));
    const hot = (i: number) => {
      nodes.forEach((n) => n.classList.toggle("hot", Number(n.dataset.i) === i));
      lis.forEach((l) => l.classList.toggle("active", Number(l.dataset.i) === i));
    };
    const enterHandlers: Array<() => void> = [];
    [...nodes, ...lis].forEach((el) => {
      const fn = () => hot(Number(el.dataset.i));
      enterHandlers.push(fn);
      el.addEventListener("mouseenter", fn);
    });
    let auto = 0;
    let timer: ReturnType<typeof setInterval> | null = null;
    if (!reduce && nodes.length) {
      timer = setInterval(() => {
        hot(auto % 4);
        auto++;
      }, 2200);
    }

    return () => {
      io?.disconnect();
      if (timer) clearInterval(timer);
      [...nodes, ...lis].forEach((el, idx) => {
        const fn = enterHandlers[idx];
        if (fn) el.removeEventListener("mouseenter", fn);
      });
    };
  }, []);

  return null;
}
