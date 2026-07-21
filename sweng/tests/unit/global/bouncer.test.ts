// tests for helpGateKeep function in bouncer.ts
// helpGateKeep checks who the user is, if they have a role, and if their role allows the action.
// we mock ProfileSessionProvider to simulate a user session.

import { helpGateKeep} from "@/app/global/helper_bouncer/bouncer";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";


describe("helpGateKeep", () => {
    const mockChecker: jest.Mocked<ProfileSessionProvider> = {
        getCurrentUser: jest.fn(),
    };

    // reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
        expect(result.message).toBe("Failed to identify role");
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
        const profile = { role: "onsite_admin" } as any;
        mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: profile });

        const result = await helpGateKeep(mockChecker, "view_event");

        expect(result.success).toBe(true);
        expect(result.message).toBe("Authorized");
        expect(result.data).toEqual(profile);
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
        const allowedRoles = ["onsite_admin", "med_prof", "director", "super_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "view_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to create_event
    it("returns success for all roles with create_event permission", async () => {
        const allowedRoles = ["onsite_admin", "med_prof", "director", "super_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "create_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to view_correct_event
    it("returns success for all roles with view_correct_event permission", async () => {
        const allowedRoles = ["onsite_admin", "med_prof", "director", "super_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "view_correct_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to create_correct_event
    it("returns success for all roles with create_correct_event permission", async () => {
        const allowedRoles = ["onsite_admin", "med_prof", "director", "super_admin"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "create_correct_event");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to retrieve_donors
    it("returns success for all roles with retrieve_donors permission", async () => {
        const allowedRoles = ["med_prof"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "retrieve_donors");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to edit_donor
    it("returns success for all roles with edit_donor permission", async () => {
        const allowedRoles = ["med_prof"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "edit_donor");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // test all roles that have permission to view_analytics
    it("returns success for all roles with view_analytics permission", async () => {
        const allowedRoles = ["director"];

        for (const role of allowedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "view_analytics");

            expect(result.success).toBe(true);
            expect(result.message).toBe("Authorized");
        }
    });

    // delete_donor has no allowed roles, so even valid roles should be unauthorized
    it("returns failure for all roles on delete_donor", async () => {
        const unauthorizedRoles = ["onsite_admin", "med_prof", "director", "lab_staff", "recov_staff", "donor"];

        for (const role of unauthorizedRoles) {
            mockChecker.getCurrentUser.mockResolvedValue({ success: true, message: "OK", data: { role } as any });

            const result = await helpGateKeep(mockChecker, "delete_donor");

            expect(result.success).toBe(false);
            expect(result.message).toBe("Not authorized");
        }
    });
});