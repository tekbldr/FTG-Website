"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMyRoles, canInsights } from "@/lib/rbac";
import type { PostStatus } from "@/lib/posts";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function gate() {
  const roles = await getMyRoles();
  if (!canInsights(roles)) return null;
  const {
    data: { user },
  } = await createClient().auth.getUser();
  return { roles, userId: user?.id ?? null, isAdmin: roles.includes("insights_admin") || roles.includes("super_admin") };
}

function toRow(fd: FormData) {
  const g = (k: string) => ((fd.get(k) as string) ?? "").trim();
  const title = g("title");
  const tags = g("tags");
  return {
    title,
    slug: g("slug") || slugify(title),
    dek: g("dek") || null,
    body: g("body") || null,
    type: g("type") || "article",
    vertical: g("vertical") || "The Group",
    read_time: g("read_time") || null,
    author_name: g("author_name") || null,
    cover: g("cover") || null,
    external_url: g("external_url") || null,
    featured: fd.get("featured") === "on",
    tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  };
}

function bust(id?: string) {
  revalidatePath("/admin/insights");
  if (id) revalidatePath(`/admin/insights/${id}`);
  revalidatePath("/insights");
}

export async function createPost(fd: FormData) {
  const g = await gate();
  if (!g) return;
  const { data, error } = await createAdminClient()
    .from("posts")
    .insert({ ...toRow(fd), status: "draft", author_id: g.userId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  bust();
  redirect(`/admin/insights/${data.id}`);
}

export async function updatePost(id: string, fd: FormData) {
  const g = await gate();
  if (!g) return;
  const { error } = await createAdminClient().from("posts").update(toRow(fd)).eq("id", id);
  if (error) throw new Error(error.message);
  bust(id);
}

export async function setPostStatus(id: string, status: PostStatus) {
  const g = await gate();
  if (!g) return { ok: false, error: "Not authorized." };
  // Publishing / archiving is an insights-admin (or super-admin) action.
  if ((status === "published" || status === "archived") && !g.isAdmin) {
    return { ok: false, error: "Needs an insights admin." };
  }
  const patch: Record<string, unknown> = { status };
  if (status === "published") patch.published_at = new Date().toISOString();
  const { error } = await createAdminClient().from("posts").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bust(id);
  return { ok: true };
}

export async function deletePost(id: string) {
  const g = await gate();
  if (!g || !g.isAdmin) return;
  await createAdminClient().from("posts").delete().eq("id", id);
  bust(id);
  redirect("/admin/insights");
}
