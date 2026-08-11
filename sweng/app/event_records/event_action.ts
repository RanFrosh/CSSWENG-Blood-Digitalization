"use server"

import { ViewEventFilters, ViewEvents, ViewEventsWithProvince } from "@/types/event_type";
import { ApiResponse } from "@/types/api_res_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";
import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { ImpProfileGetter } from "@/queries/profile_query";
import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";
import { helpGateKeep } from "@/utils/access/bouncer";
import { CreateEventRecords, ViewEventRecords } from "@/types/event_type";

export async function executeEventQueryStaff(data: ViewEventFilters): Promise<ApiResponse<ViewEvents[]>> {
    
    const database = await serverSupa();

    const profiler = new ImpProfileGetter(database);

    const auth = await helpGateKeep(profiler, "access_mp_page")

    if (!auth.success || !auth.data) {
        return { success: false, message: auth.message };
    }

    const profile = await profiler.getCurrentUser();
    if (!profile.success || !profile.data?.id) {
        return { success: false, message: "Not authenticated" };
    }

    const staff: ViewAssignedStaffFilter = { staff_id: profile.data.id };

    const model = new ImpEventModel(orm);
    const controller = new ImpEventManager(model, profiler);

    return controller.invokeQueryEventStaff(data, staff);
}

export async function executeQueryAllEvents(): Promise<ApiResponse<ViewEventsWithProvince[]>> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    return controller.invokeQueryAllEvents();
}

export async function verifyEventAccess(event_log_id: bigint): Promise<ApiResponse<ViewEvents>> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    return controller.invokeVerifyEventAccess(event_log_id);
}

export async function executeLogEvent(
    data: Omit<CreateEventRecords, "staff_id">
): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);
    return controller.invokeLogEvent(data);
}

export async function executeQueryEventRecords(
    event_log_id: bigint
): Promise<ApiResponse<ViewEventRecords[]>> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);
    return controller.invokeQueryEventRecords(event_log_id);
}