import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../global/helper_bouncer/bouncer";
import { AnalyticsController, AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { ApiResponse } from "@/types/api_res_type";
import { blood_type } from "@/db/enums/blood_type";

export class ImpAnalyticsManager implements AnalyticsController {
    
    private analyticsModel: AnalyticsData;
    private profileReader: ProfileSessionProvider;

    constructor(injectAnalyticsModel: AnalyticsData, injectProfileReader: ProfileSessionProvider) {
        this.analyticsModel = injectAnalyticsModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetFilteredDonors(search: string, bloodFilter: string, sexFilter: string, sortBy: string) {
        
        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');
        
        if (!authRes.success) {
            return { success: false, message: authRes.message };
        }

        try {
            const rawDonors = await this.analyticsModel.getFilteredDonors(search, bloodFilter, sexFilter, sortBy);

            const formattedDonors = rawDonors.map((d: any) => ({

                displayId: `DNR-${String(d.id).padStart(4, '0')}`,
                id: d.id, 
                first_name: d.first_name,
                last_name: d.last_name,
                email: d.email,
                mobile: d.mobile_no,
                age: d.age,
                sex: d.sex,
                blood: d.blood || 'Unknown',
                isVerified: d.verifiedBlood,
                status: d.active ? 'Active' : 'Inactive',
                assessmentStatus: d.assessment_status
            }));

            return {
                success: true,
                message: "Donors successfully retrieved",
                data: formattedDonors
            };

        } catch (error: any) {
            console.error("Donor Manager Error:", error);
            return { success: false, message: "Failed to load donors: " + error.message };
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

    async invokeGetFilteredEvents(search: string, status: string, sortBy: string): Promise<ApiResponse<any>> {
        
        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const rawEvents = await this.analyticsModel.getFilteredEvents(search, status, sortBy);

            const formattedEvents = rawEvents.map((e: any) => ({
                id: e.id,
                name: e.name,
                partner: e.partner,
                event_date: e.event_date,
                street: e.street,
                status: e.status,
                start_time: e.start_time,
                end_time: e.end_time
            }));

            return {
                success: true,
                message: "Events retrieved",
                data: formattedEvents
            };

        } catch (error: any) {
            return { success: false, message: "Failed to fetch events: " + error.message };
        }
    }

    async invokeGetEventAnalytics(eventIdStr: string): Promise<ApiResponse<any>> {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');
        
        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const rawData = await this.analyticsModel.getEventAnalyticsData(eventIdStr);

            if (!rawData || !rawData.eventRow) {
                return { success: false, message: "Event not found" };
            }

            const { eventRow, totalML, bloodTypeDist } = rawData;

            const visitors = Number(eventRow.visitors) || 0;
            const extractions = Number(eventRow.extractions) || 0;
            const successRate = visitors > 0 ? Math.round((extractions / visitors) * 100) : 0;

            return {
                success: true,
                message: "Event analytics retrieved",
                data: {

                    id: `EVT-${String(eventRow.id).padStart(3, '0')}`,
                    name: eventRow.name,
                    partner: eventRow.partner,
                    street: eventRow.street,
                    event_date: eventRow.event_date,
                    start_time: eventRow.start_time,
                    end_time: eventRow.end_time,
                    
                    totalDonors: visitors,
                    bloodDonated: `${Number(totalML).toLocaleString()} mL`,
                    totalBagsProduced: Number(eventRow.produced_bags) || 0,
                    showUpRate: `${successRate}%`,
                    extractionGoal: Number(eventRow.target_blood) || 0,
                    
                    bloodTypes: bloodTypeDist.map((bt: any) => ({
                        bloodType: bt.bloodType || 'Unknown',
                        count: Number(bt.count) || 0
                    }))
                }
            };
        } catch (error: any) {
            return { success: false, message: "Failed to load event data" };
        }
    }
}