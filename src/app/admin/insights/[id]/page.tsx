import { notFound, redirect } from "next/navigation";
import { getMyRoles, canInsights, isSuperAdmin } from "@/lib/rbac";
import { getPostById } from "@/lib/posts";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post — FTG Admin" };

export default async function EditPost({ params }: { params: { id: string } }) {
  const roles = await getMyRoles();
  if (!canInsights(roles)) redirect("/admin");
  const post = await getPostById(params.id);
  if (!post) notFound();
  const canPublish = roles.includes("insights_admin") || isSuperAdmin(roles);
  return <PostEditor post={post} canPublish={canPublish} />;
}
