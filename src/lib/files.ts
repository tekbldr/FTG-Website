import "server-only";

// Allowlisted upload types (OWASP: allowlist, never denylist)
export const ALLOWED = {
  resume: { mimes: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], exts: ["pdf", "docx"], maxBytes: 10 * 1024 * 1024 },
  doc: {
    mimes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    exts: ["pdf", "pptx", "xlsx", "docx"],
    maxBytes: 25 * 1024 * 1024,
  },
} as const;

export type UploadKind = keyof typeof ALLOWED;

export function safeExt(filename: string) {
  const m = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

export function validate(kind: UploadKind, filename: string, mime: string, size: number) {
  const rule = ALLOWED[kind];
  const ext = safeExt(filename);
  if (!(rule.exts as readonly string[]).includes(ext)) return `Only ${rule.exts.join(", ")} files are accepted.`;
  if (mime && !(rule.mimes as readonly string[]).includes(mime)) return "File content type does not match an accepted format.";
  if (size > rule.maxBytes) return `File is too large. Max ${(rule.maxBytes / 1024 / 1024) | 0} MB.`;
  if (size <= 0) return "File appears empty.";
  return null;
}

// Server-generated object key → prevents client path tampering / IDOR.
export function objectKey(userId: string, filename: string) {
  const ext = safeExt(filename);
  const id = crypto.randomUUID();
  return `${userId}/${id}.${ext}`;
}
