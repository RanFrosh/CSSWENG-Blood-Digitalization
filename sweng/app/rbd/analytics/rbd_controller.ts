import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../global/helper_bouncer/bouncer";
import { AnalyticsController, AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { ApiResponse } from "@/types/api_res_type";

export class ImpAnalyticsManager implements AnalyticsController {
    
    private analyticsModel: AnalyticsData;
    private profileReader: ProfileSessionProvider;

    constructor(injectAnalyticsModel: AnalyticsData, injectProfileReader: ProfileSessionProvider) {
        this.analyticsModel = injectAnalyticsModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetAllDonors(): Promise<ApiResponse<any>> {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const dbDonors = await this.analyticsModel.getAllDonors();
            return { success: true, message: "Donor retrived", data: dbDonors };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async invokeGetDonorAnalytics(donorIdStr: string): Promise<ApiResponse<any>> {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const idString = donorIdStr.replace(/\D/g, ''); 
            const numericId = BigInt(idString); 

            const [dbDonor, metrics, latestVisit] = await Promise.all([
                this.analyticsModel.getDonorById(numericId),
                this.analyticsModel.getDonorMetrics(numericId),
                this.analyticsModel.getLatestVisit(numericId)
            ]);

            if (!dbDonor) {
                return { success: false, message: "Donor not found in database" };
            }

            // Derive Blood Bags (Total mL / 450mL)
            const derivedBags = Math.floor(metrics.bloodDonatedML / 500);

            // 3-Month Eligibility
            let nextEligibleDate = undefined;
            let recentVisitEvent = "No previous visits";
            let recentVisitDate = "N/A";

            if (latestVisit) {
                recentVisitEvent = latestVisit.eventName;
                recentVisitDate = latestVisit.date;
                
                if (latestVisit.isSuccess && latestVisit.date) {
                    const lastDateObj = new Date(latestVisit.date);
                    lastDateObj.setMonth(lastDateObj.getMonth() + 3);
                    nextEligibleDate = lastDateObj.toISOString().split('T')[0];
                }
            }

            return {
                success: true,
                message: "Donor data retrieved",
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

                    totalVisits: metrics.totalVisits,
                    successfulDonations: metrics.successfulDonations,
                    deferredVisits: metrics.totalVisits - metrics.successfulDonations,
     
                    bloodDonated: `${(metrics.bloodDonatedML || 0).toLocaleString()} mL`,
                    bloodBagsFilled: derivedBags,
                    
                    recentVisitEvent: recentVisitEvent,          
                    recentVisitDate: recentVisitDate,      
                    nextEligibleDate: nextEligibleDate
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

    async invokeGetDirectorEvents(status: string): Promise<ApiResponse<any>> {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {

            const dbEvents = await this.analyticsModel.getEventsByStatus(status);
                        
            return { success: true, message: "Director events retrieved", data: dbEvents };
        } catch (error: any) {
            console.error("Event Manager Error:", error);
            return { success: false, message: "Failed to load events from the database." };
        }
    }

    async invokeGetEventAnalytics(eventIdStr: string): Promise<ApiResponse<any>> {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');
        
        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const numericId = BigInt(eventIdStr.replace(/\D/g, '')); 
            const dbEvent = await this.analyticsModel.getEventById(numericId);

            if (!dbEvent) {
                return { success: false, message: "Event not found" };
            }

            return {
                success: true,
                message: "Event analytics retrieved",
                data: {

                    id: `EVT-${String(dbEvent.id).padStart(3, '0')}`,
                    name: dbEvent.name,
                    partner: dbEvent.partner,
                    street: dbEvent.street,
                    event_date: dbEvent.event_date,
                    start_time: dbEvent.start_time,
                    end_time: dbEvent.end_time,
                    
                    // PLACEHOLDER
                    totalDonors: 145,
                    bloodDonated: "62,500 mL",
                    totalBagsProduced: 125,
                    showUpRate: "82%",
                    extractionGoal: 150,
                    bloodTypes: [
                        { bloodType: 'O+', count: 45 },
                        { bloodType: 'O-', count: 12 },
                        { bloodType: 'A+', count: 35 },
                        { bloodType: 'A-', count: 8 },
                        { bloodType: 'B+', count: 15 },
                        { bloodType: 'B-', count: 4 },
                        { bloodType: 'AB+', count: 5 },
                        { bloodType: 'AB-', count: 1 }
                    ]
                }
            };
        } catch (error: any) {
            return { success: false, message: "Failed to load event data" };
        }
    }
}