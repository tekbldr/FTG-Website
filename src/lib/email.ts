import "server-only";

// Email via Resend when RESEND_API_KEY is set; otherwise logs to the server
// console (dev-safe fallback, so stage changes never fail for lack of a key).

const FROM = process.env.EMAIL_FROM || "FTG <careers@ftg.vc>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Mail = { to: string; subject: string; html: string; text: string };

export async function sendEmail(mail: Mail): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:console] → ${mail.to} · ${mail.subject}`);
    return { ok: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [mail.to], subject: mail.subject, html: mail.html, text: mail.text }),
    });
    if (!res.ok) {
      console.error("[email] Resend error:", res.status, await res.text().catch(() => ""));
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] send failed:", e);
    return { ok: false };
  }
}

function shell(heading: string, body: string, ctaText?: string, ctaPath?: string): string {
  const cta =
    ctaText && ctaPath
      ? `<a href="${SITE}${ctaPath}" style="display:inline-block;margin-top:24px;background:#FF5E2C;color:#1a0a04;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:2px;font-family:monospace;font-size:13px;letter-spacing:.08em;text-transform:uppercase">${ctaText}</a>`
      : "";
  return `<div style="background:#0B0B0E;color:#FAFAF7;font-family:Arial,Helvetica,sans-serif;padding:40px 24px">
  <div style="max-width:520px;margin:0 auto">
    <div style="font-family:monospace;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:rgba(250,250,247,.5)">First Tech Group</div>
    <h1 style="font-size:23px;margin:16px 0 12px;line-height:1.25">${heading}</h1>
    <div style="color:rgba(250,250,247,.72);font-size:15px;line-height:1.6">${body}</div>
    ${cta}
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(250,250,247,.12);font-family:monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(250,250,247,.35)">Engineering what comes next</div>
  </div>
</div>`;
}

export function applicationReceivedEmail(p: { to: string; name?: string | null; jobTitle?: string | null }): Mail {
  const name = p.name || "there";
  const job = p.jobTitle || "the role";
  return {
    to: p.to,
    subject: "We received your FTG application",
    html: shell(
      "Application received",
      `<p>Hi ${name},</p><p>Thanks for applying for <strong style="color:#FAFAF7">${job}</strong> at First Tech Group. Our team will review it and you can follow every step in your portal.</p>`,
      "Track my application",
      "/portal/candidate"
    ),
    text: `Hi ${name}, thanks for applying for ${job} at First Tech Group. Track it: ${SITE}/portal/candidate`,
  };
}

export function applicationStageEmail(p: {
  to: string;
  name?: string | null;
  jobTitle?: string | null;
  stageName?: string | null;
}): Mail {
  const name = p.name || "there";
  const job = p.jobTitle || "your application";
  const stage = p.stageName || "the next stage";
  return {
    to: p.to,
    subject: `Your FTG application — now at ${stage}`,
    html: shell(
      `Your application moved to ${stage}`,
      `<p>Hi ${name},</p><p>Your application for <strong style="color:#FAFAF7">${job}</strong> is now at the <strong style="color:#FF5E2C">${stage}</strong> stage.</p>`,
      "View my application",
      "/portal/candidate"
    ),
    text: `Hi ${name}, your application for ${job} is now at the ${stage} stage. View: ${SITE}/portal/candidate`,
  };
}

export function submissionReceivedEmail(p: { to: string; name?: string | null; company?: string | null }): Mail {
  const name = p.name || "there";
  const company = p.company || "your company";
  return {
    to: p.to,
    subject: "We received your FTG Ventures submission",
    html: shell(
      "Submission received",
      `<p>Hi ${name},</p><p>Thanks for submitting <strong style="color:#FAFAF7">${company}</strong> to FTG Ventures. Every detail reached our investment team — track your status anytime.</p>`,
      "Track my submission",
      "/portal/founder"
    ),
    text: `Hi ${name}, thanks for submitting ${company} to FTG Ventures. Track it: ${SITE}/portal/founder`,
  };
}

export function submissionStageEmail(p: {
  to: string;
  name?: string | null;
  company?: string | null;
  stageName?: string | null;
}): Mail {
  const name = p.name || "there";
  const company = p.company || "your company";
  const stage = p.stageName || "the next stage";
  return {
    to: p.to,
    subject: `Your FTG Ventures submission — now at ${stage}`,
    html: shell(
      `${company} moved to ${stage}`,
      `<p>Hi ${name},</p><p>Your submission <strong style="color:#FAFAF7">${company}</strong> is now at the <strong style="color:#FF5E2C">${stage}</strong> stage.</p>`,
      "View my submission",
      "/portal/founder"
    ),
    text: `Hi ${name}, your submission ${company} is now at the ${stage} stage. View: ${SITE}/portal/founder`,
  };
}
