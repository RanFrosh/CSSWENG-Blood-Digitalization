import { ImpAssignedStaffModel } from "@/queries/assigned_staff_query";

describe("ImpAssignedStaffModel", () => {
    describe("getStaff", () => {
        it("returns staff list when staff are assigned", async () => {
            // real code calls access.select().from().where(...) — no .limit(),
            // so .where() resolves directly to the data
            const mockStaff = [{ id: 1n, event_log_id: 10n }, { id: 2n, event_log_id: 10n }];
            const mockWhere = jest.fn().mockResolvedValue(mockStaff);
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpAssignedStaffModel(mockAccess);
            const result = await model.getStaff(10n);

            expect(result.success).toBe(true);
            expect(result.message).toBe("Returning list of staff for event");
            expect(result.data).toEqual(mockStaff);
        });

        it("returns success with empty array when no staff are assigned", async () => {
            const mockWhere = jest.fn().mockResolvedValue([]);
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpAssignedStaffModel(mockAccess);
            const result = await model.getStaff(999n);

            expect(result.success).toBe(true);
            expect(result.message).toBe("No staff assigned");
            expect(result.data).toEqual([]);
        });

        it("returns failure when the query throws", async () => {
            const mockWhere = jest.fn().mockRejectedValue(new Error("DB connection failed"));
            const mockFrom = jest.fn(() => ({ where: mockWhere }));
            const mockSelect = jest.fn(() => ({ from: mockFrom }));
            const mockAccess = { select: mockSelect } as any;

            const model = new ImpAssignedStaffModel(mockAccess);
            const result = await model.getStaff(10n);

            expect(result.success).toBe(false);
            expect(result.message).toBe("DB connection failed");
        });
    });
});