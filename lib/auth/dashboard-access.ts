export type DashboardAccessDecision = {
  authorized: boolean;
  accessDenied: boolean;
  registrationDataExposed: boolean;
  terminateSession: boolean;
};

/**
 * Pure role decision for the server-side dashboard authorization boundary.
 * Supabase stores the Super Admin role as `super_admin`.
 */
export function getDashboardAccessDecision(
  role: unknown,
): DashboardAccessDecision {
  const authorized = role === "super_admin";

  return {
    authorized,
    accessDenied: !authorized,
    registrationDataExposed: authorized,
    terminateSession: !authorized,
  };
}
