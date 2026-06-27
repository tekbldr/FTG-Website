"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, submissionReceivedEmail } from "@/lib/email";
import type { PitchPayload, PitchResult } from "@/lib/pitch";

// Submit a founder pitch. Owner rows (founder, submission, documents) via RLS;
// the privileged initial stage-history row via the service-role client.
export async function submitPitch(p: PitchPayload): Promise<PitchResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session expired — please sign in again." };

  if (!p.companyName?.trim() || !p.oneLiner?.trim() || !p.founderName?.trim() || !p.founderEmail?.trim()) {
    return { ok: false, error: "Company name, one-liner, and your name + email are required." };
  }

  const { data: program } = await supabase
    .from("programs")
    .select("id,status")
    .eq("id", p.programId)
    .maybeSingle();
  if (!program || !["open", "in_review"].includes(program.status as string)) {
    return { ok: false, error: "This program is no longer accepting submissions." };
  }

  // Upsert founder profile.
  const fFields = {
    user_id: user.id,
    name: p.founderName.trim(),
    email: p.founderEmail.trim(),
    organization: p.companyName.trim(),
    website: p.website?.trim() || null,
    bio: p.bio?.trim() || null,
  };
  const { data: existingF } = await supabase.from("founders").select("id").eq("user_id", user.id).maybeSingle();
  let founderId = existingF?.id as string | undefined;
  if (founderId) {
    await supabase.from("founders").update(fFields).eq("id", founderId);
  } else {
    const { data: ins, error } = await supabase.from("founders").insert(fFields).select("id").single();
    if (error || !ins) return { ok: false, error: "Could not save your founder profile." };
    founderId = ins.id as string;
  }

  // Already submitted to this program?
  const { data: dup } = await supabase
    .from("submissions")
    .select("id")
    .eq("founder_id", founderId)
    .eq("program_id", p.programId)
    .maybeSingle();
  if (dup) redirect("/portal/founder");

  const { data: stage } = await supabase
    .from("pitch_stages")
    .select("id")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  const stageId = (stage?.id as string | undefined) ?? null;

  const now = new Date().toISOString();
  const details = { traction: p.traction?.trim() || "", whyNow: p.whyNow?.trim() || "" };

  const { data: sub, error: subErr } = await supabase
    .from("submissions")
    .insert({
      founder_id: founderId,
      program_id: p.programId,
      title: p.companyName.trim(),
      company_name: p.companyName.trim(),
      one_liner: p.oneLiner.trim(),
      sector: p.sector || null,
      stage_of_company: p.stageOfCompany || null,
      amount_requested: p.amountRequested ?? null,
      currency: p.currency || "USD",
      details,
      current_stage_id: stageId,
      status: "submitted",
      submitted_at: now,
      frozen_at: now,
    })
    .select("id")
    .single();
  if (subErr || !sub) {
    return { ok: false, error: "Could not submit. You may have already submitted to this program." };
  }
  const submissionId = sub.id as string;

  for (const d of p.documents) {
    await supabase.from("documents").insert({
      submission_id: submissionId,
      type: d.type,
      file_key: d.key,
      file_name: d.fileName,
      mime_type: d.mime,
      size_bytes: d.size,
      scan_status: d.scanStatus || "pending",
    });
  }

  if (stageId) {
    const admin = createAdminClient();
    await admin.from("submission_stage_history").insert({
      submission_id: submissionId,
      from_stage_id: null,
      to_stage_id: stageId,
      changed_by: user.id,
      reason: "Submitted",
    });
  }

  // Confirmation email (best-effort).
  try {
    await sendEmail(
      submissionReceivedEmail({ to: p.founderEmail.trim(), name: p.founderName.trim(), company: p.companyName.trim() })
    );
  } catch {
    /* email is non-critical */
  }

  redirect("/portal/founder");
}
