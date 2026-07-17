import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  Store,
  Users,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/dashboard/organizations", icon: Building2 },
  { label: "Merchants", href: "/dashboard/merchants", icon: Store, disabled: true },
  { label: "Programs", href: "/dashboard/programs", icon: ClipboardCheck, disabled: true },
  { label: "Beneficiaries", href: "/dashboard/beneficiaries", icon: Users, disabled: true },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, disabled: true },
];
