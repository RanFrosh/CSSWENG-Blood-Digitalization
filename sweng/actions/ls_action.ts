"use server"

import { serverSupa } from "@/db/supaserver";
import { ImpLabStaffManager } from "@/controllers/ls_controller";
import { ImpLabStaffModel } from "@/queries/ls_query";
import { ImpProfileGetter } from "@/queries/profile_query";
import { revalidatePath } from "next/cache";
import { bigintToStr } from "@/utils/serialize/serial";
import { SubmitDonationPayload } from "@/abstract/ls/ls_abstract";
import { executeLogEvent } from "@/actions/event_action";

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

export async function checkExtractionAccessAction(eventIdStr: string, donorIdStr: string) {
    
    try {
        if (!eventIdStr || !donorIdStr) {
            return { authorized: false, message: "Invalid event or donor ID." };
        }

        const supabase = await serverSupa();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { authorized: false, message: "Not authenticated" };
        }

        const controller = await getLabController();
        const numericEventId = BigInt(eventIdStr);
        const numericDonorId = BigInt(donorIdStr);

        const res = await controller.invokeValidateExtractionAccess(user.id, numericEventId, numericDonorId);

        return res;

    } catch (err: any) {
        console.error("Error validating extraction access:", err);
        return { authorized: false, message: "An unexpected error occurred." };
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

        if (res.success) {
            await executeLogEvent({
                event_log_id: formattedPayload.event_id,
                donor_id: formattedPayload.donor_id,
                action: formattedPayload.outcome === "Successful" ? "donate_success" : "donate_fail",
                time: new Date().toTimeString().slice(0, 8),
            });
        }

        return bigintToStr(res);

    } catch (err: any) {
        console.error("Error submitting record:", err);
        return { success: false, message: "Failed to process submission." };
    }
}

export async function getEventDonorsAction(eventId: string, filters?: any) {
    try {
        const controller = await getLabController();
        
        return await controller.invokeGetEventDonors(eventId, filters);
    } catch (err: any) {
        console.error("Action Error (getEventDonorsAction):", err);
        return { success: false, message: "Server error occurred while fetching donors." };
    }
}

export async function joinEventAction(eventId: string) {
    try {

        const controller = await getLabController();
        
        return await controller.invokeJoinEvent(eventId);
    } catch (err: any) {
        console.error("Action Error (joinEventAction):", err);
        return { success: false, message: "Server error occurred." };
    }
}

export async function getDonorEventRecord(eventId: string, donorId: string) {
    try {

        const controller = await getLabController();
        
        return await controller.invokeGetDonorRecord(eventId, donorId);
    } catch (err: any) {
        console.error("Action Error (joinEventAction):", err);
        return { success: false, message: "Server error occurred." };
    }
}

export async function submitEditRequestAction(params: {
    blood_bag_serial: string;
    donor_id: string;
    event_id: string;
    payload: any;
}) {
    try {
        const controller = await getLabController();
        return await controller.invokeSubmitEditRequest(params);
    } catch (err: any) {
        console.error("Action Error (submitEditRequestAction):", err);
        return { success: false, message: "Server error occurred while submitting." };
    }
}