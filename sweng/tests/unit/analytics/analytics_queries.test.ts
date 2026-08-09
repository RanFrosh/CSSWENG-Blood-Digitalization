import { ImpAnalyticsData } from "@/app/rbd/analytics/rbd_queries";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";

// Mock the ORM module so no real database connection is made
// Only orm.select is stubbed
jest.mock("@/db/drizzle", () => ({
    orm: {
        select: jest.fn(),
    },
}));

// Mock the donor schema object with plain string stand-ins
jest.mock("@/db/models/donor", () => ({
    donor: {
        active: "donor.active",
        blood: "donor.blood",
    },
}));

describe("ImpAnalyticsData", () => {
    // Instantiated once at the describe level rather than in beforeEach
    // ImpAnalyticsData holds no state
    const analyticsData = new ImpAnalyticsData();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("countActiveDonors", () => {
        // Construct a mock Drizzle query chain for countActiveDonors
        function mockChain(resolvedValue: any) {
            const chain = {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue(resolvedValue),
            };
            (orm.select as jest.Mock).mockReturnValueOnce(chain);
            return chain;
          }
        
        // Supabase/Drizzle returns count as a string from the DB driver
        // test if the implementation correctly converts the raw DB value
        // to a number
        it("returns the count of active donors as a number", async () => {
            mockChain([{ count: "12" }]);

            const result = await analyticsData.countActiveDonors();

            expect(result).toBe(12);
            expect(typeof result).toBe("number");
        });

        it("returns 0 when there are no active donors", async () => {
            // Confirms Number("0") correctly resolves to 0 rather than NaN
            mockChain([{ count: "0" }]);

            const result = await analyticsData.countActiveDonors();

            expect(result).toBe(0);
        });

        it("queries only the active donor population", async () => {
            const chain = mockChain([{ count: "5" }]);

            await analyticsData.countActiveDonors();

            const whereArg = chain.where.mock.calls[0][0];
            expect(JSON.stringify(whereArg)).toContain("true");
        });

        it("propagates errors from the underlying query", async () => {
            // Manually construct the chain instead of using mockChain because
            // the .where method needs to reject rather than resolve
            // This test that ImpAnalyticsData has no try/catch for error handling
            const chain = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockRejectedValue(new Error("connection lost")),
            };
            (orm.select as jest.Mock).mockReturnValueOnce(chain);

            await expect(analyticsData.countActiveDonors()).rejects.toThrow(
                "connection lost"
            );
        });
    });

    describe("getDonorBloodTypeBreakdown", () => {
        function mockChain(resolvedValue: any) {
            const chain = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockResolvedValue(resolvedValue),
            };
            (orm.select as jest.Mock).mockReturnValueOnce(chain);
            return chain;
        }

        it("returns grouped active donor rows by blood type", async () => {
            const breakdownRows = [
                { blood_type: "A+", count: 3 },
                { blood_type: "O-", count: 2 },
            ];
            mockChain(breakdownRows);

            const result = await analyticsData.getDonorBloodTypeBreakdown();

            // perform a deep equality check tot confirm if the method returns
            // the query as-is
            expect(result).toEqual(breakdownRows);
        });

        it("returns an empty array when there are no active donors", async () => {
            // Verifies the method handles an empty result gracefull rather than
            // throwing
            mockChain([]);

            const result = await analyticsData.getDonorBloodTypeBreakdown();

            expect(result).toEqual([]);
        });

        it("groups by blood type", async () => {
            const chain = mockChain([{ blood_type: "B+", count: 1 }]);

            await analyticsData.getDonorBloodTypeBreakdown();

            expect(chain.groupBy).toHaveBeenCalledWith(donor.blood);
        });

        it("propagates errors from the underlying query", async () => {
            const chain = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockRejectedValue(new Error("connection lost")),
            };
            (orm.select as jest.Mock).mockReturnValueOnce(chain);

            await expect(
                analyticsData.getDonorBloodTypeBreakdown()
            ).rejects.toThrow("connection lost");
        });
    });
});