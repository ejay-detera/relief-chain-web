"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is unavailable
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied to clipboard!" : label}
      aria-label={copied ? "Copied to clipboard" : label}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-dark/10 bg-white px-2.5 py-1 text-xs font-semibold text-secondary shadow-xs transition hover:bg-muted hover:border-dark/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <Check aria-hidden="true" size={13} className="text-primary stroke-[2.5]" />
          <span className="font-bold text-primary">Copied</span>
        </>
      ) : (
        <>
          <Copy aria-hidden="true" size={13} className="text-dark/40" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
