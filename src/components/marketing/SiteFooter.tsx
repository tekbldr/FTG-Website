import Link from "next/link";
import { Logo } from "@/components/brand";
import { footer, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div className="col foot-brand">
            <Logo size={30} />
            <span className="mt-3 block">{site.tagline}.</span>
          </div>
          {footer.columns.map((col) => (
            <div className="col" key={col.title}>
              <h5>{col.title}</h5>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footnote">
          <span>{footer.note}</span>
          <span>{footer.edition}</span>
        </div>
      </div>
    </footer>
  );
}
