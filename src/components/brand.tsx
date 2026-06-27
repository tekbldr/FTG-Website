import Link from "next/link";
import Image from "next/image";

export function Logo({ size = 26 }: { size?: number }) {
  // Integer dimensions matching the mark's native 48×27 ratio. Next's <Image>
  // compares the rounded rendered size against the width/height attributes and
  // warns on any mismatch, so non-integer attrs (e.g. 45.76) always trip it.
  const w = Math.round((size * 48) / 27);
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <Image
        src="/ftg-mark.png"
        alt="First Tech Group"
        width={w}
        height={size}
        priority
        style={{ width: w, height: size }}
      />
      <span className="font-bold text-[15px] tracking-[.02em]">
        First Tech <span className="text-spark">Group</span>
      </span>
    </Link>
  );
}

export function TopNav({
  children,
  right,
}: {
  children?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(11,11,14,.72)] backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 font-mono text-[12.5px] uppercase tracking-[.12em] text-[var(--muted)]">
          {children}
        </nav>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink-2)] mt-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-10 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[.16em] text-[var(--muted-2)]">
          First Tech Group · Markets · Money · Intelligence
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[.16em] text-[var(--muted-2)]">
          Engineering what comes next
        </span>
      </div>
    </footer>
  );
}
