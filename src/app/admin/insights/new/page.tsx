import { redirect } from "next/navigation";
import { getMyRoles, canInsights } from "@/lib/rbac";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "New post — FTG Admin" };

export default async function NewPost() {
  if (!canInsights(await getMyRoles())) redirect("/admin");
  return <PostEditor />;
}
