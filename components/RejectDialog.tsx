"use client";

import { type FormEvent, useActionState, useState } from "react";
import { Ban, X } from "lucide-react";

import type { RegistrationStatus } from "@/lib/registrations/types";

type MutationResult = { success: true } | { error: string };
type RejectAction = (
  registrationId: string,
  formData: FormData,
) => Promise<MutationResult>;

type RejectDialogProps = {
  registrationId: string;
  organizationName?: string;
  status: RegistrationStatus;
  rejectAction?: RejectAction;
};

const unavailableAction: RejectAction = async () => ({
  error: "The reject action is unavailable.",
});

type ActionState = MutationResult | null;

export default function RejectDialog({
  registrationId,
  organizationName,
  status,
  rejectAction = unavailableAction,
}: RejectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string>();
  const [actionState, formAction, pending] = useActionState<ActionState, FormData>(
    async (_previousState, formData) => {
      const res = await rejectAction(registrationId, formData);
      if ("success" in res) {
        setIsOpen(false);
      }
      return res;
    },
    null,
  );

  if (status !== "Pending") {
    return null;
  }

  function openDialog() {
    setReason("");
    setValidationError(undefined);
    setIsOpen(true);
  }

  function closeDialog() {
    if (!pending) {
      setValidationError(undefined);
      setIsOpen(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!reason.trim()) {
      event.preventDefault();
      setValidationError("A rejection reason is required.");
      return;
    }

    setValidationError(undefined);
  }

  return (
    <>
      <button
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
        onClick={openDialog}
        type="button"
      >
        Reject registration
      </button>

      {isOpen && (
        <div
          aria-labelledby="reject-registration-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 shrink-0">
                  <Ban aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-secondary" id="reject-registration-title">
                    Reject Registration
                  </h2>
                  {organizationName && (
                    <p className="max-w-[220px] truncate text-xs text-dark/60">
                      {organizationName}
                    </p>
                  )}
                </div>
              </div>
              <button
                aria-label="Close dialog"
                className="rounded-lg p-1 text-dark/40 transition hover:bg-muted hover:text-dark cursor-pointer"
                disabled={pending}
                onClick={closeDialog}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-dark/70">
              Record a reason so the applicant understands this decision. This action is recorded in the platform audit log.
            </p>

            <form action={formAction} className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-1.5 block text-sm font-semibold text-secondary"
                  htmlFor="rejection-reason"
                >
                  Reason <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <textarea
                  aria-describedby={validationError ? "rejection-reason-error" : undefined}
                  aria-invalid={Boolean(validationError)}
                  className="w-full resize-none rounded-lg border border-dark/20 p-3 text-sm text-secondary placeholder-dark/40 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  id="rejection-reason"
                  name="reason"
                  onChange={(event) => {
                    setReason(event.target.value);
                    if (validationError) {
                      setValidationError(undefined);
                    }
                  }}
                  placeholder="Describe why this registration is being rejected..."
                  required
                  rows={3}
                  value={reason}
                />
                {validationError ? (
                  <p className="mt-1 text-sm text-red-700" id="rejection-reason-error" role="alert">
                    {validationError}
                  </p>
                ) : null}
              </div>

              {actionState && "error" in actionState ? (
                <p aria-live="polite" className="text-sm text-red-700" role="alert">
                  {actionState.error}
                </p>
              ) : null}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  className="rounded-lg border border-dark/20 bg-white px-4 py-2 text-sm font-semibold text-dark/70 transition hover:bg-muted cursor-pointer disabled:opacity-60"
                  disabled={pending}
                  onClick={closeDialog}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:opacity-60 cursor-pointer"
                  disabled={pending}
                  type="submit"
                >
                  {pending ? "Rejecting..." : "Confirm rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
