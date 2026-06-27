import { Suspense } from "react";
import Link from "next/link";
import { TopNav } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";
import { Eyebrow } from "@/components/ui";

export default function SignupPage() {
  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-5 sm:px-8 py-20">
        <Eyebrow>Create account</Eyebrow>
        <h1 className="mt-4 text-3xl font-bold">Join First Tech Group</h1>
        <p className="mt-2 text-[var(--muted)]">
          One account to apply for roles and submit pitches.
        </p>
        <div className="mt-8">
          <Suspense>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
        <p className="mt-6 text-[14px] text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-spark">
            Sign in
          </Link>
        </p>
      </main>
    </>
  );
}
