import { ImpProfilesModel } from "@/app/profiles/imp_profiles_data";

describe("ImpProfilesModel", () => {
    describe("getProfiles", () => {
        it("returns profiles when matching ids exist", async () => {

            const mockProfiles = [{ id: "1" }, { id: "2" }];
            const mockWhere = jest.fn().mockResolvedValue(mockProfiles);
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpProfilesModel(mockAccess);
            const result = await model.getProfiles(["1", "2"]);

            expect(result.success).toBe(true);
            expect(result.message).toBe("Staff retrieved");
            expect(result.data).toEqual(mockProfiles);
        });

        it("returns failure with empty array when no profiles match", async () => {
            const mockWhere = jest.fn().mockResolvedValue([]);
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpProfilesModel(mockAccess);
            const result = await model.getProfiles(["999"]);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Staff do not exist");
            expect(result.data).toEqual([]);
        });

        it("returns failure when the query throws", async () => {
            const mockWhere = jest.fn().mockRejectedValue(new Error("DB connection failed"));
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpProfilesModel(mockAccess);
            const result = await model.getProfiles(["1"]);

            expect(result.success).toBe(false);
            expect(result.message).toBe("DB connection failed");
        });
    });
});
