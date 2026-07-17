import ApproveButton from "@/components/ApproveButton";
import RejectDialog from "@/components/RejectDialog";
import ViewDocumentButton from "@/components/ViewDocumentButton";
import type { Registration } from "@/lib/registrations/types";

type MutationResult = { success: true } | { error: string };
type ApproveAction = (registrationId: string) => Promise<MutationResult>;
type RejectAction = (
  registrationId: string,
  formData: FormData,
) => Promise<MutationResult>;
type DocumentUrlResult = { url: string } | { error: string };
type GetDocumentUrlAction = (documentReference: string) => Promise<DocumentUrlResult>;

type RegistrationDetailProps = {
  registration: Registration;
  approveAction?: ApproveAction;
  rejectAction?: RejectAction;
  getDocumentUrlAction?: GetDocumentUrlAction;
};

const statusStyles: Record<Registration["status"], string> = {
  Pending: "bg-accent/20 text-dark",
  Approved: "bg-primary/20 text-secondary",
  Rejected: "bg-red-100 text-red-800",
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-sm font-semibold uppercase tracking-wide text-dark/60">
        {label}
      </dt>
      <dd className="text-base text-secondary">{value}</dd>
    </div>
  );
}

export default function RegistrationDetail({
  registration,
  approveAction,
  rejectAction,
  getDocumentUrlAction,
}: RegistrationDetailProps) {
  const representativeName = [
    registration.representative.firstName,
    registration.representative.middleInitial,
    registration.representative.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      aria-labelledby="registration-detail-title"
      className="space-y-8 rounded-2xl border border-dark/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <header className="flex flex-col gap-4 border-b border-dark/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Registration detail
          </p>
          <h1
            id="registration-detail-title"
            className="text-3xl font-bold tracking-tight text-secondary"
          >
            {registration.organizationName}
          </h1>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[registration.status]}`}
        >
          <span className="sr-only">Registration status: </span>
          {registration.status}
        </span>
      </header>

      <dl className="grid gap-6 sm:grid-cols-2">
        <DetailField label="Organization name" value={registration.organizationName} />
        <DetailField label="Organization type" value={registration.organizationType} />
        <DetailField label="Contact information" value={registration.contactInfo} />
        <DetailField label="Authorized Representative name" value={representativeName} />
        <DetailField
          label="Authorized Representative position"
          value={registration.representative.position}
        />
        <div className="space-y-1 sm:col-span-2">
          <dt className="text-sm font-semibold uppercase tracking-wide text-dark/60">
            Uploaded document
          </dt>
          <dd className="space-y-2">
            <p className="text-base text-secondary">{registration.documentReference}</p>
            <ViewDocumentButton
              documentReference={registration.documentReference}
              getDocumentUrlAction={getDocumentUrlAction}
            />
          </dd>
        </div>
      </dl>

      {registration.status === "Rejected" ? (
        <section
          aria-labelledby="rejection-reason-title"
          className="rounded-xl border border-red-200 bg-red-50 p-5"
        >
          <h2
            id="rejection-reason-title"
            className="text-sm font-semibold uppercase tracking-wide text-red-800"
          >
            Rejection reason
          </h2>
          <p className="mt-2 text-red-950">
            {registration.rejectionReason ?? "No rejection reason was recorded."}
          </p>
        </section>
      ) : null}

      {registration.status === "Pending" ? (
        <div
          aria-label="Registration review actions"
          className="flex flex-wrap gap-3 border-t border-dark/10 pt-6"
        >
          <ApproveButton
            approveAction={approveAction}
            registrationId={registration.id}
            status={registration.status}
          />
          <RejectDialog
            rejectAction={rejectAction}
            registrationId={registration.id}
            status={registration.status}
          />
        </div>
      ) : null}
    </article>
  );
}
