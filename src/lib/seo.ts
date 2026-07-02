// ============================================================================
// SEO / structured-data helpers. Central place for canonical URL building,
// per-page metadata, and schema.org JSON-LD graphs (Organization, Breadcrumb,
// Product/SoftwareApplication, ProfilePage, FAQPage). Keeps every page's SEO
// consistent and machine-readable for search engines and LLMs alike.
// ============================================================================
import type { Metadata } from "next";
import { site, socials } from "@/content/site";

export const SITE_URL = "https://www.ftg.vc";
export const ORG_ID = `${SITE_URL}/#organization`;

export function absoluteUrl(path = "/"): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Per-page metadata with a canonical URL + OpenGraph/Twitter, on top of the
// root layout defaults. `path` is the route (e.g. "/exx1").
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(opts.path);
  const images = opts.image ? [{ url: opts.image }] : undefined;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      type: opts.type ?? "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      ...(images ? { images: [opts.image as string] } : {}),
    },
  };
}

// FTG as a schema.org Organization. Referenced by @id from other graphs so
// products/articles can point back to one canonical publisher node.
export function organizationSchema(): Record<string, unknown> {
  const sameAs = socials.ftg.map((s) => s.url);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    alternateName: site.short,
    url: SITE_URL,
    logo: absoluteUrl("/ftg-mark.png"),
    image: absoluteUrl("/og.png"),
    description:
      "First Tech Group is a venture firm that funds, builds, and operates the companies rebuilding the digital economy — markets, money, and intelligence, owned as one stack.",
    email: site.email,
    slogan: site.tagline,
    sameAs,
    knowsAbout: [
      "digital-asset exchanges",
      "non-custodial wallets",
      "applied AI",
      "Arabic-first AI",
      "privacy technology",
      "venture capital",
    ],
  };
}

// The site itself as a schema.org node, tied to the Organization.
export function webSiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: site.name,
    description:
      "First Tech Group funds, builds, and operates digital-economy infrastructure — the Exx1 exchange, PRV Wallet, the PRVAI applied-AI division (Diwan OS, PRV Copilot), and the EQWT1 trading platform.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.path),
    })),
  };
}

// A product/app node that credits FTG as publisher/owner.
export function productSchema(opts: {
  name: string;
  slug: string;
  description: string;
  image?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    url: absoluteUrl(`/${opts.slug}`),
    description: opts.description,
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    brand: { "@type": "Brand", name: opts.name },
    manufacturer: { "@id": ORG_ID },
  };
}

export function faqSchema(items: { q: string; a: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

// Google-indexable job posting for /careers/[slug] pages.
export function jobPostingSchema(job: {
  title: string;
  slug: string;
  description: string;
  datePosted?: string;
  employmentType?: string;
  location?: string;
  remote?: boolean;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    url: absoluteUrl(`/careers/${job.slug}`),
    description: job.description,
    ...(job.datePosted ? { datePosted: job.datePosted } : {}),
    ...(job.employmentType ? { employmentType: job.employmentType } : {}),
    hiringOrganization: { "@id": ORG_ID },
    ...(job.location
      ? {
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: job.location },
          },
        }
      : {}),
    ...(job.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
  };
}

export function profilePageSchema(person: {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: person.name,
      ...(person.jobTitle ? { jobTitle: person.jobTitle } : {}),
      ...(person.description ? { description: person.description } : {}),
      ...(person.image ? { image: absoluteUrl(person.image) } : {}),
      worksFor: { "@id": ORG_ID },
      ...(person.sameAs && person.sameAs.length ? { sameAs: person.sameAs } : {}),
    },
  };
}
