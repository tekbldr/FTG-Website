import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/portal", "/api", "/login", "/signup", "/auth"],
    },
    sitemap: "https://www.ftg.vc/sitemap.xml",
    host: "https://www.ftg.vc",
  };
}
