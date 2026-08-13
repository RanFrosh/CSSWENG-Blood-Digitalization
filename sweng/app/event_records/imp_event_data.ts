import { EventData } from "@/abstract/events/event_abstract";
import { ApiResponse } from "@/types/api_res_type";
import { CreateCorrections, CreateEventRecords, CreateEvents, UpdateEvents, ViewCorrectionFilters, ViewCorrections, ViewCities, ViewEventFilters, ViewEventRecords, ViewEvents, ViewEventsWithProvince } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";
import { SQL, eq, asc, desc, and, inArray, ilike, getTableColumns, sql } from "drizzle-orm";
import { event_log } from "@/db/schemas/event_log";
import { corrected_event } from "@/db/schemas/corrected_event";
import { orm } from "@/db/drizzle";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";
import { assigned_staff } from "@/db/schemas/assigned_staff";
import { city } from "@/db/schemas/city";
import { province } from "@/db/schemas/province";
import { event_record } from "@/db/schemas/event_record";
import { profiles } from "@/db/schemas/profiles";
import { donor } from "@/db/schemas/donor";

export class ImpEventModel implements EventData {
    private access: typeof orm;

    constructor(injectAccess: typeof orm) {
        this.access = injectAccess;
    }

    async queryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>> {
        const filtersEvent: SQL[] = [];
        const sortersEvent: SQL[] = [];

        if (data.name) filtersEvent.push(eq(event_log.name, data.name));
        if (data.street) filtersEvent.push(eq(event_log.street, data.street));
        if (data.zip_code) filtersEvent.push(eq(event_log.zip_code, data.zip_code));

        sort.forEach((item) => {
            const column = item.col === 'city' ? city.name : event_log[item.col as keyof typeof event_log.$inferSelect];
            if (item.direction === 'up') {
                sortersEvent.push(asc(column))
            } else {
                sortersEvent.push(desc(column))
            }
        })

        try {
            const events = await this.access
            .select({ ...getTableColumns(event_log), city: city.name })
            .from(event_log)
            .innerJoin(city, eq(event_log.city_id, city.id))
            .where(and(...filtersEvent))
            .orderBy(...sortersEvent)
            return { success: true, message: "Events retrieved", data: events }

        } catch (err: any) {
            return {success: false, message: err.message, data: undefined};
        }
    }

    async queryAllEvents(): Promise<ApiResponse<ViewEventsWithProvince[]>> {
        try {
            const events = await this.access
            .select({ ...getTableColumns(event_log), city: city.name, province: province.name })
            .from(event_log)
            .innerJoin(city, eq(event_log.city_id, city.id))
            .innerJoin(province, eq(city.province_id, province.id))
            return { success: true, message: "Events retrieved", data: events }

        } catch (err: any) {
            return {success: false, message: err.message, data: undefined};
        }
    }

    async createEvent(data: CreateEvents): Promise<ApiResponse> {
        try {
            await this.access
            .insert(event_log)
            .values({...data})
            return { success: true, message: "Event created" }
        } catch (err: any) {
            return { success: false, message: err.message }
        }
    }

    async queryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>> {
        const filtersCorrection: SQL[] = [];
        const sortersCorrection: SQL[] = [];

        if (data.name) filtersCorrection.push(eq(corrected_event.name, data.name));
        if (data.street) filtersCorrection.push(eq(corrected_event.street, data.street));
        if (data.zip_code) filtersCorrection.push(eq(corrected_event.zip_code, data.zip_code));

        sort.forEach((item) => {
            if (item.direction === 'up') {
                sortersCorrection.push(asc(corrected_event[item.col]))
            } else {
                sortersCorrection.push(desc(corrected_event[item.col]))
            }
        })
        try {
            const corrections = await this.access
            .select()
            .from(corrected_event)
            .where(and(...filtersCorrection))
            .orderBy(...sortersCorrection)
            return { success: true, message: "Corrections retrieved", data: corrections }

        } catch (err: any) {
            return {success: false, message: err.message, data: undefined};
        }
    }

    async createCorrection(data: CreateCorrections): Promise<ApiResponse> {
        try {
            await this.access
            .insert(corrected_event)
            .values({...data})
            return { success: true, message: "Correction created" }
        } catch (err: any) {
            return { success: false, message: err.message }
        }
    }

    async queryEventStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter): Promise<ApiResponse<ViewEventsWithProvince[]>> {
        try {

            if (!staff.staff_id) {
                return { success: false, message: "No profile ID", data: undefined };
            }

            const assignments = await this.access
            .select()
            .from(assigned_staff)
            .where(eq(assigned_staff.staff_id, staff.staff_id));

            if (assignments.length === 0) {
                return { success: true, message: "No events assigned", data: [] };
            }

            const eventIds = assignments.map(a => a.event_log_id);

            const filters: SQL[] = [inArray(event_log.id, eventIds)];
            if (data.status) filters.push(eq(event_log.status, data.status));

            const events = await this.access
            .select({ ...getTableColumns(event_log), city: city.name, province: province.name })
            .from(event_log)
            .innerJoin(city, eq(event_log.city_id, city.id))
            .innerJoin(province, eq(city.province_id, province.id))
            .where(and(...filters));

            return { success: true, message: "Events retrieved", data: events };

        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };
        }
    }

    async queryEventById(id: bigint): Promise<ApiResponse<ViewEvents>> {
        try {
            const [event] = await this.access
            .select({ ...getTableColumns(event_log), city: city.name })
            .from(event_log)
            .innerJoin(city, eq(event_log.city_id, city.id))
            .where(eq(event_log.id, id))
            .limit(1);

            if (!event) return { success: false, message: "Event not found", data: undefined }
            return { success: true, message: "Event found", data: event }
        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };        
        }
    }

    async isStaffOnOngoingEvent(staff_id: string): Promise<ApiResponse<boolean>> {
        try {
            const assignments = await this.access
                .select()
                .from(assigned_staff)
                .where(eq(assigned_staff.staff_id, staff_id));

            if (assignments.length === 0) {
                return { success: true, message: "No events assigned", data: false };
            }

        const eventIds = assignments.map((a) => a.event_log_id);

        const ongoing = await this.access
            .select({ id: event_log.id })
            .from(event_log)
            .where(and(inArray(event_log.id, eventIds), eq(event_log.status, "Ongoing")));

        return { success: true, message: "Ongoing event check completed", data: ongoing.length > 0 };
        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };
        }        
    }

    async getProvince(provinceName: string): Promise<ApiResponse<bigint>> {
        try {
            const [result] = await this.access
                .select({ id: province.id })
                .from(province)
                .where(ilike(province.name, provinceName.trim()))
                .limit(1);

            if (!result) {
                return { success: false, message: "Province not found", data: undefined };
            }
            return { success: true, message: "Province found", data: result.id };
        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };
        }
    }

    async getCity(cityName: string): Promise<ApiResponse<bigint>> {
        try {
            const [result] = await this.access
                .select({ id: city.id })
                .from(city)
                .where(ilike(city.name, cityName.trim()))
                .limit(1);

            if (!result) {
                return { success: false, message: "City not found", data: undefined };
            }
            return { success: true, message: "City found", data: result.id };
        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };
        }
    }

    async getAllCities(): Promise<ApiResponse<ViewCities[]>> {
        try {
            const cities = await this.access
                .select({ id: city.id, name: city.name, province_id: city.province_id })
                .from(city)
                .orderBy(asc(city.name));

            return { success: true, message: "Cities retrieved", data: cities };
        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };
        }
    }

    async updateEvent(id: bigint, data: UpdateEvents): Promise<ApiResponse> {
        try {
            await this.access
                .update(event_log)
                .set({ ...data })
                .where(eq(event_log.id, id));
            return { success: true, message: "Event updated" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }

    async deleteEvent(id: bigint): Promise<ApiResponse> {
        try {
            await this.access
                .delete(event_log)
                .where(eq(event_log.id, id));
            return { success: true, message: "Event deleted" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }

    async updateEventStatuses(): Promise<ApiResponse<number>> {
        try {
            const statusCase = sql`
                CASE
                    WHEN ${event_log.event_date} < CURRENT_DATE THEN 'Completed'::event_status
                    WHEN ${event_log.event_date} = CURRENT_DATE THEN 'Ongoing'::event_status
                    ELSE 'Upcoming'::event_status
                END
            `;

            const result = await this.access
                .update(event_log)
                .set({ status: statusCase })
                .where(sql`${event_log.status} IS DISTINCT FROM ${statusCase}`)
                .returning({ id: event_log.id });

            return { success: true, message: "Event statuses reconciled", data: result.length };
        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };
        }
    }

    async logEvent(data: CreateEventRecords): Promise<ApiResponse> {
        try {
            await this.access
            .insert(event_record)
            .values({...data})
            return { success: true, message: "Event record created" }
        } catch (err: any) {
            return { success: false, message: err.message }
        }        
    }

    async queryEventRecords(event_log_id: bigint): Promise<ApiResponse<ViewEventRecords[]>> {
        try {
            const records = await this.access
            .select({
                event_log_id: event_record.event_log_id,
                event_name: event_log.name,
                staff_name: profiles.name,
                staff_role: profiles.role,
                donor_first_name: donor.first_name,
                donor_last_name: donor.last_name,
                action: event_record.action,
                time: event_record.time,
            })
            .from(event_record)
            .innerJoin(event_log, eq(event_record.event_log_id, event_log.id))
            .innerJoin(profiles, eq(event_record.staff_id, profiles.id))
            .innerJoin(donor, eq(event_record.donor_id, donor.id))
            .where(eq(event_record.event_log_id, event_log_id))
            .orderBy(asc(event_record.time));
            
            return { success: true, message: "Event records retrieved", data: records };
        } catch (err: any) {
            return { success: false, message: err.message, data: undefined };
        }        
    }
}