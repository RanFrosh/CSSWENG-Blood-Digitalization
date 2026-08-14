import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";
import { eq, sql, or, and, ilike, isNull, isNotNull, lte, gt, gte, ne, sum, count, asc, desc } from "drizzle-orm";
import { AnalyticsData } from "@/abstract/analytics/analytics_abstract";
import { event_log } from "@/db/schemas/event_log";
import { donor_to_event } from "@/db/schemas/donor_to_event";
import { city } from "@/db/schemas/city";
import { blood_bag } from "@/db/schemas/blood_bag";

export class ImpAnalyticsData implements AnalyticsData {

    async getDonorById(numericId: bigint) {
        const [dbDonor] = await orm
            .select()
            .from(donor)
            .where(eq(donor.id, numericId))
            .limit(1);
        return dbDonor;
    }

    async getFilteredDonors(filters: { 
        search?: string;
        bloodFilter?: string;
        sexFilter?: string;
        eligibilityFilter?: string;
        sortBy?: string;
    } = {}) {

        const { 
            search = "", 
            bloodFilter = "All", 
            sexFilter = "All Partners", 
            eligibilityFilter = "All Cities", 
            sortBy = "ID (Descending)" 
        } = filters;

        const latestSuccessSq = orm.select({
                donor_id: donor_to_event.donor_id,
                last_date: sql<string>`MAX(${event_log.event_date})`.as('last_date')
            })
            .from(donor_to_event)
            .innerJoin(event_log, eq(donor_to_event.event_id, event_log.id))
            .where(eq(donor_to_event.is_success, true))
            .groupBy(donor_to_event.donor_id)
            .as('latest_success_sq');

        const conditions = [];

        // Search
        if (search && search.trim() !== "") {

            const isNumeric = /^\d+$/.test(search.trim());

            conditions.push(
                or(
                    isNumeric ? eq(donor.id, BigInt(search.trim())) : undefined,
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

        // Eligibility Filter
        if (eligibilityFilter && eligibilityFilter.trim() !== "" && eligibilityFilter !== "All") {

            const nowStr = new Date().toISOString(); 

            if (eligibilityFilter === "Eligible") {
                conditions.push(
                    and(
                        eq(donor.active, true),
                        or(
                            isNull(donor.next_eligibility),
                            lte(donor.next_eligibility, nowStr)
                        )
                    )
                );
            } else if (eligibilityFilter === "Recovery") {
                conditions.push(
                    gt(donor.next_eligibility, nowStr)
                );
            }
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

        const rawDonors = await orm
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
                verifiedBlood: donor.verifiedBlood,
                last_donation_date: latestSuccessSq.last_date,
                next_eligiblilty: donor.next_eligibility
            })
            .from(donor)
            .leftJoin(latestSuccessSq, eq(donor.id, latestSuccessSq.donor_id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(orderLogic)

        // Execute Query
        return rawDonors.map(row => {
            let nextEligibleDate = undefined;

            if (row.next_eligiblilty) {
                nextEligibleDate = new Date(row.next_eligiblilty).toISOString().split('T')[0];
            }

            return {
                ...row,
                nextEligibleDate
            };
        });
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

        // Total Visits
        const totalVisitsRes = await orm.select({ 
            value: count() 
        })
        .from(donor_to_event)
        .where(eq(donor_to_event.donor_id, numericId));

        // Blood Volume and Bags
        const successStatsRes = await orm.select({
            successCount: count(blood_bag.id),
            totalBlood: sum(blood_bag.volume_ml),
        })
        .from(blood_bag)
        .where(eq(blood_bag.donor_id, numericId));

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

    async getFilteredEvents(filters: {
        search?: string;
        status?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {

        const { 
            search = "", 
            status = "All", 
            partner = "All Partners", 
            selectedCity = "All Cities", 
            sortBy = "Date" 
        } = filters;
        
        const conditions = [];

        // Status Filter
        if (status !== "All") {
            conditions.push(eq(event_log.status, status as "Ongoing" | "Completed"));
        } else {
            conditions.push(ne(event_log.status, "Upcoming"));
        }

        // Partner Filter
        if (partner && partner !== "All Partners") {
            conditions.push(eq(event_log.partner, partner));
        }

        // City Filter
        if (selectedCity && selectedCity !== "All Cities") {
            conditions.push(eq(city.name, selectedCity));
        }

        // Search Filter
        if (search && search.trim() !== "") {
            conditions.push(
                or(
                    ilike(event_log.name, `%${search}%`),
                    ilike(event_log.partner, `%${search}%`),
                    ilike(city.name, `%${search}%`)
                )
            );
        }

        // Sort Logic
        let orderLogic: any = desc(event_log.event_date);

        switch (sortBy) {
            case "ID (Descending)":
                orderLogic = desc(event_log.id);
                break;
            case "Date (Earliest)":
                orderLogic = desc(event_log.event_date);
                break;
            case "Date (Oldest)":
                orderLogic = asc(event_log.event_date);
                break;
            case "Partner (A-Z)":
                orderLogic = asc(event_log.partner);
                break;
            case "Partner (Z-A)":
                orderLogic = desc(event_log.partner);
                break;
            case "City (A-Z)":
                orderLogic = asc(city.name);
                break;
            case "City (Z-A)":
                orderLogic = desc(city.name);
                break;
            case "ID (Ascending)":
            default:
                orderLogic = asc(event_log.id);
                break;
        }

        const events = await orm.select({
            id: event_log.id,
            name: event_log.name,
            partner: event_log.partner,
            status: event_log.status,
            event_date: event_log.event_date,
            start_time: event_log.start_time,
            end_time: event_log.end_time,
            target_blood: event_log.target_blood,
            produced_bags: sql<number>`count(${blood_bag.id})`,
            city: city.name
        })
        .from(event_log)
        .leftJoin(city, eq(event_log.city_id, city.id))
        .leftJoin(blood_bag, eq(event_log.id, blood_bag.event_id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(
            event_log.id, 
            city.name
        )
        .orderBy(orderLogic);
        
        return events;
    }

    async getEventAnalyticsData(eventIdStr: string) {
        
        const eventId = BigInt(eventIdStr);

        const eventResult = await orm.select({
            id: event_log.id,
            name: event_log.name,
            partner: event_log.partner,
            status: event_log.status,
            event_date: event_log.event_date,
            start_time: event_log.start_time,
            end_time: event_log.end_time,
            street: event_log.street,
            visitors: event_log.visitors,
            target_blood: event_log.target_blood,
            extractions: event_log.extractions,            
            city: city.name 
        })
        .from(event_log)
        .leftJoin(city, eq(event_log.city_id, city.id))
        .where(eq(event_log.id, eventId))
        .limit(1);

        const visitorsResult = await orm.select({
            realVisitors: count()
        })
        .from(donor_to_event)
        .where(eq(donor_to_event.event_id, eventId));

        // 🚨 THE FIX: Separate Attempts, Successes, and ML using CASE WHEN
        const exactBloodResult = await orm.select({
            totalAttempts: sql<number>`count(${blood_bag.id})`,
            totalSuccessful: sql<number>`COALESCE(sum(CASE WHEN ${blood_bag.outcome} = 'Successful' THEN 1 ELSE 0 END), 0)`,
            totalML: sql<number>`COALESCE(sum(CASE WHEN ${blood_bag.outcome} = 'Successful' THEN ${blood_bag.volume_ml} ELSE 0 END), 0)`
        })
        .from(blood_bag)
        .where(eq(blood_bag.event_id, eventId)); // Notice the strict 'Successful' filter is gone!

        // Keep this filtered so the pie chart only shows usable blood
        const bloodTypeResult = await orm.select({
            bloodType: blood_bag.blood_type,
            count: count()
        })
        .from(blood_bag)
        .where(
            and(
                eq(blood_bag.event_id, eventId),
                eq(blood_bag.outcome, 'Successful')
            )
        )
        .groupBy(blood_bag.blood_type);

        const realVisitors = Number(visitorsResult[0]?.realVisitors || 0);
        
        // 🚨 DENOMINATOR: Maps the Total Attempts to 'extractions' for the frontend
        const realExtractions = Number(exactBloodResult[0]?.totalAttempts || 0); 

        return {
            eventRow: {
                ...eventResult[0],
                visitors: realVisitors,
                extractions: realExtractions 
            },
            totalML: Number(exactBloodResult[0]?.totalML || 0),
            
            // 🚨 NUMERATOR: Maps the Actual Wins to 'totalBags'
            totalBags: Number(exactBloodResult[0]?.totalSuccessful || 0), 
            
            bloodTypeDist: bloodTypeResult
        };
    }

    async countActiveDonors(eventWhereClause?: any): Promise<number> {

        const query = orm.select({ count: sql<number>`count(distinct ${donor.id})` }).from(donor);
        
        if (eventWhereClause) {
            query.innerJoin(donor_to_event, eq(donor.id, donor_to_event.donor_id))
                 .innerJoin(event_log, eq(donor_to_event.event_id, event_log.id))
                 .leftJoin(city, eq(event_log.city_id, city.id))
                 .where(and(eq(donor.active, true), eventWhereClause));
        } else {
            query.where(eq(donor.active, true));
        }
        
        const res = await query;
        return Number(res[0]?.count || 0);  
    }

    async getDonorBloodTypeBreakdown(eventWhereClause?: any): Promise<any[]> {

        const query = orm.select({
            blood_type: donor.blood,
            count: sql<number>`count(distinct ${donor.id})`
        }).from(donor);

        if (eventWhereClause) {
            query.innerJoin(donor_to_event, eq(donor.id, donor_to_event.donor_id))
                 .innerJoin(event_log, eq(donor_to_event.event_id, event_log.id))
                 .leftJoin(city, eq(event_log.city_id, city.id))
                 .where(and(eq(donor.active, true), eventWhereClause));
        } else {
            query.where(eq(donor.active, true));
        }

        return await query.groupBy(donor.blood);
    }

    async getOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;     
    } = {}) {
        
        const { startDate, endDate, partner, selectedCity, sortBy = "recent"} = filters;
        const conditions = [];

        if (startDate) 
            conditions.push(gte(event_log.event_date, startDate));

        if (endDate) 
            conditions.push(lte(event_log.event_date, endDate));

        if (partner && partner !== "All Partners") 
            conditions.push(eq(event_log.partner, partner));

        if (selectedCity && selectedCity !== "All Cities") 
            conditions.push(eq(city.name, selectedCity));

        const eventWhereClause = conditions.length > 0 ? and(...conditions) : undefined;

        let orderByClause;
        switch (sortBy) {
            case "highest_yield":
                orderByClause = desc(sql`count(${blood_bag.id})`);
                break;
            case "lowest_yield":
                orderByClause = asc(sql`count(${blood_bag.id})`);
                break;
            case "highest_goal":
                orderByClause = desc(event_log.target_blood);
                break;
            case "oldest":
                orderByClause = asc(event_log.event_date);
                break;
            case "recent":
            default:
                orderByClause = desc(event_log.event_date);
                break;
        }

        const totalDonors = await this.countActiveDonors(eventWhereClause);
        const donorBloodTypes = await this.getDonorBloodTypeBreakdown(eventWhereClause);

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];

        const engagementConditions = [gte(event_log.event_date, oneYearAgoStr)];

        if (partner && partner !== "All Partners") {
            engagementConditions.push(eq(event_log.partner, partner));
        }

        if (selectedCity && selectedCity !== "All Cities") {
            engagementConditions.push(eq(city.name, selectedCity)); 
        }

        // Count distinct donors
        const activeDonorsLastYearRes = await orm.select({ 
            count: sql<number>`count(distinct ${donor_to_event.donor_id})` 
        })
        .from(donor_to_event)
        .innerJoin(event_log, eq(donor_to_event.event_id, event_log.id))
        .leftJoin(city, eq(event_log.city_id, city.id))
        .where(and(...engagementConditions));

        const genderRes = await (async () => {
            const q = orm.select({ sex: donor.sex, count: sql<number>`count(distinct ${donor.id})` }).from(donor);
            if (eventWhereClause) {
                q.innerJoin(donor_to_event, eq(donor.id, donor_to_event.donor_id))
                .innerJoin(event_log, eq(donor_to_event.event_id, event_log.id))
                .leftJoin(city, eq(event_log.city_id, city.id))
                .where(eventWhereClause);
            }
            return await q.groupBy(donor.sex);
        })();

        const eventMetricsRes = await orm.select({
            totalTarget: sql<number>`sum(${event_log.target_blood})`
        })
        .from(event_log)
        .leftJoin(city, eq(event_log.city_id, city.id))
        .where(eventWhereClause);

        // Blood Bag Metrics
        const bloodBagMetricsRes = await orm.select({
            totalAttempts: sql<number>`count(${blood_bag.id})`,
            totalSuccessful: sql<number>`COALESCE(sum(CASE WHEN ${blood_bag.outcome} = 'Successful' THEN 1 ELSE 0 END), 0)`,
            totalML: sql<number>`COALESCE(sum(CASE WHEN ${blood_bag.outcome} = 'Successful' THEN ${blood_bag.volume_ml} ELSE 0 END), 0)`
        })
        .from(blood_bag)
        .innerJoin(event_log, eq(blood_bag.event_id, event_log.id))
        .leftJoin(city, eq(event_log.city_id, city.id))
        .where(eventWhereClause);
        

        // Blood Type per Bag Breakdown
        const bloodBagTypesRes = await orm.select({
            bloodType: blood_bag.blood_type,
            count: sql<number>`count(${blood_bag.id})`
        })
        .from(blood_bag)
        .innerJoin(event_log, eq(blood_bag.event_id, event_log.id))
        .leftJoin(city, eq(event_log.city_id, city.id))
        .where(
            and(
                eq(blood_bag.outcome, 'Successful'),
                eventWhereClause
            )
        )
        .groupBy(blood_bag.blood_type);

        const campaignsRes = await orm.select({
            id: event_log.id,
            name: event_log.name,
            partner: event_log.partner,
            event_date: event_log.event_date,
            target_blood: event_log.target_blood,
            city: city.name,
            produced_bags: sql<number>`count(${blood_bag.id})`
        })
        .from(event_log)
        .leftJoin(city, eq(event_log.city_id, city.id))
        .leftJoin(blood_bag, and(
            eq(event_log.id, blood_bag.event_id),
            eq(blood_bag.outcome, 'Successful')
        ))
        .where(eventWhereClause)
        .groupBy(event_log.id, city.name)
        .orderBy(orderByClause);

        const totalCampaignsRes = await orm.select({ count: sql<number>`count(*)` })
        .from(event_log)
        .leftJoin(city, eq(event_log.city_id, city.id))
        .where(eventWhereClause);

        return {
            totalDonors,
            bloodTypes: donorBloodTypes,
            bloodBagTypes: bloodBagTypesRes,
            genders: genderRes,
            metrics: {
                totalTarget: Number(eventMetricsRes[0]?.totalTarget || 0),
                totalExtractions: Number(bloodBagMetricsRes[0]?.totalAttempts || 0),
                totalBags: Number(bloodBagMetricsRes[0]?.totalSuccessful || 0), 
                totalML: Number(bloodBagMetricsRes[0]?.totalML || 0)
            },
            campaigns: campaignsRes,
            totalCampaigns: Number(totalCampaignsRes[0]?.count || 0),
            activeDonorsLastYear: Number(activeDonorsLastYearRes[0]?.count || 0)
        };
    }
}