import Link from "next/link";
import { Logo } from "@/components/brand";
import { footer, site, socials } from "@/content/site";
import { SocialLink, BrandSocial } from "@/components/marketing/SocialIcons";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div className="col foot-brand">
            <Logo size={30} />
            <span className="mt-3 block">{site.tagline}.</span>
            <div className="mt-4 flex items-center gap-2">
              {socials.ftg.map((s) => (
                <SocialLink key={s.url} kind={s.kind} handle={s.handle} url={s.url} />
              ))}
            </div>
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

        {/* Portfolio on X */}
        <div className="mt-10 pt-7 border-t border-[var(--line)]">
          <h5 className="font-mono text-[11px] uppercase tracking-[.26em] text-[var(--muted-2)] mb-3">Portfolio on X</h5>
          <div className="flex flex-wrap gap-2">
            {socials.portfolio.map((s) => (
              <BrandSocial key={s.url} name={s.name} kind={s.kind} handle={s.handle} url={s.url} />
            ))}
          </div>
        </div>

        <div className="footnote">
          <span>{footer.note}</span>
          <span>{footer.edition}</span>
        </div>
      </div>
    </footer>
  );
}
