// Shared types for the founder pitch submission flow.

export type DocType = "pitch_deck" | "financials" | "cap_table" | "business_plan" | "supporting";

export type DocInfo = {
  type: DocType;
  bucket: string;
  key: string;
  fileName: string;
  mime: string;
  size: number;
  scanStatus: string;
};

export type PitchPayload = {
  programId: string;
  founderName: string;
  founderEmail: string;
  bio?: string;
  companyName: string;
  oneLiner: string;
  website?: string;
  sector?: string;
  stageOfCompany?: string;
  amountRequested?: number | null;
  currency?: string;
  traction?: string;
  whyNow?: string;
  documents: DocInfo[];
};

export type PitchResult = { ok: true } | { ok: false; error: string };

export const DOC_LABELS: Record<DocType, string> = {
  pitch_deck: "Pitch deck",
  financials: "Financials",
  cap_table: "Cap table",
  business_plan: "Business plan",
  supporting: "Supporting",
};
