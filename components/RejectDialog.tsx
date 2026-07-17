'use client';

import { type FormEvent, useActionState, useState } from "react";

import type { RegistrationStatus } from "@/lib/registrations/types";

type MutationResult = { success: true } | { error: string };
type RejectAction = (
  registrationId: string,
  formData: FormData,
) => Promise<MutationResult>;

type RejectDialogProps = {
  registrationId: string;
  status: RegistrationStatus;
  rejectAction?: RejectAction;
};

const unavailableAction: RejectAction = async () => ({
  error: "The reject action is unavailable.",
});

type ActionState = MutationResult | null;

export default function RejectDialog({
  registrationId,
  status,
  rejectAction = unavailableAction,
}: RejectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string>();
  const [actionState, formAction, pending] = useActionState<ActionState, FormData>(
    async (_previousState, formData) => rejectAction(registrationId, formData),
    null,
  );

  if (status !== "Pending") {
    return null;
  }

  function openDialog() {
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
    <div className="space-y-3">
      {actionState && "error" in actionState ? (
        <p aria-live="polite" className="text-sm text-red-700" role="alert">
          {actionState.error}
        </p>
      ) : null}
      <button
        className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-800 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        onClick={openDialog}
        type="button"
      >
        Reject registration
      </button>

      {isOpen ? (
        <div
          aria-labelledby="reject-registration-title"
          aria-modal="true"
          className="rounded-xl border border-red-200 bg-red-50 p-5"
          role="dialog"
        >
          <h2 className="text-lg font-bold text-red-900" id="reject-registration-title">
            Reject registration
          </h2>
          <p className="mt-2 text-sm text-red-900/80">
            Record a reason so the applicant understands this decision.
          </p>
          <form action={formAction} className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-red-900" htmlFor="rejection-reason">
                Rejection reason
              </label>
              <textarea
                aria-describedby={validationError ? "rejection-reason-error" : undefined}
                aria-invalid={Boolean(validationError)}
                className="min-h-28 w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-dark outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300 aria-[invalid=true]:border-red-500"
                id="rejection-reason"
                name="reason"
                onChange={(event) => {
                  setReason(event.target.value);
                  if (validationError) {
                    setValidationError(undefined);
                  }
                }}
                value={reason}
              />
              {validationError ? (
                <p className="text-sm text-red-700" id="rejection-reason-error" role="alert">
                  {validationError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-800 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pending}
                onClick={closeDialog}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pending}
                type="submit"
              >
                {pending ? "Rejecting..." : "Confirm rejection"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
