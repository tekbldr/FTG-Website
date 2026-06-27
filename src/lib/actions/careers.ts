"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, applicationReceivedEmail } from "@/lib/email";
import type { ApplyPayload, ApplyResult } from "@/lib/careers";

// Submit a job application. Owner-owned rows (candidate, application, attachment)
// are written via the RLS-scoped client; the privileged initial stage-history row
// is written with the service-role client (RLS requires recruiter to insert it).
export async function submitApplication(payload: ApplyPayload): Promise<ApplyResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session expired — please sign in again." };

  if (!payload.firstName?.trim() || !payload.lastName?.trim() || !payload.email?.trim()) {
    return { ok: false, error: "First name, last name, and email are required." };
  }

  // Role must still be open.
  const { data: job } = await supabase
    .from("jobs")
    .select("id,status,title")
    .eq("id", payload.jobId)
    .maybeSingle();
  if (!job || job.status !== "open") {
    return { ok: false, error: "This role is no longer accepting applications." };
  }

  // Upsert the candidate profile (1:1 with the user).
  const candFields = {
    user_id: user.id,
    first_name: payload.firstName.trim(),
    last_name: payload.lastName.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() || null,
    linkedin_url: payload.linkedin?.trim() || null,
    location: payload.location?.trim() || null,
  };
  const { data: existingCand } = await supabase
    .from("candidates")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  let candidateId = existingCand?.id as string | undefined;
  if (candidateId) {
    await supabase.from("candidates").update(candFields).eq("id", candidateId);
  } else {
    const { data: ins, error: insErr } = await supabase
      .from("candidates")
      .insert(candFields)
      .select("id")
      .single();
    if (insErr || !ins) return { ok: false, error: "Could not save your candidate profile." };
    candidateId = ins.id as string;
  }

  // Already applied? Send them to their dashboard.
  const { data: dup } = await supabase
    .from("applications")
    .select("id")
    .eq("candidate_id", candidateId)
    .eq("job_id", payload.jobId)
    .maybeSingle();
  if (dup) redirect("/portal/candidate");

  // First ATS stage ("Applied").
  const { data: stage } = await supabase
    .from("ats_stages")
    .select("id")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  const stageId = (stage?.id as string | undefined) ?? null;

  // Create the application (owner insert allowed by RLS).
  const { data: app, error: appErr } = await supabase
    .from("applications")
    .insert({
      candidate_id: candidateId,
      job_id: payload.jobId,
      current_stage_id: stageId,
      status: "active",
      cover_note: payload.coverNote?.trim() || null,
    })
    .select("id")
    .single();
  if (appErr || !app) {
    return { ok: false, error: "Could not submit your application. You may have already applied." };
  }
  const applicationId = app.id as string;

  // Attach the résumé record (the file is already in storage + scanned).
  if (payload.resume) {
    await supabase.from("attachments").insert({
      candidate_id: candidateId,
      application_id: applicationId,
      type: "resume",
      file_key: payload.resume.key,
      file_name: payload.resume.fileName,
      mime_type: payload.resume.mime,
      size_bytes: payload.resume.size,
      scan_status: payload.resume.scanStatus || "pending",
    });
  }

  // Initial stage-history row — privileged write, so use the service-role client.
  if (stageId) {
    const admin = createAdminClient();
    await admin.from("application_stage_history").insert({
      application_id: applicationId,
      from_stage_id: null,
      to_stage_id: stageId,
      changed_by: user.id,
      reason: "Application submitted",
    });
  }

  // Confirmation email (best-effort).
  try {
    await sendEmail(
      applicationReceivedEmail({ to: payload.email.trim(), name: payload.firstName.trim(), jobTitle: job.title })
    );
  } catch {
    /* email is non-critical */
  }

  redirect("/portal/candidate");
}
