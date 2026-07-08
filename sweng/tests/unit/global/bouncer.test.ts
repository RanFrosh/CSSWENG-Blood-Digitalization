// tests for helpGateKeep function in bouncer.ts
// helpGateKeep checks who the user is, if they have a role, and if their role allows the action.
// we mock ProfileSessionProvider to simulate a user session.

import { helpGateKeep} from "@/app/global/helper_bouncer/bouncer";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";

const mockChecker: jest.Mocked<ProfileSessionProvider> = {
    getCurrentUser: jest.fn(),
};

// reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

describe("helpGateKeep", () => {

    // no active session
    it("returns failure when getCurrentUser fails", async () => {
        mockChecker.getCurrentUser.mockResolvedValue({ success: false, message: "No session found" });

        const result = await helpGateKeep(mockChecker, "view_event");

        expect(result.success).toBe(false);
        expect(result.message).toBe("No session found");
    });

    // user has no role
    it("returns failure when user has no role", async () => {
        mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role: undefined } as any });

        const result = await helpGateKeep(mockChecker, "view_event");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Somehow there is no role");
    });

    // user has a role but doesn't have the required permission
    it("returns failure when user lacks permission", async () => {
        mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role: "med_prof"} as any });

        const result = await helpGateKeep(mockChecker, "delete_donor");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Not authorized");
    });

    // user has a role with the required permission
    it("returns success when user role has permission", async () => {
        mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role: "onsite_admin" } as any });
        
        const result = await helpGateKeep(mockChecker, "view_event");

        expect(result.success).toBe(true);
        expect(result.message).toBe("Authorized");
    });

    // super admin can do everything regardless of action
    it("returns success for super_admin on any action", async () => {
        mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role: "super_admin" } as any });

        const result = await helpGateKeep(mockChecker, "delete_donor");

        expect(result.success).toBe(true);
        expect(result.message).toBe("Authorized");
    });

    // test all roles that have permission to view_event 
    it("returns success for all roles with view_event permission", async () => {
        const allowedRoles = ["onsite_admin", "med_prof", "director", "staff_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "view_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to create_event
    it("returns success for all roles with create_event permission", async () => {
        const allowedRoles = ["onsite_admin", "med_prof", "director", "staff_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "create_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to view_correct_event
    it("returns success for all roles with view_correct_event permission", async () => {
        const allowedRoles = ["onsite_admin", "med_prof", "director", "staff_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "view_correct_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to create_correct_event
    it("returns success for all roles with create_correct_event permission", async () => {
        const allowedRoles = ["onsite_admin", "med_prof", "director", "staff_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "create_correct_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });
});