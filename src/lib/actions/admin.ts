"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, applicationStageEmail, submissionStageEmail } from "@/lib/email";

// ---------------------------------------------------------------- Careers
// Move an application to a new ATS stage (recruiter/admin). Privileged write via
// the service-role client; appends to application_stage_history + notifies the candidate.
export async function moveApplicationStage(applicationId: string, toStageId: string) {
  const profile = await requireRole("recruiter");
  const supabase = createClient();
  const { data: app } = await supabase
    .from("applications")
    .select("current_stage_id")
    .eq("id", applicationId)
    .maybeSingle();
  const fromStageId = (app?.current_stage_id as string | null) ?? null;
  if (fromStageId === toStageId) return { ok: true };

  const admin = createAdminClient();
  const { data: stage } = await admin.from("ats_stages").select("stage_type,name").eq("id", toStageId).maybeSingle();
  const stageType = stage?.stage_type as string | undefined;
  const status = stageType === "hired" ? "hired" : stageType === "rejected" ? "rejected" : "active";

  await admin.from("applications").update({ current_stage_id: toStageId, status }).eq("id", applicationId);
  await admin.from("application_stage_history").insert({
    application_id: applicationId,
    from_stage_id: fromStageId,
    to_stage_id: toStageId,
    changed_by: profile.id,
    reason: "Stage updated",
  });

  // Notify the candidate (best-effort; never blocks the move).
  try {
    const { data: info } = await admin
      .from("applications")
      .select("candidates(email,first_name), jobs(title)")
      .eq("id", applicationId)
      .single<{ candidates: { email: string; first_name: string | null } | null; jobs: { title: string } | null }>();
    const to = info?.candidates?.email;
    if (to) {
      await sendEmail(
        applicationStageEmail({ to, name: info?.candidates?.first_name, jobTitle: info?.jobs?.title, stageName: stage?.name })
      );
    }
  } catch {
    /* email is non-critical */
  }

  revalidatePath("/admin/recruiting");
  return { ok: true };
}

// ---------------------------------------------------------------- Pitch
// Move a submission to a new pitch stage (admin). Updates status + notifies the founder.
export async function moveSubmissionStage(submissionId: string, toStageId: string) {
  const profile = await requireRole("reviewer");
  if (profile.role !== "admin") return { ok: false, error: "Only admins can move submissions." };
  const supabase = createClient();
  const { data: sub } = await supabase
    .from("submissions")
    .select("current_stage_id")
    .eq("id", submissionId)
    .maybeSingle();
  const fromStageId = (sub?.current_stage_id as string | null) ?? null;
  if (fromStageId === toStageId) return { ok: true };

  const admin = createAdminClient();
  const { data: stage } = await admin.from("pitch_stages").select("stage_type,name").eq("id", toStageId).maybeSingle();
  const stageType = stage?.stage_type as string | undefined;
  const status = stageType === "funded" ? "funded" : stageType === "declined" ? "declined" : "under_review";

  await admin.from("submissions").update({ current_stage_id: toStageId, status }).eq("id", submissionId);
  await admin.from("submission_stage_history").insert({
    submission_id: submissionId,
    from_stage_id: fromStageId,
    to_stage_id: toStageId,
    changed_by: profile.id,
    reason: "Stage updated",
  });

  try {
    const { data: info } = await admin
      .from("submissions")
      .select("company_name, founders(email,name)")
      .eq("id", submissionId)
      .single<{ company_name: string | null; founders: { email: string; name: string | null } | null }>();
    const to = info?.founders?.email;
    if (to) {
      await sendEmail(
        submissionStageEmail({ to, name: info?.founders?.name, company: info?.company_name, stageName: stage?.name })
      );
    }
  } catch {
    /* email is non-critical */
  }

  revalidatePath("/admin/review");
  return { ok: true };
}

// Save the signed-in reviewer's scorecard (overall + per-criterion).
export async function saveReview(input: {
  submissionId: string;
  overall: number | null;
  recommendation: "fund" | "discuss" | "decline" | null;
  comments: string;
  scores: { criterionId: string; score: number }[];
}) {
  const profile = await requireRole("reviewer");
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("submission_id", input.submissionId)
    .eq("reviewer_id", profile.id)
    .maybeSingle();

  let reviewId = existing?.id as string | undefined;
  const fields = {
    submission_id: input.submissionId,
    reviewer_id: profile.id,
    overall_score: input.overall,
    recommendation: input.recommendation,
    comments: input.comments || null,
    submitted_at: new Date().toISOString(),
  };
  if (reviewId) {
    await supabase.from("reviews").update(fields).eq("id", reviewId);
  } else {
    const { data: ins, error } = await supabase.from("reviews").insert(fields).select("id").single();
    if (error || !ins) return { ok: false, error: "Could not save your review." };
    reviewId = ins.id as string;
  }

  for (const s of input.scores) {
    const { data: ex } = await supabase
      .from("review_scores")
      .select("id")
      .eq("review_id", reviewId)
      .eq("criterion_id", s.criterionId)
      .maybeSingle();
    if (ex?.id) {
      await supabase.from("review_scores").update({ score: s.score }).eq("id", ex.id);
    } else {
      await supabase.from("review_scores").insert({ review_id: reviewId, criterion_id: s.criterionId, score: s.score });
    }
  }

  revalidatePath("/admin/review");
  return { ok: true };
}

// Record a funding decision (admin only).
export async function recordDecision(input: {
  submissionId: string;
  decision: "funded" | "declined" | "waitlisted";
  amount?: number | null;
  rationale?: string;
}) {
  const profile = await requireRole("reviewer");
  if (profile.role !== "admin") return { ok: false, error: "Only admins can record decisions." };
  const admin = createAdminClient();
  await admin.from("decisions").insert({
    submission_id: input.submissionId,
    decision: input.decision,
    amount_awarded: input.amount ?? null,
    decided_by: profile.id,
    rationale: input.rationale || null,
  });
  revalidatePath("/admin/review");
  return { ok: true };
}
