"use server"

import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";
import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { ViewEvents } from "@/types/event_type";
import { ViewEventFilters } from "@/types/event_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";

export async function getLabStaffEvents(statusTab?: string): Promise<ApiResponse<ViewEvents[]>> {
    
    try {
        const database = await serverSupa();
        const model = new ImpEventModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpEventManager(model, profiler);

        const eventFilter = (statusTab && statusTab !== "All" 
            ? { status: statusTab } 
            : {}) as ViewEventFilters;

        const dummyStaffFilter = {} as ViewAssignedStaffFilter;

        return await controller.invokeQueryEventStaff(eventFilter, dummyStaffFilter);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Internal server error", data: undefined };
    }
}

export async function verifyLabStaffEventAccess(eventIdStr: string): Promise<ApiResponse<ViewEvents>> {
    
    try {
        const database = await serverSupa();
        const model = new ImpEventModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpEventManager(model, profiler);

        const eventId = BigInt(eventIdStr);

        return await controller.invokeVerifyEventAccess(eventId);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Invalid Event ID format", data: undefined };
    }
}