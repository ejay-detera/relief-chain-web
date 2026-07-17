import Link from "next/link";
import { notFound } from "next/navigation";

import RegistrationDetail from "@/components/RegistrationDetail";
import {
  approveRegistrationAction,
  getRegistrationDocumentUrlAction,
  rejectRegistrationAction,
} from "@/app/dashboard/organizations/[registrationId]/actions";
import { getRegistration } from "@/lib/registrations/queries";

export default async function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = await params;
  const registration = await getRegistration(registrationId);

  if (!registration) {
    notFound();
  }

  return (
    <section aria-labelledby="registration-page-title" className="space-y-6">
      <Link
        href="/dashboard/organizations"
        className="inline-flex items-center text-sm font-semibold text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span aria-hidden="true">←</span>
        <span className="ml-2">Back to registrations</span>
      </Link>
      <h2 id="registration-page-title" className="sr-only">
        Organization registration details
      </h2>
      <RegistrationDetail
        approveAction={approveRegistrationAction}
        getDocumentUrlAction={getRegistrationDocumentUrlAction}
        rejectAction={rejectRegistrationAction}
        registration={registration}
      />
    </section>
  );
}
