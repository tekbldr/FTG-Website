import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyRoles, canInsights } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/ui";
import { getAllPosts, STATUS_LABEL, type PostStatus } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Insights — FTG Admin" };

const STATUS_STYLE: Record<PostStatus, string> = {
  published: "border-[rgba(255,94,44,.4)] text-spark",
  in_review: "border-[var(--line-2)] text-paper",
  draft: "border-[var(--line-2)] text-[var(--muted)]",
  archived: "border-[var(--line)] text-[var(--muted-2)]",
};

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

export default async function AdminInsights() {
  if (!canInsights(await getMyRoles())) redirect("/admin");
  const posts = await getAllPosts();

  const counts = posts.reduce<Record<string, number>>((m, p) => ((m[p.status] = (m[p.status] ?? 0) + 1), m), {});

  return (
    <div>
      <AdminPageHeader
        eyebrow="Insights · CMS"
        title="Editorial"
        description="Write, review, and publish across the editorial workflow — drafts to published, one table."
        meta={
          <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[.1em] text-[var(--muted-2)]">
            {(["published", "in_review", "draft", "archived"] as PostStatus[]).map((s) => (
              <span key={s}>
                {counts[s] ?? 0} {STATUS_LABEL[s].toLowerCase()}
              </span>
            ))}
          </div>
        }
        actions={
          <Link href="/admin/insights/new" className="btn solid">
            New post
          </Link>
        }
      />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-[var(--line)] font-mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted-2)]">
              <th className="py-3 pr-4 font-normal">Title</th>
              <th className="py-3 pr-4 font-normal">Type · Vertical</th>
              <th className="py-3 pr-4 font-normal">Status</th>
              <th className="py-3 pr-4 font-normal">Updated</th>
              <th className="py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-[var(--line)]">
                <td className="py-4 pr-4">
                  <Link href={`/admin/insights/${p.id}`} className="text-[14px] font-bold hover:text-spark">
                    {p.title}
                  </Link>
                  {p.featured && (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[.1em] text-spark">★ featured</span>
                  )}
                </td>
                <td className="py-4 pr-4 font-mono text-[11px] uppercase tracking-[.08em] text-[var(--muted)]">
                  {p.type} · {p.vertical}
                </td>
                <td className="py-4 pr-4">
                  <span
                    className={
                      "rounded-[2px] border px-2 py-[4px] font-mono text-[10px] uppercase tracking-[.1em] " +
                      STATUS_STYLE[p.status]
                    }
                  >
                    {STATUS_LABEL[p.status]}
                  </span>
                </td>
                <td className="py-4 pr-4 font-mono text-[11px] text-[var(--muted-2)]">{fmtDate(p.updated_at)}</td>
                <td className="py-4">
                  <Link
                    href={`/admin/insights/${p.id}`}
                    className="font-mono text-[11px] uppercase tracking-[.12em] text-[var(--muted)] hover:text-spark"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[var(--muted-2)]">
                  No posts yet. Create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
