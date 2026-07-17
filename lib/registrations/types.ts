export type RegistrationStatus = "Pending" | "Approved" | "Rejected";

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
  createdAt: string;
};
