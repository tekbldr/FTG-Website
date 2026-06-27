import "server-only";

// Virus-scan a file buffer. Returns 'clean' | 'infected' | 'error'.
// Priority: self-hosted ClamAV (best for confidential pitch docs) → Cloudmersive
// (managed, fine for resumes) → in dev with neither configured, mark 'pending'
// is handled by the caller; here we conservatively return 'error' so files are
// never served until a real scanner is wired.
export type ScanResult = "clean" | "infected" | "error";

export async function scanBuffer(bytes: ArrayBuffer, filename: string): Promise<ScanResult> {
  const clamUrl = process.env.CLAMAV_SCAN_URL;
  const cmKey = process.env.CLOUDMERSIVE_API_KEY;

  try {
    if (clamUrl) {
      // Expects a simple ClamAV-over-HTTP shim returning { infected: boolean }
      const res = await fetch(clamUrl, {
        method: "POST",
        headers: { "content-type": "application/octet-stream", "x-filename": filename },
        body: bytes,
      });
      if (!res.ok) return "error";
      const json = (await res.json()) as { infected?: boolean };
      return json.infected ? "infected" : "clean";
    }

    if (cmKey) {
      const form = new FormData();
      form.append("inputFile", new Blob([bytes]), filename);
      const res = await fetch("https://api.cloudmersive.com/virus/scan/file", {
        method: "POST",
        headers: { Apikey: cmKey },
        body: form,
      });
      if (!res.ok) return "error";
      const json = (await res.json()) as { CleanResult?: boolean };
      return json.CleanResult ? "clean" : "infected";
    }

    // No scanner configured. In dev you may set ALLOW_UNSCANNED=1 to treat as clean.
    if (process.env.ALLOW_UNSCANNED === "1") return "clean";
    return "error";
  } catch {
    return "error";
  }
}
