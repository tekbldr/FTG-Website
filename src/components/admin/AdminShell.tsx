"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand";
import { createClient } from "@/lib/supabase/client";
import type { AdminModules } from "@/lib/roles";

export function AdminShell({ modules, children }: { modules: AdminModules; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  const items = [
    { href: "/admin", label: "Overview", show: true },
    { href: "/admin/recruiting", label: "Careers", show: modules.careers },
    { href: "/admin/review", label: "Pitch", show: modules.pitch },
    { href: "/admin/insights", label: "Insights", show: modules.insights },
    { href: "/admin/people", label: "People & Roles", show: modules.people },
  ].filter((i) => i.show);

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="site-header solid">
        <div className="wrap nav">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden font-mono text-[11px] uppercase tracking-[.24em] text-[var(--muted-2)] sm:inline">
              Operations
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-[12px] uppercase tracking-[.12em] text-[var(--muted)] transition hover:text-paper"
            >
              View site
            </Link>
            <button type="button" onClick={signOut} className="btn">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1320px] gap-8 px-5 pb-16 pt-[88px] sm:px-8">
        <aside className="hidden w-[176px] shrink-0 md:block">
          <nav className="sticky top-[88px] flex flex-col gap-1" aria-label="Admin">
            {items.map((i) => {
              const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "rounded-[2px] px-3 py-[10px] font-mono text-[12px] uppercase tracking-[.12em] transition " +
                    (active
                      ? "border border-[var(--line)] bg-[var(--ink-2)] text-spark"
                      : "border border-transparent text-[var(--muted)] hover:text-paper")
                  }
                >
                  {i.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
