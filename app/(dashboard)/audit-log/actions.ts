"use server";

import { deleteAuditLogEntry, clearAllAuditLogs } from "@/lib/platform/audit-log";

export async function deleteAuditLogAction(id: string) {
  return deleteAuditLogEntry(id);
}

export async function clearAllAuditLogsAction() {
  return clearAllAuditLogs();
}
