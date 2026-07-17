import { cleanup, render } from "@testing-library/react";
import fc from "fast-check";
import { afterEach, describe, expect, it } from "vitest";

import RegistrationList from "@/components/RegistrationList";
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
  rejectionReason: fc.option(fc.string({ maxLength: 30 }), { nil: null }),
  createdAt: fc.date({ noInvalidDate: true }).map((date) => date.toISOString()),
});

const registrationListArbitrary = fc.uniqueArray(registrationArbitrary, {
  selector: (registration) => registration.id,
  maxLength: 8,
});

const registrationSelectionArbitrary = registrationListArbitrary
  .filter((registrations) => registrations.length > 0)
  .chain((registrations) =>
    fc.integer({ min: 0, max: registrations.length - 1 }).map((index) => ({
      registrations,
      selected: registrations[index]!,
    })),
  );

// Feature: organization-registration-review, Property 2: Registration list shows every Registration with its required fields
// **Validates: Requirements 4.1, 4.2**
describe("RegistrationList", () => {
  afterEach(() => cleanup());

  it("renders exactly one row per registration with its organization name and status", () => {
    fc.assert(
      fc.property(registrationListArbitrary, (registrations) => {
        const { container } = render(<RegistrationList registrations={registrations} />);

        expect(container.querySelectorAll("tbody tr")).toHaveLength(registrations.length);
        for (const registration of registrations) {
          const row = container
            .querySelector<HTMLAnchorElement>(
              `a[href="/dashboard/organizations/${registration.id}"]`,
            )
            ?.closest("tr");
          expect(row).not.toBeNull();
          expect(row?.textContent).toContain(registration.organizationName);
          expect(row?.textContent).toContain(registration.status);
        }

        cleanup();
      }),
      { numRuns: 100 },
    );
  });
});

// Feature: organization-registration-review, Property 3: Selecting a Registration opens its own detail view
// **Validates: Requirements 4.3**
describe("RegistrationList detail selection", () => {
  afterEach(() => cleanup());

  it("targets the exact selected registration and preserves its visible list data", () => {
    fc.assert(
      fc.property(registrationSelectionArbitrary, ({ registrations, selected }) => {
        const { container } = render(<RegistrationList registrations={registrations} />);
        const expectedHref = `/dashboard/organizations/${selected.id}`;
        const matchingLinks = [...container.querySelectorAll<HTMLAnchorElement>("a")].filter(
          (link) => link.getAttribute("href") === expectedHref,
        );
        const selectedLink = matchingLinks[0];

        expect(selectedLink).not.toBeUndefined();
        expect(selectedLink?.getAttribute("aria-label")).toBe(
          `Review ${selected.organizationName} registration`,
        );
        expect(selectedLink?.textContent).toContain(selected.organizationName);
        expect(selectedLink?.closest("tr")?.textContent).toContain(selected.status);
        expect(matchingLinks).toHaveLength(2);

        cleanup();
      }),
      { numRuns: 100 },
    );
  });
});
