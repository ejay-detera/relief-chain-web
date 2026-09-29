import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  helper?: string;
  tone?: "default" | "primary" | "accent";
  trend?: { value: string; positive: boolean };
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  helper,
  tone = "default",
  trend,
}: StatCardProps) {
  const isPrimary = tone === "primary";
  const isAccent = tone === "accent";

  const containerClass = isPrimary
    ? "border-secondary bg-secondary text-white shadow-md"
    : isAccent
      ? "border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5"
      : "border-dark/10 bg-white hover:shadow-md";

  const iconBgClass = isPrimary
    ? "bg-white/15 text-white"
    : isAccent
      ? "bg-primary/20 text-secondary"
      : "bg-primary/10 text-secondary";

  const labelClass = isPrimary
    ? "text-white/60"
    : "text-dark/50";

  const valueClass = isPrimary
    ? "text-white"
    : "text-secondary";

  return (
    <div
      className={`rounded-2xl border p-5 transition-shadow duration-200 ${containerClass}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClass}`}
        >
          <Icon aria-hidden="true" size={20} />
        </span>
        {helper ? (
          <span className={`text-xs font-semibold ${isPrimary ? "text-white/50" : "text-dark/40"}`}>
            {helper}
          </span>
        ) : null}
      </div>
      <p className={`mb-0.5 text-[11px] font-bold uppercase tracking-wider ${labelClass}`}>
        {label}
      </p>
      <p className={`text-2xl font-extrabold tracking-tight ${valueClass}`}>{value}</p>
      {trend ? (
        <p
          className={`mt-1.5 text-xs font-semibold ${
            trend.positive
              ? isPrimary
                ? "text-primary"
                : "text-primary"
              : "text-red-500"
          }`}
        >
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      ) : null}
    </div>
  );
}
