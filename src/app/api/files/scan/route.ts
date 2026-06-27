import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scanBuffer } from "@/lib/scan";

// Called right after the client finishes uploading. Downloads the object with the
// service role, virus-scans it, and returns the verdict. The caller stores the
// verdict on the attachment/document row; files are only ever served when 'clean'.
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bucket, key } = (await req.json()) as { bucket: string; key: string };
  // ownership: the key must live under the caller's folder
  if (!key?.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(bucket).download(key);
  if (error || !data) return NextResponse.json({ status: "error" }, { status: 200 });

  const bytes = await data.arrayBuffer();
  const status = await scanBuffer(bytes, key);

  // If infected, delete immediately.
  if (status === "infected") {
    await admin.storage.from(bucket).remove([key]);
  }
  return NextResponse.json({ status });
}
