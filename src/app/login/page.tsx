import { Suspense } from "react";
import Link from "next/link";
import { TopNav } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";
import { Eyebrow } from "@/components/ui";

export default function LoginPage() {
  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-5 sm:px-8 py-20">
        <Eyebrow>Sign in</Eyebrow>
        <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-[var(--muted)]">Access your applications and submissions.</p>
        <div className="mt-8">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>
        <p className="mt-6 text-[14px] text-[var(--muted)]">
          New here?{" "}
          <Link href="/signup" className="text-spark">
            Create an account
          </Link>
        </p>
      </main>
    </>
  );
}
