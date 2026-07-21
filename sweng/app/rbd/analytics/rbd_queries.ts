import { orm } from "../../../db/drizzle";
import { donor } from "../../../db/models/donor";
import { eq, sql, or, and, ilike, ne, sum, count, asc, desc } from "drizzle-orm";
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

    async getAllDonors(limit: number = 50) {
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

    async getEvents(status: string, search: string, sortBy: string) {
        
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

        if (sortBy === "Date") 
            orderLogic = desc(event_log.event_date);

        if (sortBy === "Partner") 
            orderLogic = asc(event_log.partner);

        if (sortBy === "Status") 
            orderLogic = asc(event_log.status);

        const events = await orm.select()
            .from(event_log)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(orderLogic);

        return events;
    }
}