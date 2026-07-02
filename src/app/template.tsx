// Per-navigation wrapper: a barely-there fade+rise on route change. Runs on
// every page (portal/admin included) so keep it fast and quiet; the global
// reduced-motion rule collapses it to instant.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
