import type { MetadataRoute } from "next";

// Public marketing/content is open to everyone — including AI crawlers, which
// we list explicitly as a signal of intent (AEO/LLM visibility is a goal, not
// an accident). Private surfaces stay blocked for every agent.
const DISALLOW = ["/admin", "/portal", "/api", "/login", "/signup", "/auth"];
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: "https://www.ftg.vc/sitemap.xml",
    host: "https://www.ftg.vc",
  };
}
