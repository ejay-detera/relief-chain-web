export type RegistrationStatus = "Pending" | "Approved" | "Rejected" | "Suspended" | "Deactivated";

export type Registration = {
  id: string;
  organizationName: string;
  organizationType: string;
  contactInfo: string;
  representative: {
    firstName: string;
    lastName: string;
    middleInitial: string | null;
    position: string;
  };
  documentReference: string;
  status: RegistrationStatus;
  rejectionReason: string | null;
  suspensionReason?: string | null;
  createdAt: string;
};
