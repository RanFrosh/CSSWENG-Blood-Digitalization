"use server"

import { ViewEventFilters, ViewEvents } from "@/types/event_type";
import { ApiResponse } from "@/types/api_res_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";
import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";
import { event_log } from "@/db/models/event";
import { assigned_staff } from "@/db/models/assigned_staff";
import { eq } from "drizzle-orm";

export async function executeEventQueryStaff(data: ViewEventFilters): Promise<ApiResponse<ViewEvents[]>> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);

    const profile = await profiler.getCurrentUser();
    if (!profile.success || !profile.data?.id) {
        return { success: false, message: "Not authenticated" };
    }

    const staff: ViewAssignedStaffFilter = { profiles_id: profile.data.id };

    const controller = new ImpEventManager(model, profiler);
    return controller.invokeQueryEventStaff(data, staff);
}

export async function verifyEventAccess(event_log_id: bigint): Promise<ApiResponse<ViewEvents>> {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);

    return controller.invokeVerifyEventAccess(event_log_id);
}