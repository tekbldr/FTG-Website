"use client";

import { useState } from "react";
import { Stepper, Field, Input, Textarea, Select, Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { submitPitch } from "@/lib/actions/pitch";
import { DOC_LABELS, type DocInfo, type DocType, type PitchPayload } from "@/lib/pitch";
import { COMPANY_STAGES, SECTORS } from "@/content/pitch";

const STEPS = ["About you", "Company", "The ask", "Documents", "Review"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOC_SLOTS: { type: DocType; required: boolean }[] = [
  { type: "pitch_deck", required: true },
  { type: "financials", required: false },
  { type: "cap_table", required: false },
];

export function IntakeWizard({
  programId,
  prefill,
}: {
  programId: string;
  prefill: { founderName: string; founderEmail: string };
}) {
  const supabase = createClient();
  const [step, setStep] = useState(0);

  const [founderName, setFounderName] = useState(prefill.founderName);
  const [founderEmail, setFounderEmail] = useState(prefill.founderEmail);
  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [website, setWebsite] = useState("");
  const [sector, setSector] = useState("");
  const [stageOfCompany, setStageOfCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [traction, setTraction] = useState("");
  const [whyNow, setWhyNow] = useState("");

  const [docs, setDocs] = useState<Partial<Record<DocType, DocInfo>>>({});
  const [uploadingType, setUploadingType] = useState<DocType | null>(null);
  const [docErr, setDocErr] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const aboutOk = founderName.trim() && EMAIL_RE.test(founderEmail.trim());
  const companyOk = companyName.trim() && oneLiner.trim();
  const docsOk = !!docs.pitch_deck && !uploadingType;

  async function uploadDoc(file: File, type: DocType) {
    setDocErr(null);
    if (!/\.(pdf|pptx|xlsx|docx)$/i.test(file.name)) {
      setDocErr("Please upload a PDF, PPTX, XLSX, or DOCX file.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setDocErr("That file is over 25 MB. Please upload a smaller one.");
      return;
    }
    setUploadingType(type);
    try {
      const signRes = await fetch("/api/files/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "doc", filename: file.name, mime: file.type || "application/pdf", size: file.size }),
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
      if (scanJson.status === "infected") throw new Error("That file failed our security scan.");

      setDocs((prev) => ({
        ...prev,
        [type]: { type, bucket, key, fileName: file.name, mime: file.type || "application/pdf", size: file.size, scanStatus: scanJson.status },
      }));
    } catch (e) {
      setDocErr(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploadingType(null);
    }
  }

  async function onSubmit() {
    setSubmitting(true);
    setSubmitErr(null);
    const payload: PitchPayload = {
      programId,
      founderName,
      founderEmail,
      bio,
      companyName,
      oneLiner,
      website,
      sector,
      stageOfCompany,
      amountRequested: amount ? Number(amount.replace(/[^\d.]/g, "")) : null,
      currency,
      traction,
      whyNow,
      documents: Object.values(docs).filter(Boolean) as DocInfo[],
    };
    const res = await submitPitch(payload);
    if (res && !res.ok) {
      setSubmitErr(res.error);
      setSubmitting(false);
    }
  }

  const fmtSize = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

  return (
    <div>
      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <Field label="Your name" htmlFor="fname" required>
            <Input id="fname" value={founderName} onChange={(e) => setFounderName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Email" htmlFor="femail" required>
            <Input id="femail" type="email" value={founderEmail} onChange={(e) => setFounderEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label="A line about you" htmlFor="bio" hint="Optional — your background in a sentence.">
            <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ex-founder, 10y in payments…" />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <Field label="Company name" htmlFor="cn" required>
            <Input id="cn" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Field>
          <Field label="One-liner" htmlFor="ol" required hint="What are you building, in one sentence?">
            <Input id="ol" value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} placeholder="We're building…" />
          </Field>
          <Field label="Website" htmlFor="web">
            <Input id="web" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Sector" htmlFor="sec">
              <Select id="sec" value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="">Select…</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Stage" htmlFor="stg">
              <Select id="stg" value={stageOfCompany} onChange={(e) => setStageOfCompany(e.target.value)}>
                <option value="">Select…</option>
                {COMPANY_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="grid sm:grid-cols-[1fr_140px] gap-5">
            <Field label="Amount raising" htmlFor="amt" hint="Optional — your target round size.">
              <Input id="amt" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2,000,000" />
            </Field>
            <Field label="Currency" htmlFor="cur">
              <Select id="cur" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {["USD", "SAR", "AED", "EUR", "GBP"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Traction" htmlFor="trc" hint="Revenue, users, growth, key signings — anything that proves demand.">
            <Textarea id="trc" rows={4} value={traction} onChange={(e) => setTraction(e.target.value)} />
          </Field>
          <Field label="Why now?" htmlFor="wn" hint="What makes this the moment for this company?">
            <Textarea id="wn" rows={4} value={whyNow} onChange={(e) => setWhyNow(e.target.value)} />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          {DOC_SLOTS.map(({ type, required }) => {
            const doc = docs[type];
            const isUploading = uploadingType === type;
            return (
              <div key={type}>
                <p className="font-mono text-[11px] uppercase tracking-[.16em] text-[var(--muted)] mb-2">
                  {DOC_LABELS[type]}{" "}
                  {required ? <span className="text-spark">*</span> : <span className="text-[var(--muted-2)]">(optional)</span>}
                </p>
                <label
                  className="block cursor-pointer rounded-[2px] border border-dashed border-[var(--line-2)] bg-[var(--ink-2)] p-5 text-center transition hover:border-spark"
                  aria-busy={isUploading}
                >
                  <input
                    type="file"
                    accept=".pdf,.pptx,.xlsx,.docx"
                    className="sr-only"
                    disabled={isUploading || !!uploadingType}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadDoc(f, type);
                      e.target.value = "";
                    }}
                  />
                  {isUploading ? (
                    <span className="font-mono text-[12px] uppercase tracking-[.14em] text-[var(--muted)]">
                      Uploading &amp; scanning…
                    </span>
                  ) : doc ? (
                    <span className="text-[14px] text-paper">
                      <span className="text-spark">✓</span> {doc.fileName}{" "}
                      <span className="text-[var(--muted-2)]">({fmtSize(doc.size)}) — replace</span>
                    </span>
                  ) : (
                    <span className="text-[14px] text-[var(--muted)]">
                      <span className="text-paper">Choose a file</span> — PDF, PPTX, XLSX, DOCX · up to 25 MB
                    </span>
                  )}
                </label>
              </div>
            );
          })}
          {docErr && (
            <p className="text-[12px] text-spark" role="alert">
              {docErr}
            </p>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-[2px] border border-[var(--line)] bg-[var(--ink-2)] p-5">
            <Row k="Company" v={companyName} />
            <Row k="One-liner" v={oneLiner} />
            <Row k="Founder" v={`${founderName} · ${founderEmail}`} />
            {sector && <Row k="Sector" v={sector} />}
            {stageOfCompany && <Row k="Stage" v={stageOfCompany} />}
            {amount && <Row k="Raising" v={`${currency} ${amount}`} />}
            <Row
              k="Documents"
              v={(Object.values(docs).filter(Boolean) as DocInfo[]).map((d) => DOC_LABELS[d.type]).join(", ") || "— none —"}
            />
          </div>
          {submitErr && (
            <p className="text-[13px] text-spark" role="alert">
              {submitErr}
            </p>
          )}
        </div>
      )}

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
            disabled={(step === 0 && !aboutOk) || (step === 1 && !companyOk) || (step === 3 && !docsOk)}
          >
            Continue →
          </Button>
        ) : (
          <Button type="button" variant="spark" onClick={onSubmit} disabled={submitting || !docsOk || !companyOk || !aboutOk}>
            {submitting ? "Submitting…" : "Submit pitch →"}
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
