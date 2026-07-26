"use server"

import { ApiResponse } from "@/types/api_res_type";
import { serverSupa } from "@/db/supaserver";
import { ImpLabStaffManager } from "./ls_controller";
import { ImpLabStaffModel } from "./ls.query";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { ViewEvents } from "@/types/event_type";

async function getLabController() {

    const database = await serverSupa();
    const model = new ImpLabStaffModel();
    const profiler = new ImpProfileGetter(database);

    return new ImpLabStaffManager(model, profiler);
}

export async function getLabStaffEvents(statusTab?: string): Promise<ApiResponse<ViewEvents[]>> {
    
    try {
        const controller = await getLabController();
        return await controller.invokeGetStaffEvents(statusTab);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Internal server error" };
    }
}

export async function verifyLabStaffEventAccess(eventIdStr: string): Promise<ApiResponse<ViewEvents>> {
    
    try {
        const controller = await getLabController();
        return await controller.invokeVerifyEventAccess(eventIdStr);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Invalid Event ID format" };
    }
}

export async function getLabStaffQueue(eventIdStr: string) {

    try {
        const controller = await getLabController();
        return await controller.invokeGetQueue(eventIdStr);
    } catch (err: any) {
        console.error("Queue Fetch Error:", err);
        return { success: false, message: "Failed to fetch donor queue" };
    }
}