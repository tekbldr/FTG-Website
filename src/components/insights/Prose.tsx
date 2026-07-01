import Link from "next/link";
import React from "react";

// Minimal, controlled Markdown renderer for editorial bodies. Supports:
// ## h2, ### h3, > blockquote, - / * bullets, 1. ordered lists, --- hr,
// paragraphs, **bold**, *italic*, and [text](url). Styled to the FTG system.

function inline(text: string, key: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) nodes.push(<strong key={key + i}>{m[2]}</strong>);
    else if (m[3] !== undefined) nodes.push(<em key={key + i}>{m[3]}</em>);
    else if (m[4] !== undefined) {
      const href = m[5];
      const external = /^https?:/.test(href);
      nodes.push(
        external ? (
          <a key={key + i} href={href} target="_blank" rel="noopener noreferrer" className="text-spark underline underline-offset-2 hover:text-paper">
            {m[4]}
          </a>
        ) : (
          <Link key={key + i} href={href} className="text-spark underline underline-offset-2 hover:text-paper">
            {m[4]}
          </Link>
        )
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Prose({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const out: React.ReactNode[] = [];
  let i = 0;
  for (const raw of blocks) {
    const b = raw.trim();
    if (!b) continue;
    const k = "b" + i++;
    if (b.startsWith("### ")) {
      out.push(
        <h3 key={k} className="mb-2 mt-8 text-lg font-bold text-paper">
          {inline(b.slice(4), k)}
        </h3>
      );
    } else if (b.startsWith("## ")) {
      out.push(
        <h2 key={k} className="mb-3 mt-11 text-[26px] font-bold leading-[1.15] tracking-[-.01em] text-paper" style={{ textWrap: "balance" }}>
          {inline(b.slice(3), k)}
        </h2>
      );
    } else if (b === "---") {
      out.push(<hr key={k} className="my-9 border-[var(--line)]" />);
    } else if (b.startsWith("> ")) {
      const t = b.split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ");
      out.push(
        <blockquote key={k} className="my-7 border-l-2 border-spark pl-5 text-[19px] font-medium italic leading-[1.5] text-paper/90">
          {inline(t, k)}
        </blockquote>
      );
    } else if (/^(-|\*) /.test(b)) {
      const items = b.split("\n").filter((l) => /^(-|\*) /.test(l)).map((l) => l.replace(/^(-|\*)\s/, ""));
      out.push(
        <ul key={k} className="my-4 list-disc space-y-2 pl-5 marker:text-spark">
          {items.map((it, j) => (
            <li key={j} className="pl-1">
              {inline(it, k + j)}
            </li>
          ))}
        </ul>
      );
    } else if (/^\d+\. /.test(b)) {
      const items = b.split("\n").filter((l) => /^\d+\. /.test(l)).map((l) => l.replace(/^\d+\.\s/, ""));
      out.push(
        <ol key={k} className="my-4 list-decimal space-y-2 pl-5 font-mono marker:text-[var(--muted-2)] [&_li]:font-sans">
          {items.map((it, j) => (
            <li key={j} className="pl-1">
              {inline(it, k + j)}
            </li>
          ))}
        </ol>
      );
    } else {
      out.push(
        <p key={k} className="my-4">
          {inline(b, k)}
        </p>
      );
    }
  }
  return (
    <div className="text-[16.5px] leading-[1.75] text-[var(--muted)] [&_em]:text-paper/90 [&_strong]:font-semibold [&_strong]:text-paper">
      {out}
    </div>
  );
}
