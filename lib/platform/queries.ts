import "server-only";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ActivityEvent,
  MonthlyDisbursement,
  PlatformStats,
  RoleBreakdownEntry,
} from "@/lib/platform/types";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function getPlatformStats(): Promise<PlatformStats> {
  await requireSuperAdmin();
  const supabase = await createServerSupabaseClient();

  const [profilesResult, programsResult, registrationsResult, disbursementsResult] =
    await Promise.all([
      supabase.from("profiles").select("role"),
      supabase.from("programs").select("status"),
      supabase.from("registrations").select("status"),
      supabase.from("disbursements").select("amount"),
    ]);

  const profiles = profilesResult.data ?? [];
  const programs = programsResult.data ?? [];
  const registrations = registrationsResult.data ?? [];
  const disbursements = disbursementsResult.data ?? [];

  return {
    organizations: profiles.filter((profile) => profile.role === "lgu").length,
    beneficiaries: profiles.filter((profile) => profile.role === "beneficiary").length,
    merchants: profiles.filter((profile) => profile.role === "merchant").length,
    activePrograms: programs.filter((program) => program.status === "active").length,
    pendingRegistrations: registrations.filter(
      (registration) => registration.status === "Pending",
    ).length,
    totalDisbursed: disbursements.reduce(
      (sum, disbursement) => sum + Number(disbursement.amount ?? 0),
      0,
    ),
  };
}

const DISBURSEMENT_HISTORY_MONTHS = 12;

export async function getMonthlyDisbursements(): Promise<MonthlyDisbursement[]> {
  await requireSuperAdmin();
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("disbursements")
    .select("amount, created_at")
    .order("created_at", { ascending: true });

  const totalsByMonth = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.created_at) continue;
    const date = new Date(row.created_at);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + Number(row.amount ?? 0));
  }

  // Always return a trailing 12-month window so the chart has a stable shape
  // even in a freshly seeded environment with sparse data. The client-side
  // chart filters this down to a shorter range without an extra round trip.
  const now = new Date();
  const months: MonthlyDisbursement[] = [];
  for (let offset = DISBURSEMENT_HISTORY_MONTHS - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    months.push({
      month: MONTH_LABELS[date.getMonth()],
      amount: totalsByMonth.get(key) ?? 0,
    });
  }

  return months;
}

export async function getRoleBreakdown(): Promise<RoleBreakdownEntry[]> {
  await requireSuperAdmin();
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase.from("profiles").select("role");
  const profiles = data ?? [];

  const counts = {
    lgu: profiles.filter((profile) => profile.role === "lgu").length,
    beneficiary: profiles.filter((profile) => profile.role === "beneficiary").length,
    merchant: profiles.filter((profile) => profile.role === "merchant").length,
  };

  return [
    { role: "lgu", label: "Organizations", count: counts.lgu },
    { role: "beneficiary", label: "Beneficiaries", count: counts.beneficiary },
    { role: "merchant", label: "Merchants", count: counts.merchant },
  ];
}

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export async function getRecentActivity(): Promise<ActivityEvent[]> {
  await requireSuperAdmin();
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("registrations")
    .select("id, organization_name, status, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(5);

  return (data ?? []).map((row) => {
    const kind: ActivityEvent["kind"] =
      row.status === "Approved"
        ? "approved"
        : row.status === "Rejected"
          ? "rejected"
          : "pending";

    const titleByKind: Record<ActivityEvent["kind"], string> = {
      approved: "Organization approved",
      rejected: "Organization rejected",
      pending: "Organization registration submitted",
      signup: "New sign-up",
    };

    return {
      id: row.id,
      title: titleByKind[kind],
      description: `"${row.organization_name}" is ${row.status.toLowerCase()}.`,
      occurredAt: timeAgo(row.updated_at ?? row.created_at),
      kind,
    };
  });
}
