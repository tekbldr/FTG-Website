"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Input } from "@/components/ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/portal";
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Live mismatch check (only once the user has started typing the confirmation).
  const mismatch = mode === "signup" && confirmPassword.length > 0 && password !== confirmPassword;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    if (mode === "signup") {
      if (password !== confirmPassword) {
        setErr("Passwords don't match. Please re-enter them.");
        setBusy(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) setErr(error.message);
      else if (data.session) {
        // Confirmation disabled → user is signed in immediately.
        router.push(next);
        router.refresh();
      } else {
        setMsg("Check your email to confirm your account, then sign in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
      else {
        router.push(next);
        router.refresh();
      }
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 max-w-[420px]">
      {mode === "signup" && (
        <Field label="Full name" htmlFor="fn" required>
          <Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
        </Field>
      )}
      <Field label="Email" htmlFor="em" required>
        <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </Field>
      <Field label="Password" htmlFor="pw" required hint={mode === "signup" ? "At least 8 characters." : undefined}>
        <Input
          id="pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </Field>
      {mode === "signup" && (
        <Field label="Confirm password" htmlFor="pw2" required error={mismatch ? "Passwords don't match." : undefined}>
          <Input
            id="pw2"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            aria-invalid={mismatch || undefined}
          />
        </Field>
      )}
      {err && (
        <p className="text-spark text-[13px]" role="alert">
          {err}
        </p>
      )}
      {msg && <p className="text-[#7fdca0] text-[13px]">{msg}</p>}
      <Button type="submit" variant="spark" disabled={busy || mismatch}>
        {busy ? "…" : mode === "signup" ? "Create account →" : "Sign in →"}
      </Button>
    </form>
  );
}
