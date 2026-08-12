"use server"

import { ViewEventFilters, ViewEvents, ViewEventsWithProvince, CreateEvents } from "@/types/event_type";
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

export async function executeCreateEvent(data: {
    name: string;
    partner: string;
    provinceName: string;
    cityName: string;
    eventDate: string;
    targetBags: string;
    imgUrl?: string | null;
}): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    // 1. Resolve province name → province id
    const provinceRes = await controller.invokeGetProvince(data.provinceName);
    if (!provinceRes.success || !provinceRes.data) {
        return { success: false, message: provinceRes.message || "Province not found" };
    }

    // 2. Resolve city name (+ province id) → city id
    const cityRes = await controller.invokeGetCity(data.cityName, provinceRes.data);
    if (!cityRes.success || !cityRes.data) {
        return { success: false, message: cityRes.message || "City not found" };
    }

    // 3. Date-derived status
    const today = new Date().toISOString().split("T")[0];
    let status: ViewEvents["status"] = "Upcoming";
    if (data.eventDate < today) {
        status = "Completed";
    } else if (data.eventDate === today) {
        status = "Ongoing";
    }

    // 4. Build CreateEvents
    const event: CreateEvents = {
        name: data.name,
        partner: data.partner,
        street: null,
        zip_code: null,
        city_id: cityRes.data,
        event_date: data.eventDate,
        start_time: "09:00:00",   // 9AM
        end_time: "21:00:00",     // 9PM
        status,
        visitors: BigInt(0),
        extractions: BigInt(0),
        produced_bags: BigInt(0),
        perk_claims: BigInt(0),
        target_blood: BigInt(parseInt(data.targetBags, 10) || 100),
        created_at: new Date(),
        img_url: data.imgUrl?.trim() || null,
    };

    // 5. Persist (invokeCreateEvent re-gates with 'create_event')
    return await controller.invokeCreateEvent(event);
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