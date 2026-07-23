import { orm } from "../../../db/drizzle";
import { donor } from "../../../db/models/donor";
import { eq, sql, or, and, ilike, lte, gte, ne, sum, count, asc, desc } from "drizzle-orm";
import { AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { event_log } from "@/db/models/event_log";
import { donor_to_event } from "@/db/models/donor_to_event";

export class ImpAnalyticsData implements AnalyticsData {

    async countActiveDonors(): Promise<number> {

        const query = await orm
            .select({ count: sql<number>`count(*)`})
            .from(donor)
            .where(eq(donor.active, true));

        return Number(query[0].count);  
    }

    async getDonorBloodTypeBreakdown(): Promise<any[]> {

        return await orm
            .select({
                blood_type: donor.blood,
                count: sql<number>`count(*)`
            })
            .from(donor)
            .where(eq(donor.active, true))
            .groupBy(donor.blood);
    }

    async getDonorById(numericId: bigint) {
        const [dbDonor] = await orm
            .select()
            .from(donor)
            .where(eq(donor.id, numericId))
            .limit(1);
        return dbDonor;
    }

    async getFilteredDonors(search: string, bloodFilter: string, sexFilter: string, sortBy: string, limit: number = 50) {

        const conditions = [];

        // Search
        if (search && search.trim() !== "") {
            conditions.push(
                or(
                    ilike(donor.first_name, `%${search}%`),
                    ilike(donor.last_name, `%${search}%`),
                    ilike(donor.email, `%${search}%`)
                )
            );
        }

        // Blood Type Filter
        if (bloodFilter && bloodFilter.trim() !== "" && bloodFilter !== "All") {
            conditions.push(eq(donor.blood, bloodFilter as "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-"));
        }

        // Sex Filter
        if (sexFilter && sexFilter.trim() !== "" && sexFilter !== "All") {
            conditions.push(eq(donor.sex, sexFilter as "Male" | "Female"));
        }

        // Sort Logic
        let orderLogic: any = desc(donor.last_name);

        switch (sortBy) {
            case "Age (Youngest)":
                orderLogic = asc(donor.age);
                break;
            case "Age (Oldest)":
                orderLogic = desc(donor.age);
                break;
            case "ID (Descending)":
                orderLogic = desc(donor.id);
                break;
            case "ID (Ascending)":
            default:
                orderLogic = asc(donor.id);
                break;
        }

        // Execute Query
        return await orm
            .select({
                id: donor.id,
                first_name: donor.first_name,
                last_name: donor.last_name,
                email: donor.email,
                mobile_no: donor.mobile_no,
                active: donor.active,
                age: donor.age,
                blood: donor.blood,
                sex: donor.sex,
                street: donor.street,
                zip_code: donor.zip_code,
                verifiedBlood: donor.verifiedBlood,
                height: donor.height,
                weight: donor.weight,
                assessment_status: donor.assessment_status
            })
            .from(donor)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(orderLogic)
            .limit(limit);
    }

    async getLatestVisit(numericId: bigint) {

        const [latest] = await orm
            .select({
                eventName: event_log.name, 
                date: event_log.event_date,
                isSuccess: donor_to_event.is_success
            })
            .from(donor_to_event)
            .innerJoin(event_log, eq(donor_to_event.event_id, event_log.id))
            .where(eq(donor_to_event.donor_id, numericId))
            .orderBy(desc(event_log.event_date)) // Sort newest first
            .limit(1); // Grab the top one
        
        return latest;
    }

    async getDonorMetrics(numericId: bigint) {

        const [totalVisitsRes, successStatsRes] = await Promise.all([
            
            // Total Visits
            orm.select({ value: count() })
               .from(donor_to_event)
               .where(eq(donor_to_event.donor_id, numericId)),
            
            // Blood volume, Bags, and Success Count
            orm.select({
                   successCount: count(),
                   totalBlood: sum(donor_to_event.blood_amount),
               })
               .from(donor_to_event)
               .where(
                   and(
                       eq(donor_to_event.donor_id, numericId),
                       eq(donor_to_event.is_success, true)
                   )
               )
        ]);

        return {
            totalVisits: totalVisitsRes[0]?.value || 0,
            successfulDonations: successStatsRes[0]?.successCount || 0,
            bloodDonatedML: Number(successStatsRes[0]?.totalBlood) || 0,
        };
    }

    async getEventById(numericId: bigint) {

        const [dbEvent] = await orm
            .select()
            .from(event_log)
            .where(eq(event_log.id, numericId))
            .limit(1);
        
        return dbEvent;
    }

    async getFilteredEvents(search: string, status: string, sortBy: string) {
        
        const conditions = [];

        // Status Filter
        if (status !== "All") {
            conditions.push(eq(event_log.status, status as "Ongoing" | "Completed"));
        } else {
            conditions.push(ne(event_log.status, "Upcoming"));
        }

        // Search Filter
        if (search && search.trim() !== "") {
            conditions.push(
                or(
                    ilike(event_log.name, `%${search}%`),
                    ilike(event_log.partner, `%${search}%`)
                )
            );
        }

        // Sort Logic
        let orderLogic: any = desc(event_log.event_date);

        switch (sortBy) {
            case "Date (Oldest)":
                orderLogic = asc(event_log.event_date);
                break;
            case "Partner (A-Z)":
                orderLogic = asc(event_log.partner);
                break;
            case "Partner (Z-A)":
                orderLogic = desc(event_log.partner);
                break;
            case "Date":
            default:
                orderLogic = desc(event_log.event_date);
                break;
        }

        const events = await orm.select()
            .from(event_log)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(orderLogic);

        return events;
    }

    async getEventAnalyticsData(eventIdStr: string) {
        const eventId = BigInt(eventIdStr);

        const [eventResult, exactBloodResult, bloodTypeResult] = await Promise.all([

            // Get the pre-calculated stats from event_log
            orm.select()
                .from(event_log)
                .where(eq(event_log.id, eventId))
                .limit(1),

            // Sum up the exact mL of blood donated
            orm.select({
                totalML: sum(donor_to_event.blood_amount)
            })
            .from(donor_to_event)
            .where(and(eq(donor_to_event.event_id, eventId), eq(donor_to_event.is_success, true))),

            // Group and count by Blood Type
            orm.select({
                bloodType: donor.blood,
                count: count()
            })
            .from(donor_to_event)
            .innerJoin(donor, eq(donor_to_event.donor_id, donor.id))
            .where(eq(donor_to_event.event_id, eventId))
            .groupBy(donor.blood)
        ]);

        return {
            eventRow: eventResult[0],
            totalML: exactBloodResult[0]?.totalML || 0,
            bloodTypeDist: bloodTypeResult
        };
    }

    async getOverallAnalytics() {

        const [
            totalDonors,
            bloodTypesRes,
            genderRes,
            eventMetricsRes,
            recentCampaignsRes
        ] = await Promise.all([

            this.countActiveDonors(), // Total Active Donors
            this.getDonorBloodTypeBreakdown(), // Blood Type Distribution
        
            // Gender Distribution
            orm.select({ sex: donor.sex, count: sql<number>`count(*)` })
               .from(donor)
               .groupBy(donor.sex),
            
            // Global Event Metrics (Bags and Targets)
            orm.select({
                totalBags: sql<number>`sum(${event_log.produced_bags})`,
                totalTarget: sql<number>`sum(${event_log.target_blood})`,
                totalExtractions: sql<number>`sum(${event_log.extractions})`, 
            }).from(event_log),

            // Recent Campaign Performance
            orm.select()
               .from(event_log)
               .orderBy(desc(event_log.event_date))
               .limit(5)
        ]);

        return {
            totalDonors: totalDonors,
            bloodTypes: bloodTypesRes,
            genders: genderRes,
            metrics: eventMetricsRes[0],
            campaigns: recentCampaignsRes
        };
    }

    async getFilteredCampaigns(filters: { startDate?: string; endDate?: string; partner?: string }) {

        const { startDate, endDate, partner } = filters;
        const conditions = [];

        if (startDate) {
            conditions.push(gte(event_log.event_date, startDate));
        }
        if (endDate) {
            conditions.push(lte(event_log.event_date, endDate));
        }

        if (partner && partner !== "All Partners") {
            conditions.push(eq(event_log.partner, partner));
        }

        return await orm.select()
            .from(event_log)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(event_log.event_date));
    }
}