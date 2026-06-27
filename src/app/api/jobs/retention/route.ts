import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Retention / right-to-erasure job. Deletes data for UNSUCCESSFUL applicants and
// declined founder submissions older than the retention window (default 6 months),
// including their files in storage. Triggered on a schedule (see vercel.json).
//
// Secured with CRON_SECRET: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const months = Number(process.env.RETENTION_MONTHS || "6");
  const cutoff = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString();
  const admin = createAdminClient();
  const result = { cutoff, attachmentsDeleted: 0, applicationsDeleted: 0, documentsDeleted: 0, submissionsDeleted: 0 };

  // --- Careers: rejected/withdrawn applications past the window ---
  const { data: apps } = await admin
    .from("applications")
    .select("id")
    .in("status", ["rejected", "withdrawn"])
    .lt("updated_at", cutoff);
  const appIds = (apps ?? []).map((a) => a.id as string);
  if (appIds.length) {
    const { data: atts } = await admin
      .from("attachments")
      .select("id,file_key")
      .in("application_id", appIds);
    const keys = (atts ?? []).map((a) => a.file_key as string).filter(Boolean);
    if (keys.length) {
      await admin.storage.from("resumes").remove(keys);
      result.attachmentsDeleted = keys.length;
    }
    // FK cascade removes attachments, stage history, and scorecards with the app.
    await admin.from("applications").delete().in("id", appIds);
    result.applicationsDeleted = appIds.length;
  }

  // --- Pitch: declined submissions past the window ---
  const { data: subs } = await admin
    .from("submissions")
    .select("id")
    .eq("status", "declined")
    .lt("updated_at", cutoff);
  const subIds = (subs ?? []).map((s) => s.id as string);
  if (subIds.length) {
    const { data: docs } = await admin.from("documents").select("file_key").in("submission_id", subIds);
    const keys = (docs ?? []).map((d) => d.file_key as string).filter(Boolean);
    if (keys.length) {
      await admin.storage.from("pitch-docs").remove(keys);
      result.documentsDeleted = keys.length;
    }
    await admin.from("submissions").delete().in("id", subIds);
    result.submissionsDeleted = subIds.length;
  }

  return NextResponse.json({ ok: true, ...result });
}
