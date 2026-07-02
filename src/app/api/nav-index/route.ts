import { NextResponse } from "next/server";
import { getPublishedInsights } from "@/lib/posts";

export const dynamic = "force-dynamic";

// Lightweight index for the ⌘K command palette: published insight titles.
// Static pages are bundled client-side; only the DB-backed content is fetched.
export async function GET() {
  try {
    const posts = await getPublishedInsights();
    return NextResponse.json(
      {
        insights: posts.slice(0, 40).map((p) => ({
          label: p.title,
          href: `/insights/${p.slug}`,
        })),
      },
      { headers: { "Cache-Control": "public, max-age=300" } }
    );
  } catch {
    return NextResponse.json({ insights: [] });
  }
}
