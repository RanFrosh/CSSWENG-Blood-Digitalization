import { ImpDonorModel } from "@/app/donoring/imp_donor_data";

describe("ImpDonorModel", () => {
    describe("getSingleDonor", () => {
        it("returns donor when found", async () => {
            // mock the drizzle chain: code calls access.select().from().where().limit(1)
            // build fake objects that mirror each step
            // end with .limit() resolving to the actual fake data
            const mockLimit = jest.fn().mockResolvedValue([{ id: 1n, first_name: "John" }]);
            const mockWhere = jest.fn(() => ({ limit: mockLimit }));
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpDonorModel(mockAccess);
            const result = await model.getSingleDonor({ id: 1n });

            expect(result.success).toBe(true);
            expect(result.message).toBe("Donor retrieved");
            expect(result.data).toEqual({ id: 1n, first_name: "John" });
        });

        it("returns success with no data when donor not found", async () => {
            // .limit() resolves to an empty array
            // simulates "query ran fine, just no matching row"
            const mockLimit = jest.fn().mockResolvedValue([]);
            const mockWhere = jest.fn(() => ({ limit: mockLimit }));
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpDonorModel(mockAccess);
            const result = await model.getSingleDonor({ id: 999n });

            expect(result.success).toBe(true);
            expect(result.message).toBe("Donor not found");
            expect(result.data).toBeUndefined();
        });

        it("returns failure when the query throws", async () => {
            // .limit() rejects instead of resolving, simulating a DB error
            const mockLimit = jest.fn().mockRejectedValue(new Error("DB connection failed"));
            const mockWhere = jest.fn(() => ({ limit: mockLimit }));
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpDonorModel(mockAccess);
            const result = await model.getSingleDonor({ email: "test@test.com" });

            expect(result.success).toBe(false);
            expect(result.message).toBe("DB connection failed");
        });
    });

    describe("getDonorsByIds", () => {
        // shorter chain than getSingleDonor, no .limit() call here,
        // so .where() resolves directly to the data in every test below
        it("returns donors when found", async () => {
            const mockDonors = [{ id: 1n }, { id: 2n }];
            const mockWhere = jest.fn().mockResolvedValue(mockDonors);
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpDonorModel(mockAccess);
            const result = await model.getDonorsByIds([1n, 2n]);

            expect(result.success).toBe(true);
            expect(result.message).toBe("Donors retrieved");
            expect(result.data).toEqual(mockDonors);
        });

        it("returns empty array with success when no donors found", async () => {
            const mockWhere = jest.fn().mockResolvedValue([]);
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpDonorModel(mockAccess);
            const result = await model.getDonorsByIds([999n]);

            expect(result.success).toBe(true);
            expect(result.message).toBe("Donors not found");
            expect(result.data).toEqual([]);
        });

        it("returns failure when the query throws", async () => {
            const mockWhere = jest.fn().mockRejectedValue(new Error("Query failed"));
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpDonorModel(mockAccess);
            const result = await model.getDonorsByIds([1n]);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Query failed");
        });
    });
});