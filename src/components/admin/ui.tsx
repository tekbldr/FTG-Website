import Link from "next/link";

// Shared console primitives — every admin module page uses the SAME header
// and stat shapes, so the whole panel reads as one system.

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
      <div className="min-w-0">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-2 text-2xl font-bold tracking-[-.02em] sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-[62ch] text-[14.5px] leading-[1.6] text-[var(--muted)]">{description}</p>}
        {meta && <div className="mt-3">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </header>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-7 grid gap-px overflow-hidden rounded-[2px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint, href }: { label: string; value: string | number; hint?: string; href?: string }) {
  const inner = (
    <>
      <div className="font-mono text-[10.5px] uppercase tracking-[.18em] text-[var(--muted-2)]">{label}</div>
      <div className="mt-2 font-mono text-[2rem] font-bold leading-none tracking-[-.02em] text-paper">{value}</div>
      {hint && <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[.1em] text-[var(--muted)]">{hint}</div>}
    </>
  );
  return href ? (
    <Link href={href} className="bg-[var(--ink-2)] p-5 transition hover:bg-ink">
      {inner}
    </Link>
  ) : (
    <div className="bg-[var(--ink-2)] p-5">{inner}</div>
  );
}

export function RoleChips({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((l) => (
        <span
          key={l}
          className="rounded-[2px] border border-[var(--line-2)] px-2 py-[4px] font-mono text-[10px] uppercase tracking-[.1em] text-[var(--muted)]"
        >
          {l}
        </span>
      ))}
    </div>
  );
}
