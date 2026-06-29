"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMyRoles, canInsights } from "@/lib/rbac";
import type { PostStatus } from "@/lib/posts";
import { logAudit } from "@/lib/audit";

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
  const row = toRow(fd);
  const { data, error } = await createAdminClient()
    .from("posts")
    .insert({ ...row, status: "draft", author_id: g.userId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await logAudit({ action: "post.create", entityType: "post", entityId: data.id, summary: `Created "${row.title}"` });
  bust();
  redirect(`/admin/insights/${data.id}`);
}

export async function updatePost(id: string, fd: FormData) {
  const g = await gate();
  if (!g) return;
  const row = toRow(fd);
  const { error } = await createAdminClient().from("posts").update(row).eq("id", id);
  if (error) throw new Error(error.message);
  await logAudit({ action: "post.update", entityType: "post", entityId: id, summary: `Edited "${row.title}"` });
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
  await logAudit({ action: "post.status", entityType: "post", entityId: id, summary: `Status → ${status}`, meta: { status } });
  bust(id);
  return { ok: true };
}

export async function deletePost(id: string) {
  const g = await gate();
  if (!g || !g.isAdmin) return;
  await createAdminClient().from("posts").delete().eq("id", id);
  await logAudit({ action: "post.delete", entityType: "post", entityId: id });
  bust(id);
  redirect("/admin/insights");
}
