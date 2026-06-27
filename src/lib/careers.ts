// Shared types for the careers application flow (used by the wizard + server action).

export type ResumeInfo = {
  bucket: string;
  key: string;
  fileName: string;
  mime: string;
  size: number;
  scanStatus: string;
};

export type ApplyPayload = {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  location?: string;
  coverNote?: string;
  resume?: ResumeInfo | null;
};

export type ApplyResult = { ok: true } | { ok: false; error: string };
