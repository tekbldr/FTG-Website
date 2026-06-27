"use client";

import { useState } from "react";
import { Stepper, Field, Input, Textarea, Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { submitApplication } from "@/lib/actions/careers";
import type { ApplyPayload, ResumeInfo } from "@/lib/careers";

const STEPS = ["Your details", "Your note", "Résumé", "Review"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ApplyWizard({
  job,
  prefill,
}: {
  job: { id: string; title: string };
  prefill: { firstName: string; lastName: string; email: string };
}) {
  const supabase = createClient();
  const [step, setStep] = useState(0);

  const [firstName, setFirstName] = useState(prefill.firstName);
  const [lastName, setLastName] = useState(prefill.lastName);
  const [email, setEmail] = useState(prefill.email);
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [location, setLocation] = useState("");
  const [coverNote, setCoverNote] = useState("");

  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [upErr, setUpErr] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const detailsOk = firstName.trim() && lastName.trim() && EMAIL_RE.test(email.trim());

  async function uploadResume(file: File) {
    setUpErr(null);
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setUpErr("Please upload a PDF or DOCX file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUpErr("That file is over 10 MB. Please upload a smaller one.");
      return;
    }
    setUploading(true);
    setResume(null);
    try {
      const signRes = await fetch("/api/files/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "resume",
          filename: file.name,
          mime: file.type || "application/pdf",
          size: file.size,
        }),
      });
      const signJson = await signRes.json();
      if (!signRes.ok) throw new Error(signJson.error || "Could not start the upload.");

      const { bucket, key, token } = signJson as { bucket: string; key: string; token: string };
      const { error: upError } = await supabase.storage.from(bucket).uploadToSignedUrl(key, token, file);
      if (upError) throw new Error(upError.message);

      const scanRes = await fetch("/api/files/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bucket, key }),
      });
      const scanJson = (await scanRes.json()) as { status: string };
      if (scanJson.status === "infected") {
        throw new Error("That file failed our security scan. Please upload a different file.");
      }

      setResume({
        bucket,
        key,
        fileName: file.name,
        mime: file.type || "application/pdf",
        size: file.size,
        scanStatus: scanJson.status,
      });
    } catch (e) {
      setUpErr(e instanceof Error ? e.message : "Upload failed. Please try again.");
      setResume(null);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit() {
    setSubmitting(true);
    setSubmitErr(null);
    const payload: ApplyPayload = {
      jobId: job.id,
      firstName,
      lastName,
      email,
      phone,
      linkedin,
      location,
      coverNote,
      resume,
    };
    const res = await submitApplication(payload);
    // A successful submit redirects; only an error returns a value here.
    if (res && !res.ok) {
      setSubmitErr(res.error);
      setSubmitting(false);
    }
  }

  const fmtSize = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

  return (
    <div>
      <Stepper steps={STEPS} current={step} />

      {/* STEP 0 — details */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="First name" htmlFor="fn" required>
              <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" aria-required />
            </Field>
            <Field label="Last name" htmlFor="ln" required>
              <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" aria-required />
            </Field>
          </div>
          <Field label="Email" htmlFor="em" required>
            <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-required />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Phone" htmlFor="ph">
              <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </Field>
            <Field label="Location" htmlFor="loc">
              <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
            </Field>
          </div>
          <Field label="LinkedIn" htmlFor="li" hint="Optional — paste your profile URL.">
            <Input id="li" type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…" />
          </Field>
        </div>
      )}

      {/* STEP 1 — note */}
      {step === 1 && (
        <Field label="Why First Tech Group?" htmlFor="note" hint="A few lines on why this role — optional, but it helps.">
          <Textarea id="note" rows={7} value={coverNote} onChange={(e) => setCoverNote(e.target.value)} placeholder="What draws you to this role and to FTG…" />
        </Field>
      )}

      {/* STEP 2 — résumé */}
      {step === 2 && (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[var(--muted)] mb-2">
            Résumé <span className="text-spark">*</span>
          </p>
          <label
            className="block cursor-pointer rounded-[2px] border border-dashed border-[var(--line-2)] bg-[var(--ink-2)] p-8 text-center transition hover:border-spark"
            aria-busy={uploading}
          >
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadResume(f);
                e.target.value = "";
              }}
            />
            {uploading ? (
              <span className="font-mono text-[12px] uppercase tracking-[.14em] text-[var(--muted)]">
                Uploading &amp; scanning…
              </span>
            ) : resume ? (
              <span className="text-[14px] text-paper">
                <span className="text-spark">✓</span> {resume.fileName}{" "}
                <span className="text-[var(--muted-2)]">({fmtSize(resume.size)}) — click to replace</span>
              </span>
            ) : (
              <span className="text-[14px] text-[var(--muted)]">
                <span className="text-paper">Choose a file</span> — PDF or DOCX, up to 10 MB
              </span>
            )}
          </label>
          {upErr && (
            <p className="mt-2 text-[12px] text-spark" role="alert">
              {upErr}
            </p>
          )}
          {resume && resume.scanStatus !== "clean" && (
            <p className="mt-2 text-[12px] text-[var(--muted-2)]">
              Uploaded — virus scan is {resume.scanStatus}; it will be verified before any recruiter can open it.
            </p>
          )}
        </div>
      )}

      {/* STEP 3 — review */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-5">
            <Row k="Role" v={job.title} />
            <Row k="Name" v={`${firstName} ${lastName}`.trim()} />
            <Row k="Email" v={email} />
            {phone && <Row k="Phone" v={phone} />}
            {location && <Row k="Location" v={location} />}
            {linkedin && <Row k="LinkedIn" v={linkedin} />}
            <Row k="Résumé" v={resume ? resume.fileName : "— none attached —"} />
            {coverNote && <Row k="Note" v={coverNote} />}
          </div>
          {submitErr && (
            <p className="text-[13px] text-spark" role="alert">
              {submitErr}
            </p>
          )}
        </div>
      )}

      {/* nav */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
          className={step === 0 ? "invisible" : ""}
        >
          ← Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            variant="spark"
            onClick={() => setStep((s) => s + 1)}
            disabled={(step === 0 && !detailsOk) || (step === 2 && (!resume || uploading))}
          >
            Continue →
          </Button>
        ) : (
          <Button type="button" variant="spark" onClick={onSubmit} disabled={submitting || !resume || !detailsOk}>
            {submitting ? "Submitting…" : "Submit application →"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-[var(--line)] last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[var(--muted-2)] w-24 shrink-0 pt-1">
        {k}
      </span>
      <span className="text-[14px] text-paper whitespace-pre-line">{v}</span>
    </div>
  );
}
