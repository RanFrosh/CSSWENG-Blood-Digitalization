import { orm } from "@/db/drizzle";
import { eq, sql, SQL, and, isNull, ne, or, ilike, asc, desc } from "drizzle-orm";
import { donor } from "@/db/schemas/donor";
import { event_log } from "@/db/schemas/event_log";
import { profiles } from "@/db/schemas/profiles";
import { assigned_staff } from "@/db/schemas/assigned_staff";
import { city } from "@/db/schemas/city";
import { MPData } from "@/abstract/mp/mp_abstract";
import { event_queue } from "@/db/schemas/event_queue";
import { UpdateQueue } from "@/types/queue_type";
import { DeleteQueue } from "@/types/queue_type";

export type DonorFilters = {
    search?: string;
    bloodFilter?: string;
    sexFilter?: string;
    eligibilityFilter?: string;
    sortBy?: string;
};

export class ImpMPModel implements MPData {

    async verifyAccess(staffId: string, eventId: bigint) {

        const [event] = await orm
            .select({
                id: event_log.id,
                name: event_log.name,
                status: event_log.status,
                partner: event_log.partner,
                event_date: event_log.event_date,
                start_time: event_log.start_time,
                end_time: event_log.end_time,
                city: city.name
            })
            .from(event_log)
            .innerJoin(assigned_staff, eq(event_log.id, assigned_staff.event_log_id))
            .leftJoin(city, eq(event_log.city_id, city.id))
            .where(
                and(
                    eq(event_log.id, eventId),
                    eq(assigned_staff.staff_id, staffId)
                )
            )
            .limit(1);

        return event || null;
    }

    async getEventQueueWithDonors(eventId: bigint, stationFilter?: string | null) {

        const conditions: SQL[] = [
            eq(event_queue.event_log_id, eventId),
            isNull(event_queue.staff_id)
        ];

        if (stationFilter !== undefined) {
            if (stationFilter === null) {
                conditions.push(isNull(event_queue.station));
            } else {
                conditions.push(eq(event_queue.station, stationFilter as "lab_queue"));
            }
        }

        const rawQueue = await orm
            .select({
                queue: event_queue,
                donor: donor
            })
            .from(event_queue)
            .leftJoin(donor, eq(event_queue.donor_id, donor.id))
            .where(and(...conditions))
            .orderBy(asc(event_queue.id));

        return rawQueue;
    }

    async getStaffStatusForEvent(eventId: bigint, staffId: string) {

        const rawStaffStatus = await orm
            .select({
                profile: profiles,
                queue: event_queue,
                donor: donor
            })
            .from(assigned_staff)
            .innerJoin(profiles, eq(assigned_staff.staff_id, profiles.id))
            .leftJoin(event_queue, and(
                eq(event_queue.staff_id, profiles.id),
                eq(event_queue.event_log_id, eventId),
            ))
            .leftJoin(donor, eq(event_queue.donor_id, donor.id))
            .where(
                and(
                    eq(assigned_staff.event_log_id, eventId),
                    eq(assigned_staff.staff_id, staffId)
                )
            );

        return rawStaffStatus;
    }

    async validateExtractionAccess(staffId: string, eventId: bigint, donorId: bigint) {

        const [staff] = await orm.select({ role: profiles.role })
            .from(profiles)
            .where(eq(profiles.id, staffId))
            .limit(1);
            
        if (!staff || staff.role !== "lab_staff") {
            return { authorized: false, message: "Not authenticated" };
        }

        const [assignment] = await orm.select()
            .from(assigned_staff)
            .where(
                and(
                    eq(assigned_staff.staff_id, staffId),
                    eq(assigned_staff.event_log_id, eventId)
                )
            )
            .limit(1);

        if (!assignment) {
            return { authorized: false, message: "Not assigned to this event." };
        }

        const [busy] = await orm.select()
            .from(event_queue)
            .where(
                and(
                    eq(event_queue.staff_id, staffId),
                    eq(event_queue.event_log_id, eventId),
                    ne(event_queue.donor_id, donorId)
                )
            )
            .limit(1);

        if (busy) {
            return { authorized: false, message: "Currently busy with another donor." };
        }

        const [queueData] = await orm.select()
            .from(event_queue)
            .where(
                and(
                    eq(event_queue.donor_id, donorId),
                    eq(event_queue.event_log_id, eventId)
                )
            )
            .limit(1);

        if (!queueData || queueData.station !== "lab_queue") {
            return { authorized: false, message: "Donor not found in the active event queue." };
        }

        if (queueData.staff_id !== staffId) {
            return { authorized: false, message: "Not assigned to this donor." };
        }

        return { authorized: true };
    }

    async updateQueueStation(queueTarget: UpdateQueue) {
        try {
            await orm
            .update(event_queue)
            .set({
                station: queueTarget.station,
                staff_id: queueTarget.staff_id
            })
            .where(eq(event_queue.id, queueTarget.id));          

            return { success: true, message: 'Donor station updated' };
        } catch (err: any) {
            return { success: false, message: err.message };
        }    
    }

    async getActiveQueueByDonorAndEvent(donorId: bigint, eventId: bigint, station: string) {
        return await orm.select({ id: event_queue.id })
            .from(event_queue)
            .where(
                and(
                    eq(event_queue.donor_id, donorId),
                    eq(event_queue.event_log_id, eventId),
                    eq(event_queue.station, station as any)
                )
            )
            .limit(1);
    }

    async deleteQueue(donorTarget: DeleteQueue) {
        try {
            await orm
            .delete(event_queue)
            .where(eq(event_queue.id, donorTarget.id));

            return { success: true, message: "Donor dequeued" };
        } catch (err: any) {
            return { success: false, message: err.message }
        }     
    }

}