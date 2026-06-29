import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Newsletter capture. Logs the subscription and, if a `newsletter_subscribers`
// table exists, records it. Wire to a real list provider (Resend audience /
// Mailchimp) when ready — the form + endpoint contract stays the same.
export async function POST(req: Request) {
  let email = "";
  try {
    ({ email } = (await req.json()) as { email: string });
  } catch {
    /* ignore */
  }
  email = (email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 422 });
  }

  console.log("[newsletter] subscribe:", email);
  try {
    await createAdminClient().from("newsletter_subscribers").insert({ email });
  } catch {
    /* table is optional in v1 */
  }

  return NextResponse.json({ ok: true });
}
