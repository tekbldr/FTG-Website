"use client";

import { useTransition } from "react";
import Link from "next/link";
import { createPost, updatePost, setPostStatus, deletePost } from "@/lib/actions/insights";
import { INSIGHT_TYPES, INSIGHT_VERTICALS } from "@/content/insights";
import type { Post, PostStatus } from "@/lib/posts";

const STATUS_LABEL: Record<PostStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
  archived: "Archived",
};

const lbl = "block font-mono text-[10.5px] uppercase tracking-[.16em] text-[var(--muted-2)] mb-2";
const inp =
  "w-full rounded-[2px] border border-[var(--line-2)] bg-ink px-3 py-2 text-[14px] text-paper focus:border-spark focus:outline-none";

export function PostEditor({ post, canPublish = false }: { post?: Post; canPublish?: boolean }) {
  const [pending, start] = useTransition();
  const save = post ? updatePost.bind(null, post.id) : createPost;

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <Link
            href="/admin/insights"
            className="font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted)] hover:text-paper"
          >
            ← Editorial
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-[-.02em] sm:text-3xl">{post ? "Edit post" : "New post"}</h1>
        </div>
        {post && (
          <span className="rounded-[2px] border border-[var(--line-2)] px-2 py-[5px] font-mono text-[10.5px] uppercase tracking-[.1em] text-[var(--muted)]">
            {STATUS_LABEL[post.status]}
          </span>
        )}
      </header>

      <form action={save} className="mt-7 grid max-w-[760px] gap-5">
        <div>
          <label className={lbl} htmlFor="title">Title</label>
          <input id="title" name="title" required defaultValue={post?.title} className={inp} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="slug">Slug <span className="text-[var(--muted-2)]">(auto from title)</span></label>
            <input id="slug" name="slug" defaultValue={post?.slug} placeholder="from-title" className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="read_time">Read time</label>
            <input id="read_time" name="read_time" defaultValue={post?.read_time ?? ""} placeholder="6 min read" className={inp} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue={post?.type ?? "article"} className={inp}>
              {INSIGHT_TYPES.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl} htmlFor="vertical">Vertical</label>
            <select id="vertical" name="vertical" defaultValue={post?.vertical ?? "The Group"} className={inp}>
              {INSIGHT_VERTICALS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={lbl} htmlFor="dek">Standfirst / excerpt</label>
          <textarea id="dek" name="dek" rows={2} defaultValue={post?.dek ?? ""} className={inp} />
        </div>

        <div>
          <label className={lbl} htmlFor="body">Body</label>
          <textarea id="body" name="body" rows={12} defaultValue={post?.body ?? ""} className={inp + " font-mono text-[13px] leading-[1.7]"} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="author_name">Byline</label>
            <input id="author_name" name="author_name" defaultValue={post?.author_name ?? ""} placeholder="First Tech Group" className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="tags">Tags <span className="text-[var(--muted-2)]">(comma-separated)</span></label>
            <input id="tags" name="tags" defaultValue={post?.tags?.join(", ") ?? ""} className={inp} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="external_url">External URL <span className="text-[var(--muted-2)]">(optional)</span></label>
            <input id="external_url" name="external_url" defaultValue={post?.external_url ?? ""} className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="cover">Cover URL <span className="text-[var(--muted-2)]">(optional)</span></label>
            <input id="cover" name="cover" defaultValue={post?.cover ?? ""} className={inp} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
          <input type="checkbox" name="featured" defaultChecked={post?.featured} className="accent-spark" /> Featured on the
          Insights hub
        </label>

        <div className="flex items-center gap-4 pt-1">
          <button type="submit" disabled={pending} className="btn solid">
            {post ? "Save changes" : "Create draft"}
          </button>
          {post && (
            <Link
              href={`/insights/${post.slug}`}
              className="font-mono text-[12px] uppercase tracking-[.12em] text-[var(--muted)] hover:text-paper"
            >
              Preview ↗
            </Link>
          )}
        </div>
      </form>

      {post && (
        <div className="mt-8 max-w-[760px] border-t border-[var(--line)] pt-6">
          <div className="idx mb-3">WORKFLOW</div>
          <div className="flex flex-wrap items-center gap-3">
            {post.status === "draft" && (
              <button onClick={() => start(() => void setPostStatus(post.id, "in_review"))} disabled={pending} className="btn">
                Submit for review →
              </button>
            )}
            {post.status === "in_review" && (
              <button onClick={() => start(() => void setPostStatus(post.id, "draft"))} disabled={pending} className="btn">
                Return to draft
              </button>
            )}
            {canPublish && post.status !== "published" && (
              <button onClick={() => start(() => void setPostStatus(post.id, "published"))} disabled={pending} className="btn solid">
                Publish
              </button>
            )}
            {canPublish && post.status === "published" && (
              <button onClick={() => start(() => void setPostStatus(post.id, "draft"))} disabled={pending} className="btn">
                Unpublish
              </button>
            )}
            {canPublish && post.status !== "archived" && (
              <button onClick={() => start(() => void setPostStatus(post.id, "archived"))} disabled={pending} className="btn">
                Archive
              </button>
            )}
            {canPublish && (
              <button
                onClick={() => {
                  if (confirm("Delete this post permanently?")) start(() => void deletePost(post.id));
                }}
                disabled={pending}
                className="ml-auto font-mono text-[11px] uppercase tracking-[.12em] text-[var(--muted-2)] hover:text-spark"
              >
                Delete
              </button>
            )}
          </div>
          {!canPublish && <p className="mt-3 text-[12px] text-[var(--muted-2)]">Publishing requires an insights admin.</p>}
        </div>
      )}
    </div>
  );
}
