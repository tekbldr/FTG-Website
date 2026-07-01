import type { MetadataRoute } from "next";
import { getPublishedInsights } from "@/lib/posts";

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

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/insights`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/pitch`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  return [...staticPages, ...insights];
}
