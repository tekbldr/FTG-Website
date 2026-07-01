import { createClient } from "@/lib/supabase/server";
import type { Insight, InsightType, InsightVertical } from "@/content/insights";

export type PostStatus = "draft" | "in_review" | "published" | "archived";

export type Post = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  body: string | null;
  type: string;
  vertical: string;
  cover: string | null;
  read_time: string | null;
  external_url: string | null;
  featured: boolean;
  tags: string[];
  status: PostStatus;
  author_id: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const POST_STATUSES: PostStatus[] = ["draft", "in_review", "published", "archived"];
export const STATUS_LABEL: Record<PostStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
  archived: "Archived",
};

const RECENT_DAYS = 45;

// Map a DB post onto the Insight shape the public components already expect.
export function postToInsight(p: Post): Insight {
  const date = p.published_at ?? p.created_at;
  const isNew = date ? Date.now() - new Date(date).getTime() < RECENT_DAYS * 864e5 : false;
  return {
    slug: p.slug,
    type: (p.type as InsightType) ?? "article",
    vertical: (p.vertical as InsightVertical) ?? "The Group",
    title: p.title,
    excerpt: p.dek ?? "",
    author: p.author_name ?? "First Tech Group",
    date,
    readTime: p.read_time ?? "",
    featured: p.featured,
    isNew,
    tags: p.tags ?? [],
    body: p.body ?? undefined,
    cover: p.cover ?? undefined,
  };
}

export async function getPublishedInsights(): Promise<Insight[]> {
  const sb = createClient();
  const { data } = await sb.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false });
  return ((data as Post[]) ?? []).map(postToInsight);
}

export async function getPublishedPostBySlug(slug: string): Promise<Insight | null> {
  const sb = createClient();
  const { data } = await sb.from("posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return data ? postToInsight(data as Post) : null;
}

// Staff views — RLS lets insights editors/admins read every status.
export async function getAllPosts(): Promise<Post[]> {
  const sb = createClient();
  const { data } = await sb.from("posts").select("*").order("updated_at", { ascending: false });
  return (data as Post[]) ?? [];
}

export async function getPostById(id: string): Promise<Post | null> {
  const sb = createClient();
  const { data } = await sb.from("posts").select("*").eq("id", id).maybeSingle();
  return (data as Post) ?? null;
}
