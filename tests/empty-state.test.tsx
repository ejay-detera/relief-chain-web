import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import EmptyState from "@/components/EmptyState";

// Feature: organization-registration-review, Requirement 4.4
// No registrations submitted shows the no-review message and no selectable row.
describe("EmptyState", () => {
  afterEach(() => cleanup());

  it("shows the no-registrations message without a selectable row", () => {
    const { container } = render(<EmptyState />);

    expect(
      screen.getByRole("heading", { name: "No registrations to review" }),
    ).not.toBeNull();
    expect(container.querySelectorAll("li")).toHaveLength(0);
    expect(container.querySelectorAll("a, button")).toHaveLength(0);
  });
});
