"use server"

import { ViewEventFilters } from "@/types/event_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";
import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";

export async function executeEventQueryStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter) {
    const database = await serverSupa();
    const model = new ImpEventModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpEventManager(model, profiler);
    return controller.invokeQueryEventStaff(data, staff);
}