"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand";
import { nav } from "@/content/site";
import { createClient } from "@/lib/supabase/client";

// Fixed marketing header: solidifies on scroll, mobile menu, and an auth-aware
// account slot (Portal + Sign out when logged in, Log in when not).
export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setAuthed(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

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
          {authed ? (
            <>
              <button
                type="button"
                onClick={signOut}
                className="hidden font-mono text-[12px] uppercase tracking-[.12em] text-[var(--muted)] transition hover:text-paper sm:inline-flex"
              >
                Sign out
              </button>
              <Link href="/portal" className="btn hidden sm:inline-flex">
                Portal
              </Link>
            </>
          ) : (
            <Link href="/login" className="btn hidden sm:inline-flex">
              Log in
            </Link>
          )}
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
          {authed ? (
            <>
              <Link href="/portal" className="btn mt-2" onClick={() => setOpen(false)}>
                Portal
              </Link>
              <button type="button" onClick={signOut} className="btn">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn mt-2" onClick={() => setOpen(false)}>
              Log in
            </Link>
          )}
          <Link href="/pitch" className="btn solid" onClick={() => setOpen(false)}>
            Pitch us
          </Link>
        </div>
      )}
    </header>
  );
}
