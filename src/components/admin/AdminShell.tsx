"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminModules } from "@/lib/roles";

// The operations console: a single fixed sidebar system for the whole
// platform. One nav, one top bar, one content region — every module page
// renders inside it with the shared AdminPageHeader, so nothing floats loose.

const ICONS: Record<string, JSX.Element> = {
  overview: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  ),
  careers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="4" y="8" width="16" height="11" rx="1.5" /><path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8M4 12.5h16" />
    </svg>
  ),
  pitch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M12 4l2.1 5.2L19.5 11l-5.4 1.8L12 18l-2.1-5.2L4.5 11l5.4-1.8L12 4z" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M6 20l9.6-9.6a2 2 0 0 0 0-2.8l-.2-.2a2 2 0 0 0-2.8 0L3 17v4h4z" /><path d="M14 6l4 4" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.7-3 3-4.5 5.5-4.5s4.8 1.5 5.5 4.5M16 5.7a3 3 0 0 1 0 5.6M17.8 14.7c1.5.6 2.5 1.9 2.9 3.8" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M5 5h14M5 10h14M5 15h8" /><circle cx="17.5" cy="16.5" r="2.5" /><path d="M19.4 18.4L21 20" />
    </svg>
  ),
};

export function AdminShell({
  modules,
  user,
  children,
}: {
  modules: AdminModules;
  user?: { email?: string | null; name?: string | null };
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  const items = [
    { href: "/admin", label: "Overview", icon: "overview", show: true },
    { href: "/admin/recruiting", label: "Careers", icon: "careers", show: modules.careers },
    { href: "/admin/review", label: "Pitch", icon: "pitch", show: modules.pitch },
    { href: "/admin/insights", label: "Insights", icon: "insights", show: modules.insights },
    { href: "/admin/people", label: "People & Roles", icon: "people", show: modules.people },
    { href: "/admin/audit", label: "Audit", icon: "audit", show: modules.audit },
  ].filter((i) => i.show);

  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  const current = items.find((i) => isActive(i.href))?.label ?? "Operations";

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="admin-root">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand" aria-label="Operations home">
          <Image src="/ftg-mark.png" alt="FTG" width={34} height={19} priority style={{ width: 34, height: 19 }} />
          <span>Operations</span>
        </Link>
        <nav className="admin-nav" aria-label="Console">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className={isActive(i.href) ? "active" : ""} aria-current={isActive(i.href) ? "page" : undefined}>
              {ICONS[i.icon]}
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="admin-side-foot">
          {user?.email && (
            <span className="admin-user" title={user.email}>
              {user.name || user.email}
            </span>
          )}
          <Link href="/" className="admin-foot-link">
            ← View site
          </Link>
          <button type="button" onClick={signOut} className="admin-foot-link as-btn">
            Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-top">
          <span className="admin-crumb">
            FTG Operations <span aria-hidden>/</span> <b>{current}</b>
          </span>
          <div className="admin-top-actions">
            <button
              type="button"
              className="palette-btn"
              aria-label="Search and navigate (Command K)"
              onClick={() => window.dispatchEvent(new CustomEvent("ftg:cmdk"))}
            >
              <span aria-hidden>⌘K</span>
            </button>
            <Link href="/" className="admin-foot-link admin-top-site">
              View site
            </Link>
          </div>
        </header>

        {/* Mobile: the same nav as a horizontal tab strip */}
        <nav className="admin-tabs" aria-label="Console sections">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className={isActive(i.href) ? "active" : ""}>
              {i.label}
            </Link>
          ))}
        </nav>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
