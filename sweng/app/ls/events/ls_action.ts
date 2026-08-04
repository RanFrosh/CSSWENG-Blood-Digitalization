"use server"

import { serverSupa } from "@/db/supaserver";
import { ImpLabStaffManager } from "./ls_controller";
import { ImpLabStaffModel } from "./ls.query";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { revalidatePath } from "next/cache";
import { bigintToStr } from "@/app/global/serializer/serial";
import { SubmitDonationPayload } from "@/abstract/ls/ls_abstract";

async function getLabController() {

    const database = await serverSupa();
    const model = new ImpLabStaffModel();
    const profiler = new ImpProfileGetter(database);

    return new ImpLabStaffManager(model, profiler);
}

export async function getLabStaffEvents(filters: { 
        search?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {
    
    try {
        const controller = await getLabController();
        return await controller.invokeGetStaffEvents(filters);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Internal server error" };
    }
}

export async function verifyLabStaffEventAccess(eventIdStr: string) {
    
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
        return await controller.invokeGetQueue(eventIdStr, "lab_queue");
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

export async function retrieveDonor (donorIdStr: string) {

    try {
        const controller = await getLabController();
        const numericDonorId = BigInt(donorIdStr);

        const res = await controller.invokeGetSingleDonor({ id: numericDonorId });

        return bigintToStr(res);

    } catch (err: any) {
        console.error("Error retrieving donor:", err);
        return { success: false, message: "Failed to load donor record." };
    }
}

export async function submitDonationRecordAction(rawPayload: any) {

    try {
        const controller = await getLabController();

        const formattedPayload: Omit<SubmitDonationPayload, 'staff_id'> = {
            ...rawPayload,
            donor_id: BigInt(rawPayload.donor_id),
            event_id: BigInt(rawPayload.event_id),
        };

        const res = await controller.invokeSubmitDonationRecord(formattedPayload);

        return bigintToStr(res);

    } catch (err: any) {
        console.error("Error submitting record:", err);
        return { success: false, message: "Failed to process submission." };
    }
}