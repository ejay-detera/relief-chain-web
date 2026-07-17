import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  helper?: string;
  tone?: "default" | "primary";
};

export default function StatCard({ label, value, icon: Icon, helper, tone = "default" }: StatCardProps) {
  const isPrimary = tone === "primary";

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
        isPrimary ? "border-secondary bg-secondary text-white" : "border-dark/10 bg-white"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isPrimary ? "bg-white/15 text-white" : "bg-primary/15 text-secondary"
          }`}
        >
          <Icon aria-hidden="true" size={20} />
        </span>
        {helper ? (
          <span
            className={`text-xs font-bold ${isPrimary ? "text-white/70" : "text-dark/50"}`}
          >
            {helper}
          </span>
        ) : null}
      </div>
      <p
        className={`mb-1 text-xs font-bold uppercase tracking-wide ${
          isPrimary ? "text-white/70" : "text-dark/50"
        }`}
      >
        {label}
      </p>
      <p className={`text-2xl font-bold ${isPrimary ? "text-white" : "text-secondary"}`}>
        {value}
      </p>
    </div>
  );
}
