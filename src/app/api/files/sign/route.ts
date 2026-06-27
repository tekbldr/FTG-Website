import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ALLOWED, validate, objectKey, type UploadKind } from "@/lib/files";

const BUCKET: Record<UploadKind, string> = { resume: "resumes", doc: "pitch-docs" };

// Issues a short-lived signed UPLOAD url scoped to a server-generated key under
// the user's own folder. Client uploads directly to storage with it.
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { kind, filename, mime, size } = (await req.json()) as {
    kind: UploadKind;
    filename: string;
    mime: string;
    size: number;
  };
  if (!ALLOWED[kind]) return NextResponse.json({ error: "Bad kind" }, { status: 400 });

  const err = validate(kind, filename, mime, size);
  if (err) return NextResponse.json({ error: err }, { status: 422 });

  const key = objectKey(user.id, filename);
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET[kind]).createSignedUploadUrl(key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bucket: BUCKET[kind], key, token: data.token });
}
