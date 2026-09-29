import AuditLogTable from "@/components/dashboard/AuditLogTable";
import { listAuditLog } from "@/lib/platform/audit-log";

export default async function AuditLogPage() {
  const entries = await listAuditLog(200);

  return (
    <section aria-labelledby="audit-log-title" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Admin activity
        </p>
        <h1
          id="audit-log-title"
          className="mt-1 text-3xl font-bold tracking-tight text-secondary"
        >
          Audit Log
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-dark/70">
          A complete, chronological record of all administrative actions taken on this
          platform. Showing the most recent 200 events.
        </p>
      </div>

      <AuditLogTable entries={entries} />
    </section>
  );
}
