import { ImpProfilesManager } from "@/app/profiles/imp_profiles_controller";
import { ProfilesData } from "@/abstract/profiles/profiles_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "@/app/global/helper_bouncer/bouncer";
import { ReadProfile } from "@/types/profile_type";

jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
    helpGateKeep: jest.fn(),
}));
const mockedHelpGateKeep = helpGateKeep as jest.Mock;

describe("ImpProfilesManager", () => {
    let mockProfilesModel: jest.Mocked<ProfilesData>;
    let mockProfileReader: jest.Mocked<ProfileSessionProvider>;
    let profilesManager: ImpProfilesManager;

    beforeEach(() => {
        mockProfilesModel = {
            getProfiles: jest.fn(),
        };
        mockProfileReader = {
            getCurrentUser: jest.fn(),
        };
        profilesManager = new ImpProfilesManager(mockProfilesModel, mockProfileReader);
        mockedHelpGateKeep.mockReset();
    });

    describe("invokeGetProfiles", () => {
        it("returns profiles when authorized", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: { role: "director" } });
            const mockProfiles = [{ id: "1" }, { id: "2" }] as unknown as ReadProfile[];
            mockProfilesModel.getProfiles.mockResolvedValue({ success: true, message: "Returning profiles", data: mockProfiles });

            const ids = ["1", "2"];
            const result = await profilesManager.invokeGetProfiles(ids);

            expect(mockedHelpGateKeep).toHaveBeenCalledWith(mockProfileReader, "viewprofiles");
            expect(mockProfilesModel.getProfiles).toHaveBeenCalledWith(ids);
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockProfiles);
        });

        it("returns failure and skips model call when not authorized", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: false, message: "Not authorized" });

            const result = await profilesManager.invokeGetProfiles(["1"]);

            expect(mockProfilesModel.getProfiles).not.toHaveBeenCalled();
            expect(result).toEqual({ success: false, message: "Not authorized" });
        });

        it("returns failure when authorized but profile data is missing", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: undefined });

            const result = await profilesManager.invokeGetProfiles(["1"]);

            expect(mockProfilesModel.getProfiles).not.toHaveBeenCalled();
            expect(result.success).toBe(false);
        });

        it("propagates failure result from the model", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: { role: "director" } });
            mockProfilesModel.getProfiles.mockResolvedValue({ success: false, message: "No profiles found" });

            const result = await profilesManager.invokeGetProfiles(["999"]);

            expect(result).toEqual({ success: false, message: "No profiles found" });
        });

        it("passes an empty ids array through to the model", async () => {
            mockedHelpGateKeep.mockResolvedValue({ success: true, message: "Authorized", data: { role: "director" } });
            mockProfilesModel.getProfiles.mockResolvedValue({ success: true, message: "Returning profiles", data: [] });

            const result = await profilesManager.invokeGetProfiles([]);

            expect(mockProfilesModel.getProfiles).toHaveBeenCalledWith([]);
            expect(result.data).toEqual([]);
        });
    });
});
