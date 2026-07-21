import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../global/helper_bouncer/bouncer";
import { AnalyticsController, AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { assessment_status } from "@/db/enums/assessment_status";

export class ImpAnalyticsManager implements AnalyticsController {
    
    private analyticsModel: AnalyticsData;
    private profileReader: ProfileSessionProvider;

    constructor(injectAnalyticsModel: AnalyticsData, injectProfileReader: ProfileSessionProvider) {
        this.analyticsModel = injectAnalyticsModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetAllDonors() {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const dbDonors = await this.analyticsModel.getAllDonors();
            return { success: true, data: dbDonors };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async invokeGetDonorAnalytics(donorIdStr: string) {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const idString = donorIdStr.replace(/\D/g, ''); 
            const numericId = BigInt(idString); 

            const dbDonor = await this.analyticsModel.getDonorById(numericId);

            if (!dbDonor) {
                return { success: false, message: "Donor not found in database" };
            }

            return {
                success: true,
                data: {
                    id: `D-${String(dbDonor.id).padStart(3, '0')}`,
                    name: `${dbDonor.first_name} ${dbDonor.last_name}`,
                    sex: dbDonor.sex,
                    bloodType: dbDonor.blood,
                    mobile_no: dbDonor.mobile_no,
                    age: dbDonor.age,
                    email: dbDonor.email,
                    location: `${dbDonor.street}, ${dbDonor.zip_code}`,
                    verifiedBlood: dbDonor.verifiedBlood,
                    active: dbDonor.active,
                    height: dbDonor.height,
                    weight: dbDonor.weight,
                    assessment_status: dbDonor.assessment_status,
                    
                    // PLACEHOLDERS
                    totalVisits: 4,
                    mostRecentVisitDate: "2026-07-15",
                    mostRecentVisitEvent: "Blood Donation Drive",
                    bloodDonated: "1,350 mL",
                    bloodBagsFilled: 3,
                    successfulDonations: 3,
                    deferredVisits: 1,
                    nextEligibleDate: "2026-10-13"
                }
            };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async invokeGetDirectorStats() {
    
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