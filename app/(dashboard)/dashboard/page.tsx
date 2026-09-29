import { Building2, ClipboardCheck, PhilippinePeso, Store, Users } from "lucide-react";

import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import DisbursementChart from "@/components/dashboard/DisbursementChart";
import RoleDonutChart from "@/components/dashboard/RoleDonutChart";
import StatCard from "@/components/dashboard/StatCard";
import {
  getMonthlyDisbursements,
  getPlatformStats,
  getRecentActivity,
  getRoleBreakdown,
} from "@/lib/platform/queries";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function DashboardOverviewPage() {
  const [stats, monthlyDisbursements, roleBreakdown, recentActivity] = await Promise.all([
    getPlatformStats(),
    getMonthlyDisbursements(),
    getRoleBreakdown(),
    getRecentActivity(),
  ]);

  return (
    <section aria-labelledby="overview-title" className="space-y-8">
      {/* Page header */}
      <div className="rounded-2xl bg-secondary px-7 py-6 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Platform overview
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight" id="overview-title">
          Relief Chain Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Real-time metrics sourced from the Relief Chain platform.
        </p>
      </div>

      {/* Primary stat — aid distributed */}
      <StatCard
        helper="All time"
        icon={PhilippinePeso}
        label="Total aid distributed"
        tone="primary"
        value={formatCurrency(stats.totalDisbursed)}
      />

      {/* 5-col stat grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Building2} label="Organizations" value={stats.organizations.toLocaleString()} />
        <StatCard
          icon={ClipboardCheck}
          label="Pending approvals"
          value={stats.pendingRegistrations.toLocaleString()}
          tone={stats.pendingRegistrations > 0 ? "accent" : "default"}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Active programs"
          value={stats.activePrograms.toLocaleString()}
        />
        <StatCard icon={Users} label="Beneficiaries" value={stats.beneficiaries.toLocaleString()} />
        <StatCard icon={Store} label="Merchants" value={stats.merchants.toLocaleString()} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-dark/10 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-secondary">Monthly aid distribution</h2>
              <p className="text-sm text-dark/60">
                Volume of funds disbursed across all active programs.
              </p>
            </div>
          </div>
          <DisbursementChart data={monthlyDisbursements} />
        </div>

        <div className="rounded-2xl border border-dark/10 bg-white p-6 shadow-sm lg:col-span-4">
          <h2 className="mb-4 text-lg font-bold text-secondary">Platform composition</h2>
          <RoleDonutChart data={roleBreakdown} />
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-2xl border border-dark/10 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-secondary">Recent registration activity</h2>
        <ActivityTimeline events={recentActivity} />
      </div>
    </section>
  );
}
