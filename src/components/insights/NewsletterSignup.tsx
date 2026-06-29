"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Enter a valid email.");
      return;
    }
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setState("done");
      else {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Something went wrong.");
        setState("error");
      }
    } catch {
      setErr("Something went wrong.");
      setState("error");
    }
  }

  return (
    <section className="grid-bg rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-8 sm:p-10" aria-label="Newsletter signup">
      <div className="max-w-[640px]">
        <div className="eyebrow">Newsletter</div>
        <h2 className="mt-3 text-2xl font-bold tracking-[-.02em] sm:text-3xl">The operating stack, in your inbox.</h2>
        <p className="mt-3 text-[15px] text-[var(--muted)]">
          Research, founder stories, and field notes from First Tech Group. No noise.
        </p>
        {state === "done" ? (
          <p className="mt-6 font-mono text-[13px] text-[#7fdca0]">✓ You&apos;re on the list. Welcome.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-wrap gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-label="Email address"
              className="min-w-[240px] flex-1 rounded-[2px] border border-[var(--line-2)] bg-ink px-4 py-3 text-[15px] text-paper placeholder:text-[var(--muted-2)] focus:border-spark focus:outline-none"
            />
            <Button type="submit" variant="spark" disabled={state === "busy"}>
              {state === "busy" ? "…" : "Subscribe →"}
            </Button>
          </form>
        )}
        {err && (
          <p className="mt-2 text-[12px] text-spark" role="alert">
            {err}
          </p>
        )}
      </div>
    </section>
  );
}
