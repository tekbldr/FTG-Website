import type { MetadataRoute } from "next";
import { getPublishedInsights } from "@/lib/posts";
import { products } from "@/content/products";
import { LEGAL_DOCS } from "@/content/legal";

const SITE = "https://www.ftg.vc";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let insights: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedInsights();
    insights = posts.map((p) => ({
      url: `${SITE}/insights/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly",
      priority: p.featured ? 0.8 : 0.6,
    }));
  } catch {
    // sitemap must never hard-fail the build
  }

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const legalPages: MetadataRoute.Sitemap = LEGAL_DOCS.map((d) => ({
    url: `${SITE}/legal/${d.slug}`,
    lastModified: new Date(d.updated),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/insights`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/pitch`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/pitch/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/pitch/what-good-looks-like`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/trust`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [...staticPages, ...productPages, ...insights, ...legalPages];
}
