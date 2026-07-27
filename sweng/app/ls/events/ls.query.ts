import { orm } from "../../../db/drizzle";
import { eq, SQL, and, asc, isNull } from "drizzle-orm";
import { LabStaffData } from "@/abstract/ls/ls_abstract";
import { donor } from "@/db/models/donor";
import { event_log } from "@/db/models/event_log";
import { event_queue } from "@/db/models/event_queue";
import { profiles } from "@/db/models/profiles";
import { assigned_staff } from "@/db/models/assigned_staff";
import { city } from "@/db/models/city";

export class ImpLabStaffModel implements LabStaffData {

    async getStaffEvents (staffId: string, statusTab?: string) {

        const filters: SQL[] = [eq(assigned_staff.profiles_id, staffId)];

        if (statusTab && statusTab !== "All") {
            filters.push(eq(event_log.status, statusTab as "Completed" || "Ongoing" || "Upcoming"));
        }

        const events = await orm
            .select({
                id: event_log.id,
                name: event_log.name,
                partner: event_log.partner,
                status: event_log.status,
                event_date: event_log.event_date,
                start_time: event_log.start_time,
                end_time: event_log.end_time,
                street: event_log.street,
                target_blood: event_log.target_blood,
                city: city.name
            })
            .from(event_log)
            .innerJoin(assigned_staff, eq(event_log.id, assigned_staff.event_log_id))
            .leftJoin(city, eq(event_log.city_id, city.id))
            .where(and(...filters));

        return events;
    }

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
                    eq(assigned_staff.profiles_id, staffId)
                )
            )
            .limit(1);

        return event || null;
    }

    async getEventQueueWithDonors(eventId: bigint, stationFilter?: string | null) {

        const conditions: SQL[] = [eq(event_queue.event_log_id, eventId)];

        if (stationFilter !== undefined) {
            if (stationFilter === null) {
                conditions.push(isNull(event_queue.station));
            } else {
                conditions.push(eq(event_queue.station, stationFilter as "med_queue" || "lab_queue"));
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
            .innerJoin(profiles, eq(assigned_staff.profiles_id, profiles.id))
            .leftJoin(event_queue, and(
                eq(event_queue.profile_id, profiles.id),
                eq(event_queue.event_log_id, eventId),
                isNull(event_queue.station) 
            ))
            .leftJoin(donor, eq(event_queue.donor_id, donor.id))
            .where(
                and(
                    eq(assigned_staff.event_log_id, eventId),
                    eq(assigned_staff.profiles_id, staffId)
                )
            );

        return rawStaffStatus;
    }

    async acceptDonor(queueId: bigint, staffProfileId: string) {

        const updatedQueueRow = await orm
            .update(event_queue)
            .set({ 
                profile_id: staffProfileId 
                // Note: Depending on your schema, you might also update a status column here
            })
            .where(
                and(
                    eq(event_queue.id, queueId),
                    isNull(event_queue.profile_id) 
                )
            )
            .returning();

        return updatedQueueRow;
    }
}