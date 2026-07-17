import Link from "next/link";

import type { Registration, RegistrationStatus } from "@/lib/registrations/types";

type RegistrationListProps = {
  registrations: Registration[];
};

const statusStyles: Record<RegistrationStatus, string> = {
  Pending: "bg-accent/20 text-dark border border-accent/40",
  Approved: "bg-primary/15 text-secondary border border-primary/30",
  Rejected: "bg-red-100 text-red-800 border border-red-200",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function RegistrationList({ registrations }: RegistrationListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-dark/10 bg-white shadow-sm">
      <table className="w-full text-left" aria-label="Organization registrations">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-dark/50">
              Organization
            </th>
            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-dark/50">
              Status
            </th>
            <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-dark/50">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark/10">
          {registrations.map((registration) => (
            <tr className="group transition hover:bg-muted/60" key={registration.id}>
              <td className="px-6 py-4">
                <Link
                  aria-label={`Review ${registration.organizationName} registration`}
                  className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={`/dashboard/organizations/${registration.id}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-xs font-bold text-secondary">
                    {initials(registration.organizationName)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-secondary group-hover:text-secondary/80">
                      {registration.organizationName}
                    </span>
                    <span className="block text-xs text-dark/50">
                      {registration.organizationType}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${statusStyles[registration.status]}`}
                >
                  <span className="sr-only">Registration status: </span>
                  {registration.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  className="text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={`/dashboard/organizations/${registration.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
