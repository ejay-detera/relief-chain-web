import EmptyState from "@/components/EmptyState";
import RegistrationList from "@/components/RegistrationList";
import { listRegistrations } from "@/lib/registrations/queries";

export default async function OrganizationsPage() {
  const registrations = await listRegistrations();

  return (
    <section aria-labelledby="dashboard-title" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Review queue
          </p>
          <h1 id="dashboard-title" className="text-3xl font-bold tracking-tight text-secondary">
            Organizations
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-dark/70">
            Review submitted organization applications and open a registration to see its details.
          </p>
        </div>
      </div>

      {registrations.length > 0 ? (
        <RegistrationList registrations={registrations} />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
