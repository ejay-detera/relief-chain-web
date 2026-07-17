import assert from 'node:assert/strict';
import fc from 'fast-check';
import { test } from 'node:test';
import { getDashboardAccessDecision } from '../lib/auth/dashboard-access.ts';

const authenticatedRoleArbitrary = fc.constantFrom(
  'super_admin',
  'lgu',
  'beneficiary',
  'merchant',
);

const registrationArbitrary = fc.array(
  fc.record({
    id: fc.uuid(),
    organizationName: fc.string(),
    status: fc.constantFrom('Pending', 'Approved', 'Rejected'),
  }),
  { maxLength: 5 },
);

// Feature: organization-registration-review, Property 1: Role-based dashboard access is a pure function of role
// **Validates: Requirements 2.1, 2.2, 2.3**
test('role-based dashboard access exposes Registration data only to Super_Admin', () => {
  fc.assert(
    fc.property(
      authenticatedRoleArbitrary,
      registrationArbitrary,
      (role, registrations) => {
        const decision = getDashboardAccessDecision(role);
        const renderedRegistrationData = decision.registrationDataExposed
          ? registrations
          : null;
        const isSuperAdmin = role === 'super_admin';

        assert.equal(decision.authorized, isSuperAdmin);
        assert.equal(decision.accessDenied, !isSuperAdmin);
        assert.equal(decision.terminateSession, !isSuperAdmin);
        assert.equal(decision.registrationDataExposed, isSuperAdmin);

        if (isSuperAdmin) {
          assert.deepEqual(renderedRegistrationData, registrations);
        } else {
          assert.equal(renderedRegistrationData, null);
        }
      },
    ),
    { numRuns: 100 },
  );
});
