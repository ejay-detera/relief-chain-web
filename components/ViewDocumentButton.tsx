"use client";

import { useState, useTransition } from "react";
import { FileText, Loader2 } from "lucide-react";

type DocumentUrlResult = { url: string } | { error: string };
type GetDocumentUrlAction = (documentReference: string) => Promise<DocumentUrlResult>;

type ViewDocumentButtonProps = {
  documentReference: string;
  getDocumentUrlAction?: GetDocumentUrlAction;
};

const unavailableAction: GetDocumentUrlAction = async () => ({
  error: "Document viewing is unavailable.",
});

export default function ViewDocumentButton({
  documentReference,
  getDocumentUrlAction = unavailableAction,
}: ViewDocumentButtonProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(undefined);
    startTransition(async () => {
      const result = await getDocumentUrlAction(documentReference);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div className="space-y-2">
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 bg-white px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="animate-spin" size={16} />
        ) : (
          <FileText aria-hidden="true" size={16} />
        )}
        {isPending ? "Opening document..." : "View document"}
      </button>
      {error ? (
        <p aria-live="polite" className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
