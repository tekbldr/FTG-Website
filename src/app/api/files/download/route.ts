import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Gated download. Verifies (a) the requester owns the file OR is an authorized
// staff member / assigned reviewer, AND (b) the file passed virus scanning, THEN
// issues a 60-second signed GET url for that exact object. Server constructs the
// key from the DB row — the client never supplies a raw storage path (no IDOR).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("id");
  const scope = searchParams.get("scope"); // 'attachment' | 'document'
  if (!fileId || !scope) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role ?? "member";
  const admin = createAdminClient();

  let bucket = "";
  let key = "";
  let authorized = false;

  if (scope === "attachment") {
    bucket = "resumes";
    const { data: row } = await admin
      .from("attachments")
      .select("file_key, scan_status, candidate_id, candidates(user_id)")
      .eq("id", fileId)
      .single<{ file_key: string; scan_status: string; candidates: { user_id: string } | null }>();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (row.scan_status !== "clean") return NextResponse.json({ error: "File not available" }, { status: 423 });
    key = row.file_key;
    const isOwner = row.candidates?.user_id === user.id;
    authorized = isOwner || role === "recruiter" || role === "admin";
  } else if (scope === "document") {
    bucket = "pitch-docs";
    const { data: row } = await admin
      .from("documents")
      .select("file_key, scan_status, submission_id, submissions(founder_id, founders(user_id))")
      .eq("id", fileId)
      .single<{
        file_key: string;
        scan_status: string;
        submission_id: string;
        submissions: { founder_id: string; founders: { user_id: string } | null } | null;
      }>();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (row.scan_status !== "clean") return NextResponse.json({ error: "File not available" }, { status: 423 });
    key = row.file_key;
    const isOwner = row.submissions?.founders?.user_id === user.id;
    let assigned = false;
    if (role === "reviewer") {
      const { data: a } = await admin
        .from("review_assignments")
        .select("id")
        .eq("submission_id", row.submission_id)
        .eq("reviewer_id", user.id)
        .maybeSingle();
      assigned = !!a;
    }
    authorized = isOwner || role === "admin" || assigned;
  } else {
    return NextResponse.json({ error: "Bad scope" }, { status: 400 });
  }

  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await admin.storage.from(bucket).createSignedUrl(key, 60);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: data.signedUrl });
}
