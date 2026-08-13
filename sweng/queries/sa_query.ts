import { orm } from "@/db/drizzle";
import { event_log } from "@/db/schemas/event_log";
import { profiles } from "@/db/schemas/profiles";
import { assigned_staff } from "@/db/schemas/assigned_staff";
import { edit_requests } from "@/db/schemas/event_request";
import { city } from "@/db/schemas/city";
import { blood_bag } from "@/db/schemas/blood_bag";
import { eq, and, inArray, desc } from "drizzle-orm";
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

    async getEditRequests() {
        return await orm
            .select({
                id: edit_requests.id,
                blood_bag_serial: edit_requests.blood_bag_serial,
                donor_id: edit_requests.donor_id,
                event_id: edit_requests.event_id,
                staff_id: edit_requests.staff_id,
                staff_name: profiles.name, 
                status: edit_requests.status,
                payload: edit_requests.payload,
                created_at: edit_requests.created_at,
                admin_remarks: edit_requests.admin_remarks
            })
            .from(edit_requests)
            .leftJoin(profiles, eq(edit_requests.staff_id, profiles.id))
            .orderBy(desc(edit_requests.created_at));
    }

    async getEditRequestById(requestId: string) {
        return await orm.select()
            .from(edit_requests)
            .where(eq(edit_requests.id, BigInt(requestId)))
            .limit(1);
    }

    async rejectEditRequest(requestId: string, adminId: string, remarks: string) {
        return await orm.update(edit_requests)
            .set({
                status: 'rejected',
                admin_id: adminId,
                admin_remarks: remarks,
                updated_at: new Date()
            })
            .where(eq(edit_requests.id, BigInt(requestId)));
    }

    async approveEditRequest(requestId: string, adminId: string, bloodBagSerial: string, payload: any, remarks?: string) {

        return await orm.transaction(async (tx) => {
            
            await tx.update(blood_bag)
                .set(payload)
                .where(eq(blood_bag.serial_number, bloodBagSerial));

            await tx.update(edit_requests)
                .set({
                    status: 'approved',
                    admin_id: adminId,
                    admin_remarks: remarks || null,
                    updated_at: new Date()
                })
                .where(eq(edit_requests.id, BigInt(requestId)));
        });
    }
}