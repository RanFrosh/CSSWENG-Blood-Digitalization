import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "@/utils/access/bouncer";
import { AnalyticsController, AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { ApiResponse } from "@/types/api_res_type";

export class ImpAnalyticsManager implements AnalyticsController {
    
    private analyticsModel: AnalyticsData;
    private profileReader: ProfileSessionProvider;

    constructor(injectAnalyticsModel: AnalyticsData, injectProfileReader: ProfileSessionProvider) {
        this.analyticsModel = injectAnalyticsModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetFilteredDonors(filters: { 
        search?: string;
        bloodFilter?: string;
        sexFilter?: string;
        eligibilityFilter?: string;
        sortBy?: string;
    } = {}) {
        
        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');
        
        if (!authRes.success) {
            return { success: false, message: authRes.message };
        }

        try {
            const rawDonors = await this.analyticsModel.getFilteredDonors(filters);

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
                verifiedBlood: d.verifiedBlood,
                status: d.active ? 'Active' : 'Inactive',
                assessmentStatus: d.assessment_status,
                nextEligibleDate: d.nextEligibleDate
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

    async invokeGetDonorAnalytics(donorIdStr: string) {

        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const idString = donorIdStr.replace(/\D/g, ''); 
            const numericId = BigInt(idString); 

            const dbDonor = await this.analyticsModel.getDonorById(numericId);
            const metrics = await this.analyticsModel.getDonorMetrics(numericId);
            const latestVisit = await this.analyticsModel.getLatestVisit(numericId);

            if (!dbDonor) {
                return { success: false, message: "Donor not found in database" };
            }

            let nextEligibleDate = undefined;

            if (dbDonor.next_eligibility) {
                nextEligibleDate = new Date(dbDonor.next_eligibility).toISOString().split('T')[0];
            }

            let recentVisitEvent = "No previous visits";
            let recentVisitDate = "N/A";

            if (latestVisit) {
                recentVisitEvent = latestVisit.eventName;
                recentVisitDate = latestVisit.date;
            }

            const safeTotalVisits = Math.max(metrics.totalVisits, metrics.successfulDonations);
            const safeDeferredVisits = safeTotalVisits - metrics.successfulDonations;

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

                    totalVisits: safeTotalVisits,
                    successfulDonations: metrics.successfulDonations,
                    deferredVisits: safeDeferredVisits,
     
                    bloodDonated: `${(metrics.bloodDonatedML || 0).toLocaleString()} mL`,
                    bloodBagsFilled: metrics.successfulDonations,
                    
                    recentVisitEvent: recentVisitEvent,          
                    recentVisitDate: recentVisitDate,      
                    
                    nextEligibleDate: nextEligibleDate
                }
            };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async invokeGetFilteredEvents(filters: { 
        search?: string;
        status?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {
        
        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {
            const rawEvents = await this.analyticsModel.getFilteredEvents(filters);

            const formattedEvents = rawEvents.map((e: any) => ({
                id: e.id,
                name: e.name,
                partner: e.partner,
                event_date: e.event_date,
                street: e.street,
                status: e.status,
                start_time: e.start_time,
                end_time: e.end_time,
                city: e.city,
                target_blood: e.target_blood,
                produced_bags: e.produced_bags
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

            const { eventRow, totalML, totalBags, bloodTypeDist } = rawData;

            const visitors = Number(eventRow.visitors) || 0;
            const extractions = Number(eventRow.extractions) || 0;
            const successfulBags = Number(totalBags) || 0;

            const successRate = visitors > 0 ? Math.round((successfulBags / visitors) * 100) : 0;

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
                    city: eventRow.city,
                    
                    totalDonors: visitors,
                    bloodDonated: `${Number(totalML).toLocaleString()} mL`,
                    totalBagsProduced: Number(totalBags) || 0,
                    successRate: `${successRate}%`,
                    extractionGoal: Number(eventRow.target_blood) || 0,
                    
                    bloodTypes: bloodTypeDist.map((bt: any) => ({
                        bloodType: bt.blood_type ||  bt.bloodType || 'Unknown',
                        count: Number(bt.count) || 0
                    }))
                }
            };
        } catch (error: any) {
            return { success: false, message: "Failed to load event data" };
        }
    }

    async invokeGetOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;     
    } = {}) {
    
        const authRes = await helpGateKeep(this.profileReader, 'view_analytics');

        if (!authRes.success) 
            return { success: false, message: authRes.message };

        try {

            const raw = await this.analyticsModel.getOverallAnalytics(filters);

            // Donor Base Insights
            const totalDonorsCount = Number(raw.totalDonors || 0);
            const baseTotalBags = Number(raw.metrics?.totalBags || 0);
            const target = Number(raw.metrics?.totalTarget || 1); // Prevent division by zero
            const extractions = Number(raw.metrics?.totalExtractions || 0);

            const activeDonorsLastYearCount = Number(raw.activeDonorsLastYear || 0);
            const calculatedEngagementRate = totalDonorsCount > 0 
                ? (activeDonorsLastYearCount / totalDonorsCount) * 100 
                : 0;

            // Gender Distribution
            let mCount = 0;
            let fCount = 0;

            (raw.genders || []).forEach((g: any) => {
                const sexLabel = String(g.sex || "").trim().toLowerCase();
                const countVal = Number(g.count || 0);
                if (sexLabel === 'male' || sexLabel === 'm') mCount += countVal;
                else if (sexLabel === 'female' || sexLabel === 'f') fCount += countVal;
            });

            const totalGenders = mCount + fCount;
            const malePercent = totalGenders > 0 ? (mCount / totalGenders) * 100 : 0;
            const femalePercent = totalGenders > 0 ? (fCount / totalGenders) * 100 : 0;

            // Blood Type Breakdown
            const colorMap: Record<string, string> = {
                "O+": "#fd5448",
                "A+": "#ff7669",
                "B+": "#fca130",
                "AB+": "#94a3b8",
                "O-": "#dc2626",
                "A-": "#f87171",
                "B-": "#fbbf24",
                "AB-": "#cbd5e1",
                "Rh-null": "#EAB308",
                'Rh-null (or "Golden Blood")': "#EAB308",
            };

            const parsedBloodTypes = (raw.bloodTypes || []).map((demo: any) => {
                const countVal = Number(demo.count) || 0;
                const typeStr = demo.blood_type || demo.bloodType || "Unknown";
                return {
                    bloodType: typeStr,
                    count: countVal,
                    pct: baseTotalBags > 0 ? (countVal / totalDonorsCount) * 100 : 0,
                    color: colorMap[typeStr] || "#c0cad0" // Fallback gray
                };
            });
            
            const totalPhysicalBags = (raw.bloodBagTypes || []).reduce(
                (sum: number, demo: any) => sum + (Number(demo.count) || 0), 
                0
            );

            const parsedBagBloodTypes = (raw.bloodBagTypes || []).map((demo: any) => {
                const countVal = Number(demo.count) || 0;
                const typeStr = demo.blood_type || demo.bloodType || "Unknown"; 
                
                return {
                    bloodType: typeStr,
                    count: countVal,
                    pct: totalPhysicalBags > 0 ? (countVal / totalPhysicalBags) * 100 : 0, 
                    color: colorMap[typeStr] || "#c0cad0" 
                };
            });

            // Campaigns
            const formattedCampaigns = (raw.campaigns || []).map((c: any) => ({
                id: String(c.id),
                name: c.name,
                partner: c.partner,
                city: c.city,
                date: c.event_date,
                extractionGoal: Number(c.target_blood || 0),
                totalBagsProduced: Number(c.produced_bags || 0)
            }));

            const successRate = extractions > 0 ? (baseTotalBags / extractions) * 100 : 0;
            const progressPercent = target > 0 ? (baseTotalBags / target) * 100 : 0;

            const payload = {
                totalDonors: totalDonorsCount,
                bloodDonated: `${Number(raw.metrics?.totalML || 0).toLocaleString()} mL`,
                totalBagsProduced: baseTotalBags,
                extractionSuccessRate: `${successRate.toFixed(1)}%`, 
                extractionGoal: target,
                extractionProgress: progressPercent,
                malePct: malePercent,
                femalePct: femalePercent,
                activeEngagementRate: calculatedEngagementRate,
                bloodTypes: parsedBloodTypes,
                bloodBags: parsedBagBloodTypes,
                campaignEvents: formattedCampaigns,
            };

            return { success: true, data: payload };

        } catch (error: any) {
            console.error("Analytics Error:", error);
            return { success: false, message: "Failed to load overall analytics" };
        }
    }
}