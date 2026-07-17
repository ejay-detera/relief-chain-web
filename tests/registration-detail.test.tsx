import { cleanup, render } from "@testing-library/react";
import fc from "fast-check";
import { afterEach, describe, expect, it } from "vitest";

import RegistrationDetail from "@/components/RegistrationDetail";
import type { Registration, RegistrationStatus } from "@/lib/registrations/types";

const registrationArbitrary: fc.Arbitrary<Registration> = fc.record({
  id: fc.uuid(),
  organizationName: fc.stringMatching(/[A-Za-z][A-Za-z0-9 ]{0,24}/),
  organizationType: fc.string({ minLength: 1, maxLength: 20 }),
  contactInfo: fc.string({ minLength: 1, maxLength: 30 }),
  representative: fc.record({
    firstName: fc.string({ minLength: 1, maxLength: 15 }),
    lastName: fc.string({ minLength: 1, maxLength: 15 }),
    middleInitial: fc.option(fc.stringMatching(/[A-Z]/), { nil: null }),
    position: fc.string({ minLength: 1, maxLength: 15 }),
  }),
  documentReference: fc.string({ minLength: 1, maxLength: 30 }),
  status: fc.constantFrom<RegistrationStatus>("Pending", "Approved", "Rejected"),
  rejectionReason: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: null }),
  createdAt: fc.date({ noInvalidDate: true }).map((date) => date.toISOString()),
});

const rejectedRegistrationArbitrary = registrationArbitrary.chain((registration) =>
  fc.string({ minLength: 1, maxLength: 30 }).map((rejectionReason) => ({
    ...registration,
    status: "Rejected" as const,
    rejectionReason,
  })),
);

// Feature: organization-registration-review, Property 4: Detail view displays all required fields
// **Validates: Requirements 5.1, 5.2, 5.3**
describe("RegistrationDetail", () => {
  afterEach(() => cleanup());

  it("displays every required registration field", () => {
    fc.assert(
      fc.property(registrationArbitrary, (registration) => {
        const { container } = render(<RegistrationDetail registration={registration} />);
        const content = container.textContent ?? "";
        const representative = [
          registration.representative.firstName,
          registration.representative.middleInitial,
          registration.representative.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        expect(content).toContain(registration.organizationName);
        expect(content).toContain(registration.organizationType);
        expect(content).toContain(registration.contactInfo);
        expect(content).toContain(representative);
        expect(content).toContain(registration.representative.position);
        expect(content).toContain(registration.documentReference);
        expect(content).toContain(registration.status);

        cleanup();
      }),
      { numRuns: 100 },
    );
  });

  it("displays the exact rejection reason for every rejected registration", () => {
    fc.assert(
      fc.property(rejectedRegistrationArbitrary, (registration) => {
        const { container } = render(<RegistrationDetail registration={registration} />);
        const reasonElement = container.querySelector<HTMLElement>(
          "#rejection-reason-title + p",
        );

        expect(reasonElement).not.toBeNull();
        expect(reasonElement?.textContent).toBe(registration.rejectionReason);

        cleanup();
      }),
      { numRuns: 100 },
    );
  });

  it("shows the rejection reason only for rejected registrations", () => {
    const rejected: Registration = {
      id: "rejected-registration",
      organizationName: "San Isidro LGU",
      organizationType: "Local Government Unit",
      contactInfo: "San Isidro, Laguna",
      representative: {
        firstName: "Ana",
        lastName: "Santos",
        middleInitial: null,
        position: "Mayor",
      },
      documentReference: "documents/rejected.pdf",
      status: "Rejected",
      rejectionReason: "Please provide a current accreditation document.",
      createdAt: "2026-07-16T10:00:00.000Z",
    };
    const pending = { ...rejected, status: "Pending" as const };

    const rejectedView = render(<RegistrationDetail registration={rejected} />);
    expect(rejectedView.container.textContent).toContain(rejected.rejectionReason);
    rejectedView.unmount();

    const pendingView = render(<RegistrationDetail registration={pending} />);
    expect(pendingView.container.textContent).not.toContain(rejected.rejectionReason);
  });

  // Feature: organization-registration-review, Property 6: Approve/Reject options are available if and only if status is Pending
  // **Validates: Requirements 6.1, 6.3, 7.1, 7.4**
  it("shows both review actions only while a registration is pending", () => {
    fc.assert(
      fc.property(registrationArbitrary, (registration) => {
        const { container } = render(<RegistrationDetail registration={registration} />);
        const content = container.textContent ?? "";
        const hasApproveOption = content.includes("Approve registration");
        const hasRejectOption = content.includes("Reject registration");

        if (registration.status === "Pending") {
          expect(hasApproveOption).toBe(true);
          expect(hasRejectOption).toBe(true);
        } else {
          expect(hasApproveOption).toBe(false);
          expect(hasRejectOption).toBe(false);
        }

        cleanup();
      }),
      { numRuns: 100 },
    );
  });

  it("shows neither review action after a decision", () => {
    const registration = {
      id: "approved-registration",
      organizationName: "San Isidro LGU",
      organizationType: "Local Government Unit",
      contactInfo: "San Isidro, Laguna",
      representative: {
        firstName: "Ana",
        lastName: "Santos",
        middleInitial: null,
        position: "Mayor",
      },
      documentReference: "documents/approved.pdf",
      status: "Approved" as const,
      rejectionReason: null,
      createdAt: "2026-07-16T10:00:00.000Z",
    };

    const { container } = render(<RegistrationDetail registration={registration} />);

    expect(container.textContent).not.toContain("Approve registration");
    expect(container.textContent).not.toContain("Reject registration");
  });
});
