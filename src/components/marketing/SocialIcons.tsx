import Link from "next/link";

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

const LABELS: Record<"x" | "instagram", string> = { x: "X (Twitter)", instagram: "Instagram" };

// Square icon button (consistent across the site). `compact` for tighter spots like cards.
export function SocialLink({
  kind,
  handle,
  url,
  compact,
}: {
  kind: "x" | "instagram";
  handle: string;
  url: string;
  compact?: boolean;
}) {
  const Icon = kind === "x" ? XIcon : InstagramIcon;
  const box = compact ? "h-7 w-7" : "h-9 w-9";
  const ic = compact ? "h-[13px] w-[13px]" : "h-[15px] w-[15px]";
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${LABELS[kind]} — @${handle}`}
      title={`@${handle}`}
      className={`inline-flex ${box} items-center justify-center rounded-[2px] border border-[var(--line-2)] text-[var(--muted)] transition hover:border-spark hover:text-spark focus-visible:text-spark`}
    >
      <Icon className={ic} />
    </Link>
  );
}

// Labeled pill: brand name + platform icon (used for the portfolio row).
export function BrandSocial({
  name,
  kind,
  handle,
  url,
}: {
  name: string;
  kind: "x" | "instagram";
  handle: string;
  url: string;
}) {
  const Icon = kind === "x" ? XIcon : InstagramIcon;
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on ${LABELS[kind]} — @${handle}`}
      title={`@${handle}`}
      className="inline-flex items-center gap-2 rounded-[2px] border border-[var(--line-2)] px-3 py-2 text-[12.5px] text-[var(--muted)] transition hover:border-spark hover:text-spark"
    >
      <span>{name}</span>
      <Icon className="h-[12px] w-[12px]" />
    </Link>
  );
}
