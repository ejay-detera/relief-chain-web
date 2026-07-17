export type PlatformStats = {
  organizations: number;
  beneficiaries: number;
  merchants: number;
  activePrograms: number;
  pendingRegistrations: number;
  totalDisbursed: number;
};

export type MonthlyDisbursement = {
  month: string;
  amount: number;
};

export type RoleBreakdownEntry = {
  role: "lgu" | "beneficiary" | "merchant";
  label: string;
  count: number;
};

export type ActivityEvent = {
  id: string;
  title: string;
  description: string;
  occurredAt: string;
  kind: "approved" | "rejected" | "pending" | "signup";
};
