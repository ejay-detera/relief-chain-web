"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Ban,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Tag,
  X,
  XCircle,
} from "lucide-react";

import type { Registration, RegistrationStatus } from "@/lib/registrations/types";

type RegistrationListProps = {
  registrations: Registration[];
};

const statusStyles: Record<RegistrationStatus, string> = {
  Pending: "bg-accent/20 text-dark border border-accent/40",
  Approved: "bg-primary/15 text-secondary border border-primary/30",
  Rejected: "bg-red-100 text-red-800 border border-red-200",
  Suspended: "bg-amber-100 text-amber-800 border border-amber-200",
  Deactivated: "bg-dark/10 text-dark/60 border border-dark/20",
};

// Hierarchy definition: Pending first, Active (Approved), Suspended, Deactivated, Rejected
const statusHierarchy: Record<RegistrationStatus, number> = {
  Pending: 1,
  Approved: 2,
  Suspended: 3,
  Deactivated: 4,
  Rejected: 5,
};

const statusTabConfig: {
  key: "all" | RegistrationStatus;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Approved", label: "Approved" },
  { key: "Suspended", label: "Suspended" },
  { key: "Deactivated", label: "Deactivated" },
  { key: "Rejected", label: "Rejected" },
];

function getStatusIcon(status: RegistrationStatus) {
  switch (status) {
    case "Pending":
      return <Clock size={12} className="shrink-0 stroke-[2.5]" />;
    case "Approved":
      return <CheckCircle2 size={12} className="shrink-0 stroke-[2.5]" />;
    case "Suspended":
      return <AlertTriangle size={12} className="shrink-0 stroke-[2.5]" />;
    case "Deactivated":
      return <Ban size={12} className="shrink-0 stroke-[2.5]" />;
    case "Rejected":
      return <XCircle size={12} className="shrink-0 stroke-[2.5]" />;
    default:
      return null;
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function RegistrationList({ registrations }: RegistrationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | RegistrationStatus>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract distinct categories from registrations
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of registrations) {
      if (r.organizationType?.trim()) {
        set.add(r.organizationType.trim());
      }
    }
    return Array.from(set).sort();
  }, [registrations]);

  // Counts per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: registrations.length,
      Pending: 0,
      Approved: 0,
      Suspended: 0,
      Deactivated: 0,
      Rejected: 0,
    };
    for (const r of registrations) {
      if (counts[r.status] !== undefined) {
        counts[r.status] += 1;
      }
    }
    return counts;
  }, [registrations]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of registrations) {
      const type = r.organizationType?.trim() || "Other";
      counts[type] = (counts[type] ?? 0) + 1;
    }
    return counts;
  }, [registrations]);

  // Filtered and hierarchical-sorted list
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((reg) => {
        // Status filter
        if (selectedStatus !== "all" && reg.status !== selectedStatus) {
          return false;
        }

        // Category filter
        if (selectedCategory !== "all" && reg.organizationType?.trim() !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const repName = [
            reg.representative?.firstName,
            reg.representative?.middleInitial,
            reg.representative?.lastName,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchName = reg.organizationName?.toLowerCase().includes(q);
          const matchType = reg.organizationType?.toLowerCase().includes(q);
          const matchContact = reg.contactInfo?.toLowerCase().includes(q);
          const matchRep = repName.includes(q);
          const matchPos = reg.representative?.position?.toLowerCase().includes(q);

          return Boolean(matchName || matchType || matchContact || matchRep || matchPos);
        }

        return true;
      })
      .sort((a, b) => {
        // Always maintain the hierarchy: Pending -> Active (Approved) -> Suspended -> Deactivated -> Rejected
        const rankA = statusHierarchy[a.status] ?? 99;
        const rankB = statusHierarchy[b.status] ?? 99;
        if (rankA !== rankB) {
          return rankA - rankB;
        }

        // Secondary sort: most recent first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [registrations, selectedStatus, selectedCategory, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedStatus !== "all" || selectedCategory !== "all";

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedCategory("all");
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search Input & Category Dropdown */}
      <div className="flex flex-col gap-3 rounded-2xl border border-dark/10 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
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
            placeholder="Search by organization name, contact, representative..."
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

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="category-filter"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark/60 whitespace-nowrap"
          >
            <Tag size={13} className="text-secondary" />
            Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-dark/15 bg-white px-3 py-2 text-xs font-semibold text-secondary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/15 cursor-pointer shadow-2xs"
          >
            <option value="all">All Categories ({registrations.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({categoryCounts[cat] ?? 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Tabs (Hierarchical: All, Pending, Approved, Suspended, Deactivated, Rejected) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {statusTabConfig.map((tab) => {
          const count = statusCounts[tab.key] ?? 0;
          const active = selectedStatus === tab.key;
          const isAll = tab.key === "all";

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatus(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                active
                  ? "bg-secondary text-white shadow-xs"
                  : "border border-dark/10 bg-white text-dark/70 hover:bg-muted"
              }`}
            >
              {!isAll && getStatusIcon(tab.key as RegistrationStatus)}
              <span>
                {tab.label} ({count})
              </span>
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="ml-auto text-xs font-semibold text-secondary/60 hover:text-secondary underline underline-offset-4 cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Table Container or Empty Filter State */}
      {filteredRegistrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dark/10 bg-white py-16 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-secondary">
            <Filter size={24} />
          </div>
          <p className="mt-3 text-base font-bold text-secondary">No organizations found</p>
          <p className="mt-1 text-xs text-dark/50 max-w-sm">
            {hasActiveFilters
              ? "No organization records match your current search, status, or category filter."
              : "No organization registrations are currently registered."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-4 rounded-xl border border-dark/15 bg-white px-4 py-2 text-xs font-semibold text-secondary hover:bg-muted cursor-pointer shadow-2xs"
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm">
          <table className="w-full text-left" aria-label="Organization registrations">
            <thead className="bg-muted/70 border-b border-dark/10">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-dark/50">
                  Organization
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-dark/50">
                  Category
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-dark/50">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-dark/50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/8">
              {filteredRegistrations.map((registration) => (
                <tr className="group transition hover:bg-muted/50" key={registration.id}>
                  {/* Organization Name & Details */}
                  <td className="px-6 py-4">
                    <Link
                      aria-label={`Review ${registration.organizationName} registration`}
                      className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      href={`/organizations/${registration.id}`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-white shadow-xs">
                        {initials(registration.organizationName)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-bold text-secondary group-hover:text-primary transition-colors">
                          {registration.organizationName}
                        </span>
                        <span className="block truncate text-xs text-dark/50">
                          {registration.contactInfo}
                        </span>
                      </span>
                    </Link>
                  </td>

                  {/* Category Pill */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-dark/10 bg-muted/60 px-2.5 py-1 text-xs font-semibold text-secondary">
                      <Building2 size={11} className="text-dark/50" />
                      {registration.organizationType}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[registration.status]}`}
                    >
                      {getStatusIcon(registration.status)}
                      <span className="sr-only">Registration status: </span>
                      {registration.status}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      className="inline-flex items-center justify-center rounded-lg border border-dark/15 bg-white px-3 py-1.5 text-xs font-semibold text-secondary transition hover:border-dark/30 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      href={`/organizations/${registration.id}`}
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer summary */}
          <div className="border-t border-dark/8 bg-muted/30 px-6 py-3 text-xs text-dark/50 flex items-center justify-between">
            <span>
              Showing {filteredRegistrations.length} of {registrations.length} organizations
            </span>
            {hasActiveFilters && (
              <span className="font-semibold text-secondary">Filtered results</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
