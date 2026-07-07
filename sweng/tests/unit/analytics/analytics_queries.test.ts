import { ImpAnalyticsData } from "@/app/analytics/analytics_queries";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

jest.mock("@/db/drizzle", () => ({
    orm: {
        select: jest.fn(),
    },
}));

jest.mock("@/db/models/donor", () => ({
     donor: {
        active: "donor.active",
        blood: "donor.blood",
    },
}));

describe("ImpAnalyticsData", () => {
    const analyticsData = new ImpAnalyticsData();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("countActiveDonors", () => {
        function mockChain(resolvedValue: any) {
            const chain = {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue(resolvedValue),
            };
            (orm.select as jest.Mock).mockReturnValueOnce(chain);
            return chain;
          }

        it("returns the count of active donors as a number", async () => {
            mockChain([{ count: "12" }]);

            const result = await analyticsData.countActiveDonors();

            expect(result).toBe(12);
            expect(typeof result).toBe("number");
        });

        it("returns 0 when there are no active donors", async () => {
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

            expect(result).toEqual(breakdownRows);
        });

        it("returns an empty array when there are no active donors", async () => {
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