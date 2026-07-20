import { ApiResponse } from "@/types/api_res_type";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../global/helper_bouncer/bouncer";
import { AnalyticsController, AnalyticsData } from "@/abstract/analytics/analytics_abstract";

export class ImpAnalyticsManager implements AnalyticsController {
    private analyticsModel: AnalyticsData;
    private profileReader: ProfileSessionProvider;

    constructor(injectAnalyticsModel: AnalyticsData, injectProfileReader: ProfileSessionProvider) {
        this.analyticsModel = injectAnalyticsModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetDirectorStats(): Promise<ApiResponse<any>> {
    
        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');
        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const totalActiveDonors = await this.analyticsModel.countActiveDonors();
            const donorDemographics = await this.analyticsModel.getDonorBloodTypeBreakdown();

            // Hardcoded data
            const showUpRates = { registered: 150, attended: 112, ratePercent: 74.6 };
            const extractionGoals = { targetGoal: 500, currentCollected: 312, progressPercent: 62.4 };

        
            return {
                success: true,
                message: "Analytics retrieved successfully",
                data: {
                    totalActiveDonors,
                    donorDemographics,
                    showUpRates,
                    extractionGoals
                }
            };
        } catch (error: any) {
            console.error("Analytics Manager Error:", error);
            return { success: false, message: "Failed to fetch analytics data" };
        }
    }
}