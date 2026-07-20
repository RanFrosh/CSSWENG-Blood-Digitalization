import { orm } from "../../../db/drizzle";
import { donor } from "../../../db/models/donor";
import { eq, sql } from "drizzle-orm";
import { AnalyticsData } from "@/abstract/analytics/analytics_abstract";

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
}