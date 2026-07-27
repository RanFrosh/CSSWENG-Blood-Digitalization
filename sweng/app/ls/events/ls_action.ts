"use server"

import { ApiResponse } from "@/types/api_res_type";
import { serverSupa } from "@/db/supaserver";
import { ImpLabStaffManager } from "./ls_controller";
import { ImpLabStaffModel } from "./ls.query";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { ViewEvents } from "@/types/event_type";
import { revalidatePath } from "next/cache";

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

export async function getStaffStatus(eventIdStr: string) {

    try {
        const controller = await getLabController();
        return await controller.invokeGetStaffStatus(eventIdStr);
    } catch (err: any) {
        console.error("Staff Status Fetch Error:", err);
        return { success: false, message: "Failed to fetch staff status" };
    }
}

export async function acceptDonor(queueIdStr: string, eventIdStr: string) {

    try {
        const controller = await getLabController();
        const res = await controller.invokeAcceptDonor(queueIdStr, eventIdStr);

        if (res.success) {
            revalidatePath(`/ls/events/${eventIdStr}`);
        }

        return res;
    } catch (err: any) {
        console.error("Action Error:", err);
        return { success: false, message: "Failed to communicate with server." };
    }
}