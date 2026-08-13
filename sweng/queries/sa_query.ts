import { orm } from "@/db/drizzle";
import { event_log } from "@/db/schemas/event_log";
import { profiles } from "@/db/schemas/profiles";
import { assigned_staff } from "@/db/schemas/assigned_staff";
import { city } from "@/db/schemas/city";
import { eq, and, inArray } from "drizzle-orm";
import { SuperAdminData } from "@/abstract/sa/sa_abstract";

export class ImpSuperAdminModel implements SuperAdminData{

    async getEventById(eventId: string) {
        return await orm
            .select({
                id: event_log.id,
                name: event_log.name,
                partner: event_log.partner,
                event_date: event_log.event_date,
                city_name: city.name,
                start_time: event_log.start_time,
                end_time: event_log.end_time
            })
            .from(event_log)
            .leftJoin(city, eq(event_log.city_id, city.id))
            .where(eq(event_log.id, BigInt(eventId)))
            .limit(1);
    }

    async getEligibleStaff() {
        return await orm
            .select({
                id: profiles.id,
                name: profiles.name,
                email: profiles.email,
                staffType: profiles.role, 
            })
            .from(profiles)
            .where(
                inArray(profiles.role, [
                    "onsite_admin", 
                    "med_prof", 
                    "lab_staff", 
                    "recov_staff"
                ] as any)
            );
    }

    async getAssignedStaffIdsForEvent(eventId: string) {
        const records = await orm
            .select({ staff_id: assigned_staff.staff_id })
            .from(assigned_staff)
            .where(eq(assigned_staff.event_log_id, BigInt(eventId)));
            
        return records.map(r => r.staff_id);
    }

    async insertEventStaff(eventId: string, staffIds: string[]) {
        const insertPayload = staffIds.map(staffId => ({
            event_log_id: BigInt(eventId),
            staff_id: staffId
        }));
        await orm.insert(assigned_staff).values(insertPayload as any);
    }

    async deleteEventStaff(eventId: string, staffIds: string[]) {
        await orm
            .delete(assigned_staff)
            .where(
                and(
                    eq(assigned_staff.event_log_id, BigInt(eventId)),
                    inArray(assigned_staff.staff_id, staffIds)
                )
            );
    }
}