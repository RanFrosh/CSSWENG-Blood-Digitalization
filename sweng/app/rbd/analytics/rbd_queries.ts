import { orm } from "../../../db/drizzle";
import { donor } from "../../../db/models/donor";
import { eq, sql } from "drizzle-orm";
import { AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { event_log } from "@/db/models/event_log";

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

    async getEventsByStatus(status: string) {
        
        if (status === "All") {
            return await orm
                .select()
                .from(event_log);
        }

        return await orm
            .select()
            .from(event_log)
            .where(eq(event_log.status, status as "Ongoing" | "Upcoming" | "Completed"));
    }

    async getEventById(numericId: bigint) {

        const [dbEvent] = await orm
            .select()
            .from(event_log)
            .where(eq(event_log.id, numericId))
            .limit(1);
        
        return dbEvent;
    }
}