"use server"

import { ViewEventFilters, ViewEvents, ViewEventsWithProvince, ViewCities, CreateEvents, UpdateEvents } from "@/types/event_type";
import { ApiResponse } from "@/types/api_res_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";
import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { ImpAssignedStaffModel } from "@/app/assigned_staff/imp_assigned_staff_data";
import { ImpAssignedStaffManager } from "@/app/assigned_staff/imp_assigned_staff_controller";
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

export async function executeGetAllCities(): Promise<ApiResponse<ViewCities[]>> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    return controller.invokeGetAllCities();
}

function computeEventStatus(eventDate: string): ViewEvents["status"] {
    const today = new Date().toISOString().split("T")[0];
    if (eventDate < today) {
        return "Completed";
    } else if (eventDate === today) {
        return "Ongoing";
    }
    return "Upcoming";
}

export async function executeCreateEvent(data: {
    name: string;
    partner: string;
    cityName: string;
    eventDate: string;
    targetBags: string;
    imgUrl?: string | null;
}): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    const cityRes = await controller.invokeGetCity(data.cityName);
    if (!cityRes.success || !cityRes.data) {
        return { success: false, message: cityRes.message || "City not found" };
    }

    const event: CreateEvents = {
        name: data.name,
        partner: data.partner,
        street: null,
        zip_code: null,
        city_id: cityRes.data,
        event_date: data.eventDate,
        start_time: "09:00:00",   
        end_time: "21:00:00",    
        status: computeEventStatus(data.eventDate),
        visitors: BigInt(0),
        extractions: BigInt(0),
        produced_bags: BigInt(0),
        perk_claims: BigInt(0),
        target_blood: BigInt(parseInt(data.targetBags, 10) || 100),
        created_at: new Date(),
        img_url: data.imgUrl?.trim() || null,
    };

    return await controller.invokeCreateEvent(event);
}

export async function executeUpdateEvent(data: {
    eventId: bigint;
    name: string;
    partner: string;
    cityName: string;
    eventDate: string;
    targetBags: string;
    imgUrl?: string | null;
}): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    const accessRes = await controller.invokeVerifyEventAccess(data.eventId);
    if (!accessRes.success) {
        return { success: false, message: accessRes.message };
    }

    const cityRes = await controller.invokeGetCity(data.cityName);
    if (!cityRes.success || !cityRes.data) {
        return { success: false, message: cityRes.message || "City not found" };
    }

    const update: UpdateEvents = {
        name: data.name,
        partner: data.partner,
        city_id: cityRes.data,
        event_date: data.eventDate,
        status: computeEventStatus(data.eventDate),
        target_blood: BigInt(parseInt(data.targetBags, 10) || 100),
        img_url: data.imgUrl?.trim() || null,
    };

    return await controller.invokeUpdateEvent(data.eventId, update);
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

export async function executeDeleteEvent(eventId: bigint): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    const eventRes = await controller.invokeVerifyEventAccess(eventId);
    if (!eventRes.success || !eventRes.data) {
        return { success: false, message: eventRes.message };
    }
    if (eventRes.data.status !== "Upcoming") {
        return { success: false, message: "Only upcoming events can be deleted." };
    }

    const staffModel = new ImpAssignedStaffModel(orm);
    const staffController = new ImpAssignedStaffManager(staffModel, profiler);
    const staffRes = await staffController.invokeGetStaff(eventId);
    if (staffRes.success && staffRes.data && staffRes.data.length > 0) {
        return { success: false, message: "Cannot delete: staff are assigned to this event." };
    }

    return await controller.invokeDeleteEvent(eventId);
}