import "server-only";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuditLogEntry = {
  id: string;
  actorEmail: string;
  action: string;
  targetName: string;
  targetId: string;
  reason: string | null;
  occurredAt: string;
};

type AuditLogRow = {
  id: string;
  actor_email: string;
  action: string;
  target_name: string;
  target_id: string;
  reason: string | null;
  created_at: string;
};

function toEntry(row: AuditLogRow): AuditLogEntry {
  return {
    id: row.id,
    actorEmail: row.actor_email,
    action: row.action,
    targetName: row.target_name,
    targetId: row.target_id,
    reason: row.reason,
    occurredAt: row.created_at,
  };
}

async function getClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createAdminSupabaseClient();
  }
  return createServerSupabaseClient();
}

export async function listAuditLog(
  limit = 200,
): Promise<AuditLogEntry[]> {
  await requireSuperAdmin();

  const supabase = await getClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, actor_email, action, target_name, target_id, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[audit-log] Query error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => toEntry(row as AuditLogRow));
}

export async function writeAuditLog(entry: {
  actorEmail: string;
  action: string;
  targetName: string;
  targetId: string;
  reason?: string | null;
}): Promise<void> {
  try {
    const supabase = await getClient();
    const { error } = await supabase.from("audit_logs").insert({
      actor_email: entry.actorEmail,
      action: entry.action,
      target_name: entry.targetName,
      target_id: entry.targetId,
      reason: entry.reason ?? null,
    });
    if (error) {
      console.warn("[audit-log] Insert error:", error.message);
    }
  } catch (err) {
    console.warn("[audit-log] Failed to write audit log:", err);
  }
}

export async function deleteAuditLogEntry(
  id: string,
): Promise<{ success: true } | { error: string }> {
  await requireSuperAdmin();

  try {
    const supabase = await getClient();
    const { error } = await supabase.from("audit_logs").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/audit-log");
    revalidatePath("/dashboard/audit-log");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete audit log entry" };
  }
}

export async function clearAllAuditLogs(): Promise<{ success: true } | { error: string }> {
  await requireSuperAdmin();

  try {
    const supabase = await getClient();
    // Delete all records with a non-null id
    const { error } = await supabase.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/audit-log");
    revalidatePath("/dashboard/audit-log");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to clear audit logs" };
  }
}
