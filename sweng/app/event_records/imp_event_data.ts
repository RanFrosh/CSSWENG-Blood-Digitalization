import { EventData } from "@/abstract/events/event_abstract";
import { ApiResponse } from "@/types/api_res_type";
import { CreateCorrections, CreateEvents, ViewCorrectionFilters, ViewCorrections, ViewEventFilters, ViewEvents } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";
import { SQL, eq, asc, desc, and, inArray, getTableColumns } from "drizzle-orm";
import { event_log } from "@/db/models/event_log";
import { corrected_event } from "@/db/models/corrected_event";
import { orm } from "@/db/drizzle";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";
import { assigned_staff } from "@/db/models/assigned_staff";
import { city } from "@/db/models/city";

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

    async queryEventStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter): Promise<ApiResponse<ViewEvents[]>> {
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
            .select({ ...getTableColumns(event_log), city: city.name })
            .from(event_log)
            .innerJoin(city, eq(event_log.city_id, city.id))
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
}