"use client";

import { useActionState, useState } from "react";
import { AlertTriangle, Ban, RefreshCw, X } from "lucide-react";

type MutationResult = { success: true } | { error: string };

type Props = {
  registrationId: string;
  organizationName: string;
  currentStatus: string;
  suspendAction: (id: string, reason: string) => Promise<MutationResult>;
  reactivateAction: (id: string) => Promise<MutationResult>;
  deactivateAction: (id: string, reason: string) => Promise<MutationResult>;
};

type Mode = "suspend" | "deactivate" | "reactivate";

const modeConfig = {
  suspend: {
    title: "Suspend Organization",
    description:
      "Suspending will immediately revoke the organization's platform access. This action is reversible.",
    buttonLabel: "Suspend",
    buttonClass:
      "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
    icon: AlertTriangle,
    requiresReason: true,
  },
  deactivate: {
    title: "Deactivate Organization",
    description:
      "Deactivating permanently removes this organization's platform access. This action is not reversible through the UI.",
    buttonLabel: "Deactivate",
    buttonClass: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
    icon: Ban,
    requiresReason: true,
  },
  reactivate: {
    title: "Reactivate Organization",
    description:
      "Reactivating will restore the organization's platform access. Their data will remain intact.",
    buttonLabel: "Reactivate",
    buttonClass:
      "bg-primary text-secondary hover:bg-primary/90 focus-visible:ring-primary",
    icon: RefreshCw,
    requiresReason: false,
  },
};

export default function OrgActionDialog({
  registrationId,
  organizationName,
  currentStatus,
  suspendAction,
  reactivateAction,
  deactivateAction,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("suspend");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (
    currentStatus !== "Approved" &&
    currentStatus !== "Suspended"
  ) {
    return null;
  }

  const isSuspended = currentStatus === "Suspended";

  function openDialog(m: Mode) {
    setMode(m);
    setReason("");
    setError(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    let result: MutationResult;
    if (mode === "suspend") {
      result = await suspendAction(registrationId, reason);
    } else if (mode === "deactivate") {
      result = await deactivateAction(registrationId, reason);
    } else {
      result = await reactivateAction(registrationId);
    }

    setPending(false);

    if ("error" in result) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <>
      {/* Trigger buttons */}
      <div className="flex flex-wrap gap-2">
        {!isSuspended && (
          <button
            type="button"
            onClick={() => openDialog("suspend")}
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Suspend
          </button>
        )}
        {isSuspended && (
          <button
            type="button"
            onClick={() => openDialog("reactivate")}
            className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Reactivate
          </button>
        )}
        <button
          type="button"
          onClick={() => openDialog("deactivate")}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Deactivate
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="org-action-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    mode === "reactivate"
                      ? "bg-primary/15 text-secondary"
                      : mode === "suspend"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  <Icon aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 id="org-action-title" className="text-lg font-bold text-secondary">
                    {config.title}
                  </h2>
                  <p className="text-xs text-dark/60 truncate max-w-[220px]">
                    {organizationName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg p-1 text-dark/40 transition hover:bg-muted hover:text-dark"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-dark/70">
              {config.description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {config.requiresReason && (
                <div>
                  <label
                    htmlFor="action-reason"
                    className="mb-1.5 block text-sm font-semibold text-secondary"
                  >
                    Reason <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="action-reason"
                    name="reason"
                    required
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe why this action is being taken..."
                    className="w-full resize-none rounded-lg border border-dark/20 p-3 text-sm text-secondary placeholder-dark/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}

              {error && (
                <p role="alert" aria-live="polite" className="text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-dark/20 bg-white px-4 py-2 text-sm font-semibold text-dark/70 transition hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 ${config.buttonClass}`}
                >
                  {pending ? "Please wait..." : config.buttonLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
