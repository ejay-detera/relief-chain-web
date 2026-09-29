import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  ScrollText,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/organizations", icon: Building2 },
  { label: "Audit Log", href: "/audit-log", icon: ScrollText },
  { label: "Analytics", href: "/analytics", icon: BarChart3, disabled: true },
];
