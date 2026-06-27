"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand";
import { nav } from "@/content/site";

// Fixed marketing header that solidifies on scroll, with a mobile menu.
export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"site-header" + (solid ? " solid" : "")}>
      <div className="wrap nav">
        <Logo />
        <nav className="navlinks" aria-label="Primary">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/pitch" className="btn solid hidden sm:inline-flex">
            Pitch us
          </Link>
          <button
            className="btn menu-toggle"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Menu">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/pitch" className="btn solid mt-2" onClick={() => setOpen(false)}>
            Pitch us
          </Link>
        </div>
      )}
    </header>
  );
}
