"use client";

import { useEffect, useRef } from "react";

// Engineered "constellation" hero — faint grid + drifting nodes that link when
// close and warm toward the cursor. 60fps, fully reduced-motion safe.
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0;
    let pts: { x: number; y: number; vx: number; vy: number; s: boolean }[] = [];
    const mouse = { x: -999, y: -999 };

    function size() {
      if (!c || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor((w * h) / 16000));
      pts = [];
      for (let i = 0; i < n; i++)
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          s: Math.random() < 0.08,
        });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(250,250,247,.035)";
      ctx.lineWidth = 1;
      const g = 88;
      for (let x = g; x < w; x += g) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = g; y < h; y += g) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i],
            b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 118) {
            ctx.strokeStyle = "rgba(250,250,247," + 0.11 * (1 - d / 118) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const near = dm < 140;
        ctx.fillStyle = p.s
          ? "rgba(255,94,44," + (near ? 1 : 0.8) + ")"
          : "rgba(250,250,247," + (near ? 0.8 : 0.4) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s ? 2 : 1.4, 0, 7);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    function start() {
      cancelAnimationFrame(raf);
      size();
      draw();
    }
    const onMove = (e: MouseEvent) => {
      if (!c) return;
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -999;
    };

    window.addEventListener("resize", start);
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    start();
    if (reduce) {
      cancelAnimationFrame(raf);
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", start);
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
