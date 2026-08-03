import { orm } from "../../../db/drizzle";
import { eq, SQL, and, isNull, ne, or, ilike, asc, desc } from "drizzle-orm";
import { LabStaffData } from "@/abstract/ls/ls_abstract";
import { donor } from "@/db/models/donor";
import { event_log } from "@/db/models/event_log";
import { event_queue } from "@/db/models/event_queue";
import { profiles } from "@/db/models/profiles";
import { blood_bag } from "@/db/models/blood_bag";
import { assigned_staff } from "@/db/models/assigned_staff";
import { city } from "@/db/models/city";
import { ViewDonorPartial } from "@/types/donor_type";
import { SubmitDonationPayload } from "@/abstract/ls/ls_abstract";

export class ImpLabStaffModel implements LabStaffData {

    async getStaffEvents (staffId: string, filters: { 
        search?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {

        const { 
            search = "", 
            partner = "All Partners", 
            selectedCity = "All Cities", 
            sortBy = "Date" 
        } = filters;
        
        const conditions: SQL[] = [
            eq(assigned_staff.staff_id, staffId),
            eq(event_log.status, "Ongoing") 
        ];
    
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
            const searchPattern = `%${search}%`;
            conditions.push(
                or(
                    ilike(event_log.name, searchPattern),
                    ilike(event_log.partner, searchPattern),
                    ilike(city.name, searchPattern)
                ) as SQL
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
            .where(and(...conditions))
            .orderBy(orderLogic);

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
                conditions.push(eq(event_queue.station, stationFilter as "med_queue" | "lab_queue"));
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

    async acceptDonor(queueId: bigint, staffProfileId: string) {

        const updatedQueueRow = await orm
            .update(event_queue)
            .set({ 
                staff_id: staffProfileId 
            })
            .where(
                and(
                    eq(event_queue.id, queueId),
                    isNull(event_queue.staff_id) 
                )
            )
            .returning();

        return updatedQueueRow;
    }

    async getSingleDonor(filter: ViewDonorPartial) {

        try {

            if (Object.keys(filter).length === 0) {
                return { success: false, message: "No search filters provided." };
            }

            const filtersDonor: SQL[] = [];
            
            if (filter.id) 
                filtersDonor.push(eq(donor.id, filter.id));

            if (filter.sex) 
                filtersDonor.push(eq(donor.sex, filter.sex));

            if (filter.email) 
                filtersDonor.push(eq(donor.email, filter.email));

            if (filter.first_name) 
                filtersDonor.push(eq(donor.first_name, filter.first_name));

            if (filter.last_name) 
                filtersDonor.push(eq(donor.last_name, filter.last_name));

            if (filter.middle_name) 
                filtersDonor.push(eq(donor.middle_name, filter.middle_name));

            if (filter.mobile_no) 
                filtersDonor.push(eq(donor.mobile_no, filter.mobile_no));

            if (filter.blood) 
                filtersDonor.push(eq(donor.blood, filter.blood));

            if (filter.city_id) 
                filtersDonor.push(eq(donor.city_id, filter.city_id));

            filtersDonor.push(eq(donor.active, true));
            filtersDonor.push(isNull(donor.delete_datetime));

            const [result] = await orm
                .select()
                .from(donor)
                .where(and(...filtersDonor))
                .limit(1);

            if (!result) 
                return { success: false, message: "Donor not found." };
            
            return { success: true, message: "Donor retrieved", data: result };    
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }

    async submitDonationRecord(payload: SubmitDonationPayload) {

        try {

            await orm.transaction(async (tx: any) => {
                
                const [newBag] = await tx.insert(blood_bag).values({
                    donor_id: payload.donor_id,
                    event_id: payload.event_id,
                    serial_number: "Pending",
                    staff_id: payload.staff_id,
                    blood_type: payload.blood_type,
                    volume_ml: payload.volume,
                    outcome: payload.outcome,
                    quality: payload.quality,
                    observations: payload.observations,
                    collection_date: payload.collection_date, 
                }).returning({ insertedId: blood_bag.id });

                const currentYear = new Date().getFullYear();
                const finalSerialNumber = `BAG-${currentYear}-${newBag.insertedId}`;

                await tx.update(blood_bag)
                    .set({ serial_number: finalSerialNumber })
                    .where(eq(blood_bag.id, newBag.insertedId));

                await tx.delete(event_queue)
                    .where(
                        and(
                            eq(event_queue.donor_id, payload.donor_id),
                            eq(event_queue.event_log_id, payload.event_id)
                        )
                    );

                if (payload.outcome === 'Successful') { 

                    const collectionDate = new Date(payload.collection_date);
                    
                    // Add 3 months
                    const nextEligibleDate = new Date(collectionDate);
                    nextEligibleDate.setMonth(collectionDate.getMonth() + 3);

                    await tx.update(donor)
                        .set({ 
                            next_eligibility: nextEligibleDate.toISOString() 
                        })
                        .where(eq(donor.id, payload.donor_id));
                }
            });

            return { success: true, message: "Donation record saved successfully." };
        } catch (err: any) {
            console.error("Database error saving record:", err);
            return { success: false, message: "Failed to save donation record." };
        }
    }
}