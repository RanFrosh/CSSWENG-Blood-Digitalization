import { ImpDonorManager } from "@/app/donoring/imp_donor_controller";
import { DonorData } from "@/abstract/donor/donor_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "@/utils/access/bouncer";

// mock helpGateKeep
jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
    helpGateKeep: jest.fn(),
}));
const mockedHelpGateKeep = helpGateKeep as jest.Mock;

describe("ImpDonorManager", () => {
    let mockDonorModel: jest.Mocked<DonorData>;
    let mockProfileReader: jest.Mocked<ProfileSessionProvider>;
    let donorManager: ImpDonorManager;

    beforeEach(() => {
        mockDonorModel = {
            getSingleDonor: jest.fn(),
            getDonorsByIds: jest.fn(),
        };
        mockProfileReader = {
            getCurrentUser: jest.fn(),
        };
        donorManager = new ImpDonorManager(mockDonorModel, mockProfileReader);
        mockedHelpGateKeep.mockReset(); // clear helpGateKeep's mock behavior between tests
    });

    describe("invokeGetSingleDonor", () => {
        it("returns the donor when authorized", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: { role: "med_prof" } });
            const mockDonor = { id: 1n, first_name: "Jane" };
            mockDonorModel.getSingleDonor.mockResolvedValue({ success: true, message: "Donor retrieved", data: mockDonor as any });

            const result = await donorManager.invokeGetSingleDonor({ id: 1n });

            // confirms the manager checks permissions with the right action name
            expect(mockedHelpGateKeep).toHaveBeenCalledWith(mockProfileReader, "viewdonor");
            // confirms the filter object is passed through to the model unchanged
            expect(mockDonorModel.getSingleDonor).toHaveBeenCalledWith({ id: 1n });
            expect(result.data).toEqual(mockDonor);
        });

        it("returns failure and skips model call when not authorized", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: false, message: "Not authorized" });

            const result = await donorManager.invokeGetSingleDonor({ id: 1n });

            // the model should never be reached if the permission check fails
            expect(mockDonorModel.getSingleDonor).not.toHaveBeenCalled();
            expect(result).toEqual({ success: false, message: "Not authorized" });
        });

        it("returns failure when authorized but profile data is missing", async () => {
            // helpGateKeep says success but data is undefined
            // must be treated as unauthorized
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: undefined });

            const result = await donorManager.invokeGetSingleDonor({ id: 1n });

            expect(mockDonorModel.getSingleDonor).not.toHaveBeenCalled();
            expect(result.success).toBe(false);
        });
    });

    describe("invokeGetDonorsByIds", () => {
        it("returns donors when authorized and ids are provided", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: { role: "med_prof" } });
            const mockDonors = [{ id: 1n }, { id: 2n }];
            mockDonorModel.getDonorsByIds.mockResolvedValue({ success: true, message: "Donors retrieved", data: mockDonors as any });

            const result = await donorManager.invokeGetDonorsByIds([1n, 2n]);

            expect(mockDonorModel.getDonorsByIds).toHaveBeenCalledWith([1n, 2n]);
            expect(result.data).toEqual(mockDonors);
        });

        it("returns empty array without calling the model when ids is empty", async () => {
            // authorization still runs first even on an empty id list
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: { role: "med_prof" } });

            const result = await donorManager.invokeGetDonorsByIds([]);

            expect(mockDonorModel.getDonorsByIds).not.toHaveBeenCalled();
            expect(result).toEqual({ success: true, message: "No IDs provided", data: [] });
        });

        it("returns failure and skips model call when not authorized", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: false, message: "Not authorized" });

            const result = await donorManager.invokeGetDonorsByIds([1n, 2n]);

            expect(mockDonorModel.getDonorsByIds).not.toHaveBeenCalled();
            expect(result).toEqual({ success: false, message: "Not authorized" });
        });
    });
});