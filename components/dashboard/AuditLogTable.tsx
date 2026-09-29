"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Filter,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import {
  clearAllAuditLogsAction,
  deleteAuditLogAction,
} from "@/app/(dashboard)/audit-log/actions";
import type { AuditLogEntry } from "@/lib/platform/audit-log";

type Props = {
  entries: AuditLogEntry[];
};

const actionStyles: Record<string, string> = {
  login: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  logout: "bg-slate-100 text-slate-700 border border-slate-200",
  approve: "bg-primary/15 text-secondary border border-primary/30",
  reject: "bg-red-100 text-red-800 border border-red-200",
  suspend: "bg-amber-100 text-amber-800 border border-amber-200",
  reactivate: "bg-sky-100 text-sky-800 border border-sky-200",
  deactivate: "bg-dark/10 text-dark/70 border border-dark/20",
};

const actionLabels: Record<string, string> = {
  login: "Logged In",
  logout: "Logged Out",
  approve: "Approved",
  reject: "Rejected",
  suspend: "Suspended",
  reactivate: "Reactivated",
  deactivate: "Deactivated",
};

function getActionIcon(action: string) {
  switch (action) {
    case "login":
      return <LogIn size={13} className="shrink-0" />;
    case "logout":
      return <LogOut size={13} className="shrink-0" />;
    case "approve":
      return <CheckCircle2 size={13} className="shrink-0 stroke-[2.5]" />;
    case "reject":
      return <XCircle size={13} className="shrink-0" />;
    case "suspend":
      return <AlertTriangle size={13} className="shrink-0" />;
    case "reactivate":
      return <RefreshCw size={13} className="shrink-0" />;
    case "deactivate":
      return <Ban size={13} className="shrink-0" />;
    default:
      return null;
  }
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AuditLogTable({ entries: initialEntries }: Props) {
  const [entries, setEntries] = useState<AuditLogEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AuditLogEntry | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Action types present in entries for filter pills
  const availableActions = useMemo(() => {
    const set = new Set(initialEntries.map((e) => e.action));
    return Array.from(set);
  }, [initialEntries]);

  // Filtered entries based on search and action
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Action filter
      if (selectedAction !== "all" && entry.action !== selectedAction) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchActor = entry.actorEmail?.toLowerCase().includes(q);
        const matchAction = entry.action?.toLowerCase().includes(q);
        const matchTarget = entry.targetName?.toLowerCase().includes(q);
        const matchTargetId = entry.targetId?.toLowerCase().includes(q);
        const matchReason = entry.reason?.toLowerCase().includes(q);
        const matchDate = formatDate(entry.occurredAt).toLowerCase().includes(q);

        return Boolean(
          matchActor ||
            matchAction ||
            matchTarget ||
            matchTargetId ||
            matchReason ||
            matchDate,
        );
      }

      return true;
    });
  }, [entries, searchQuery, selectedAction]);

  // Handle single deletion
  async function handleDeleteConfirm() {
    if (!itemToDelete) return;
    const targetId = itemToDelete.id;
    setDeletePendingId(targetId);

    // Optimistically remove from state
    setEntries((prev) => prev.filter((e) => e.id !== targetId));
    setItemToDelete(null);

    startTransition(async () => {
      const res = await deleteAuditLogAction(targetId);
      setDeletePendingId(null);
      if ("error" in res) {
        // Rollback on failure
        setEntries(initialEntries);
        alert(`Failed to delete audit log: ${res.error}`);
      }
    });
  }

  // Handle clear all
  async function handleClearAllConfirm() {
    setShowClearConfirm(false);
    setEntries([]);

    startTransition(async () => {
      const res = await clearAllAuditLogsAction();
      if ("error" in res) {
        setEntries(initialEntries);
        alert(`Failed to clear audit logs: ${res.error}`);
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Action Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-dark/10 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, action, organization, reason..."
            className="w-full rounded-xl border border-dark/15 bg-white py-2 pl-9 pr-9 text-sm text-secondary placeholder:text-dark/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/15"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark cursor-pointer"
              title="Clear search"
              type="button"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Action Buttons & Filter Summary */}
        <div className="flex flex-wrap items-center gap-2">
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={13} />
              Clear all logs
            </button>
          )}
        </div>
      </div>

      {/* Action Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedAction("all")}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            selectedAction === "all"
              ? "bg-secondary text-white shadow-xs"
              : "border border-dark/10 bg-white text-dark/70 hover:bg-muted"
          }`}
        >
          All ({entries.length})
        </button>

        {availableActions.map((action) => {
          const count = entries.filter((e) => e.action === action).length;
          const label = actionLabels[action] ?? action;
          const active = selectedAction === action;

          return (
            <button
              key={action}
              type="button"
              onClick={() => setSelectedAction(active ? "all" : action)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                active
                  ? "bg-secondary text-white shadow-xs"
                  : "border border-dark/10 bg-white text-dark/70 hover:bg-muted"
              }`}
            >
              {getActionIcon(action)}
              <span>
                {label} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dark/10 bg-white py-16 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-secondary">
            <Filter size={24} />
          </div>
          <p className="mt-3 text-base font-bold text-secondary">No audit events recorded</p>
          <p className="mt-1 text-xs text-dark/50 max-w-sm">
            Administrative actions, logins, logouts, and organization status reviews will automatically be recorded here.
          </p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dark/10 bg-white py-16 text-center shadow-sm">
          <Search size={24} className="text-dark/30" />
          <p className="mt-3 text-base font-bold text-secondary">No matching results</p>
          <p className="mt-1 text-xs text-dark/50">
            No audit log entries match your current search and filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedAction("all");
            }}
            className="mt-4 rounded-xl border border-dark/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-secondary hover:bg-muted cursor-pointer"
            type="button"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm">
          <table className="w-full text-left" aria-label="Platform audit log">
            <thead className="border-b border-dark/10 bg-muted/60">
              <tr>
                {["Date & Time", "Actor", "Action", "Target", "Reason", "Manage"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-dark/50"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/8">
              {filteredEntries.map((entry) => {
                const actionStyle =
                  actionStyles[entry.action] ??
                  "bg-dark/10 text-dark/70 border border-dark/20";
                const actionLabel = actionLabels[entry.action] ?? entry.action;
                const isDeleting = deletePendingId === entry.id;

                return (
                  <tr
                    key={entry.id}
                    className={`transition hover:bg-muted/40 ${isDeleting ? "opacity-40" : ""}`}
                  >
                    {/* Date & Time */}
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-dark/70">
                      {formatDate(entry.occurredAt)}
                    </td>

                    {/* Actor */}
                    <td className="px-5 py-4 text-xs font-semibold text-secondary max-w-[190px] truncate">
                      {entry.actorEmail}
                    </td>

                    {/* Action Pill */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${actionStyle}`}
                      >
                        {getActionIcon(entry.action)}
                        <span>{actionLabel}</span>
                      </span>
                    </td>

                    {/* Target */}
                    <td className="px-5 py-4 text-xs text-secondary max-w-[190px] truncate">
                      <span className="font-semibold">{entry.targetName}</span>
                      {entry.targetId && entry.targetId !== entry.targetName && (
                        <span
                          title={entry.targetId}
                          className="ml-1.5 font-mono text-[10px] text-dark/40 bg-muted px-1.5 py-0.5 rounded border border-dark/5"
                        >
                          {entry.targetId.slice(0, 8)}
                        </span>
                      )}
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4 text-xs text-dark/70 max-w-[240px] truncate">
                      {entry.reason ? (
                        <span>{entry.reason}</span>
                      ) : (
                        <span className="italic text-dark/30">—</span>
                      )}
                    </td>

                    {/* Delete Action */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setItemToDelete(entry)}
                        disabled={isPending || isDeleting}
                        title="Delete audit entry"
                        aria-label={`Delete audit entry ${entry.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-dark/40 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="border-t border-dark/8 bg-muted/30 px-5 py-3 text-xs text-dark/50 flex items-center justify-between">
            <span>
              Showing {filteredEntries.length} of {entries.length} recorded events
            </span>
            {searchQuery && (
              <span className="font-medium text-secondary">
                Filtered by &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
        </div>
      )}

      {/* Delete Single Entry Confirmation Modal */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-entry-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 shrink-0">
                <Trash2 size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold text-secondary" id="delete-entry-title">
                  Delete Audit Entry
                </h3>
                <p className="text-xs text-dark/50">This action cannot be undone.</p>
              </div>
            </div>

            <p className="mb-5 text-xs text-dark/70 leading-relaxed">
              Are you sure you want to permanently delete this audit record for{" "}
              <span className="font-semibold text-secondary">
                &quot;{itemToDelete.targetName}&quot;
              </span>{" "}
              ({itemToDelete.action})?
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="rounded-xl border border-dark/15 bg-white px-4 py-2 text-xs font-semibold text-dark/70 hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Delete record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Logs Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-all-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 shrink-0">
                <AlertTriangle size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold text-secondary" id="clear-all-title">
                  Clear All Audit Logs
                </h3>
                <p className="text-xs text-dark/50">Permanent action</p>
              </div>
            </div>

            <p className="mb-5 text-xs text-dark/70 leading-relaxed">
              Are you sure you want to permanently delete all{" "}
              <span className="font-semibold text-secondary">{entries.length}</span> audit
              records? This will empty the audit trail entirely.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded-xl border border-dark/15 bg-white px-4 py-2 text-xs font-semibold text-dark/70 hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllConfirm}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Yes, clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
