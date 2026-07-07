import { ImpAnalyticsManager } from "@/app/analytics/analytics_controller";
import { helpGateKeep } from "@/app/global/helper_bouncer/bouncer";
import { AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";

jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
    helpGateKeep: jest.fn(),
}));

describe("ImpAnalyticsManager", () => {
    let analyticsModel: jest.Mocked<AnalyticsData>;
    let profileReader: ProfileSessionProvider;
    let manager: ImpAnalyticsManager;

    beforeEach(() => {
        jest.clearAllMocks();

        analyticsModel = {
            countActiveDonors: jest.fn(),
            getDonorBloodTypeBreakdown: jest.fn(),
        };
        profileReader = {} as ProfileSessionProvider;

        manager = new ImpAnalyticsManager(analyticsModel, profileReader);
    });

    describe("when the user is not authorized", () => {
        it("returns the failure response from the gate check without querying data", async () => {
            (helpGateKeep as jest.Mock).mockResolvedValue({
                success: false,
                message: "Not authorized",
            });

            const result = await manager.invokeGetDirectorStats();

            expect(result).toEqual({
                success: false,
                message: "Not authorized",
            });
            expect(analyticsModel.countActiveDonors).not.toHaveBeenCalled();
            expect(analyticsModel.getDonorBloodTypeBreakdown).not.toHaveBeenCalled();
        });

        it("checks authorization against the 'view_analytics' permission", async () => {
            (helpGateKeep as jest.Mock).mockResolvedValue({
                success: false,
                message: "Not authorized",
            });

            await manager.invokeGetDirectorStats();

            expect(helpGateKeep).toHaveBeenCalledWith(profileReader, "view_analytics");
        });
    });

    describe("when the user is authorized", () => {
        beforeEach(() => {
            (helpGateKeep as jest.Mock).mockResolvedValue({ success: true });
        });

        it("returns combined analytics data on success", async () => {
            analyticsModel.countActiveDonors.mockResolvedValue(42);
            analyticsModel.getDonorBloodTypeBreakdown.mockResolvedValue([
                { blood_type: "A+", count: 3 },
                { blood_type: "O-", count: 2 },
            ]);

            const result = await manager.invokeGetDirectorStats();

            expect(result.success).toBe(true);
            expect(result.data.totalActiveDonors).toBe(42);
            expect(result.data.donorDemographics).toEqual([
                { blood_type: "A+", count: 3 },
                { blood_type: "O-", count: 2 },
            ]);
        });

        it("includes the show-up rate and extraction goal figures in the response", async () => {
            analyticsModel.countActiveDonors.mockResolvedValue(0);
            analyticsModel.getDonorBloodTypeBreakdown.mockResolvedValue([]);

            const result = await manager.invokeGetDirectorStats();

            // TODO: subject to change after hardcoded values are replaced with actual logic
            expect(result.data.showUpRates).toEqual(
                expect.objectContaining({
                        registered: expect.any(Number),
                        attended: expect.any(Number),
                        ratePercent: expect.any(Number),
                })
            );
            expect(result.data.extractionGoals).toEqual(
                expect.objectContaining({
                        targetGoal: expect.any(Number),
                        currentCollected: expect.any(Number),
                        progressPercent: expect.any(Number),
                })
            );
        });

        it("returns a failure response when countActiveDonors rejects", async () => {
            analyticsModel.countActiveDonors.mockRejectedValue(new Error("db timeout"));
            analyticsModel.getDonorBloodTypeBreakdown.mockResolvedValue([]);

            const result = await manager.invokeGetDirectorStats();

            expect(result).toEqual({
                success: false,
                message: "Failed to fetch analytics data",
            });
        });

        it("returns a failure response when getDonorBloodTypeBreakdown rejects", async () => {
            analyticsModel.countActiveDonors.mockResolvedValue(10);
            analyticsModel.getDonorBloodTypeBreakdown.mockRejectedValue(
                new Error("db timeout")
            );

            const result = await manager.invokeGetDirectorStats();

            expect(result).toEqual({
                success: false,
                message: "Failed to fetch analytics data",
            });
        });
    });
});