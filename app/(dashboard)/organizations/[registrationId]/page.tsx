import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import RegistrationDetail from "@/components/RegistrationDetail";
import {
  approveRegistrationAction,
  getRegistrationDocumentUrlAction,
  rejectRegistrationAction,
} from "./actions";
import {
  suspendOrganizationAction,
  reactivateOrganizationAction,
  deactivateOrganizationAction,
} from "./org-actions";
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
        href="/organizations"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary/60 underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ChevronLeft aria-hidden="true" size={16} />
        Back to organizations
      </Link>
      <h2 id="registration-page-title" className="sr-only">
        Organization registration details
      </h2>
      <RegistrationDetail
        approveAction={approveRegistrationAction}
        getDocumentUrlAction={getRegistrationDocumentUrlAction}
        rejectAction={rejectRegistrationAction}
        suspendAction={suspendOrganizationAction}
        reactivateAction={reactivateOrganizationAction}
        deactivateAction={deactivateOrganizationAction}
        registration={registration}
      />
    </section>
  );
}
