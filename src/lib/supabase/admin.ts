import "server-only";
import { createClient } from "@supabase/supabase-js";

// SERVICE-ROLE client. Bypasses RLS. Use ONLY in server actions / route handlers
// for privileged staff operations (stage moves, scan-status updates, issuing
// signed download URLs after an explicit ownership/assignment check). Never import
// this into a client component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
