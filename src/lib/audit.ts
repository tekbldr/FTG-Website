import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Append a privileged action to the audit log. Must NEVER throw — auditing is
// best-effort and should not break the action it records.
export async function logAudit(entry: {
  action: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
  meta?: Record<string, unknown>;
}) {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();
    await createAdminClient()
      .from("audit_log")
      .insert({
        actor_id: user?.id ?? null,
        actor_email: user?.email ?? null,
        action: entry.action,
        entity_type: entry.entityType ?? null,
        entity_id: entry.entityId ?? null,
        summary: entry.summary ?? null,
        meta: entry.meta ?? {},
      });
  } catch {
    // swallow — never let audit failure surface to the user
  }
}
