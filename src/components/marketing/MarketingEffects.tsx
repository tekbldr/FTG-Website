"use client";

import { useEffect } from "react";

// Scroll-reveal + interactive compounding-loop. Renders nothing; wires behavior
// to server-rendered markup (.reveal, .node[data-i], .legend .li[data-i]).
export function MarketingEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
