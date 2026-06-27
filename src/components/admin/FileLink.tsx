"use client";

import { useState } from "react";

// Opens a gated, short-lived signed URL for an attachment/document. The server
// verifies ownership/assignment + clean scan before issuing the link.
export function FileLink({
  id,
  scope,
  label,
}: {
  id: string;
  scope: "attachment" | "document";
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function open() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/files/download?id=${id}&scope=${scope}`);
      const j = (await res.json()) as { url?: string; error?: string };
      if (j.url) window.open(j.url, "_blank", "noopener");
      else setErr(j.error || "Unavailable");
    } catch {
      setErr("Unavailable");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={busy}
      className="font-mono text-[11px] uppercase tracking-[.1em] text-spark hover:underline disabled:opacity-50"
    >
      {busy ? "…" : err ? err : `↓ ${label}`}
    </button>
  );
}
