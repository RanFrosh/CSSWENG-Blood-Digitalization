import { ImpAssignedStaffManager } from "@/app/assigned_staff/imp_assigned_staff_controller";
import { AssignedStaffData } from "@/abstract/assigned_staff/assigned_staff_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "@/utils/access/bouncer";

// mock helpGateKeep
jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
    helpGateKeep: jest.fn(),
}));
const mockedHelpGateKeep = helpGateKeep as jest.Mock;

describe("ImpAssignedStaffManager", () => {
    let mockStaffModel: jest.Mocked<AssignedStaffData>;
    let mockProfileReader: jest.Mocked<ProfileSessionProvider>;
    let staffManager: ImpAssignedStaffManager;

    beforeEach(() => {
        mockStaffModel = {
            getStaff: jest.fn(),
        };
        mockProfileReader = {
            getCurrentUser: jest.fn(),
        };
        staffManager = new ImpAssignedStaffManager(mockStaffModel, mockProfileReader);
        mockedHelpGateKeep.mockReset();
    });

    describe("invokeGetStaff", () => {
        it("returns staff list when authorized", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: { role: "director" } });
            const mockStaff = [{ id: 1n, event_log_id: 10n }];
            mockStaffModel.getStaff.mockResolvedValue({ success: true, message: "Returning list of staff for event", data: mockStaff as any });

            const result = await staffManager.invokeGetStaff(10n);

            // confirms the manager checks permissions with the right action name
            expect(mockedHelpGateKeep).toHaveBeenCalledWith(mockProfileReader, "view_assigned_staff");
            // confirms event_id is passed through to the model unchanged
            expect(mockStaffModel.getStaff).toHaveBeenCalledWith(10n);
            expect(result.data).toEqual(mockStaff);
        });

        it("returns failure and skips model call when not authorized", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: false, message: "Not authorized" });

            const result = await staffManager.invokeGetStaff(10n);

            expect(mockStaffModel.getStaff).not.toHaveBeenCalled();
            expect(result).toEqual({ success: false, message: "Not authorized" });
        });

        it("returns failure when authorized but profile data is missing", async () => {
            // helpGateKeep says success but data is undefined, so it must be treated as unauthorized
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: undefined });

            const result = await staffManager.invokeGetStaff(10n);

            expect(mockStaffModel.getStaff).not.toHaveBeenCalled();
            expect(result.success).toBe(false);
        });
    });
});