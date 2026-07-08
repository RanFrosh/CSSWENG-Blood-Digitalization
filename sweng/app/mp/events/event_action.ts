"use server"

import { ViewEventFilters, ViewEvents } from "@/types/event_type";
import { ApiResponse } from "@/types/api_res_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";
import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";

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