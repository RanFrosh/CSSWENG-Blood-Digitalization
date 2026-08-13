"use server"

import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";
import { orm } from "@/db/drizzle";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpProfileGetter } from "@/queries/profile_query";
import { serverSupa } from "@/db/supaserver";
import { adminSupa } from "@/db/supaadmin";
import { helpGateKeep } from "@/utils/access/bouncer";
import { ImpProfilesModel } from "@/app/profiles/imp_profiles_data";
import { ImpProfilesManager } from "@/app/profiles/imp_profiles_controller";
import { executeLogEvent } from "@/app/event_records/event_action";

export async function completeScreening(queueId: bigint): Promise<ApiResponse> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const result = await controller.invokeUpdateQueueStation({
            id: queueId,
            station: 'lab_queue',
            staff_id: null,
        });

        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}

export async function failScreening(queueId: bigint, donorId: bigint, eventId: bigint): Promise<ApiResponse> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const result = await controller.invokeDeleteQueue({ id: queueId });
        if (result.success) {
            await executeLogEvent({
                event_log_id: eventId,
                donor_id: donorId,
                action: "deferral",
                time: new Date().toTimeString().slice(0, 8),
            });           
        }
        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}

export async function fetchMPCurrentUser(): Promise<ApiResponse<ReadProfile>> {
    const database = await serverSupa();
    const profiler = new ImpProfileGetter(database);

    const auth = await helpGateKeep(profiler, "access_mp_page");

    if (!auth.success || !auth.data) {
        return { success: false, message: auth.message };
    }

    return { success: true, message: "Profile retrieved", data: auth.data };
}

export async function editMPCurrentUser(input: {
    name?: string;
    email?: string;
    profile_image_url?: string;
}): Promise<ApiResponse> {
    const database = await serverSupa();
    const profiler = new ImpProfileGetter(database);
    const model = new ImpProfilesModel(orm, adminSupa);
    const controller = new ImpProfilesManager(model, profiler);
    const name = input.name?.trim();
    const email = input.email?.trim();
    const imageProvided = input.profile_image_url !== undefined;
    const image: string | null = imageProvided ? (input.profile_image_url?.trim() || null) : null;

    if (!name && !email && !imageProvided) {
        return { success: false, message: "Please input at least one of the fields" };
    }

    if (name && email) {
        const nameRes = await controller.invokeEditProfileName(name);
        if (!nameRes.success) return nameRes;
        const emailRes =  await controller.invokeEditProfileEmail(email);
        if (!emailRes.success) return emailRes;
        if (imageProvided) {
            const imageRes = await controller.invokeEditProfileImage(image);
            if (!imageRes.success) return imageRes;
        }
        return { success: true, message: "Name and email changed." };   
    }

    if (name) {
        const nameRes = await controller.invokeEditProfileName(name);
        if (!nameRes.success) return nameRes;
        if (imageProvided) {
            const imageRes = await controller.invokeEditProfileImage(image);
            if (!imageRes.success) return imageRes;
        }
        return { success: true, message: "Name changed." };
    }

    if (email) {
        const emailRes = await controller.invokeEditProfileEmail(email);
        if (!emailRes.success) return emailRes;
        if (imageProvided) {
            const imageRes = await controller.invokeEditProfileImage(image);
            if (!imageRes.success) return imageRes;
        }
        return { success: true, message: "Email changed." };
    }

    if (imageProvided) {
        const imageRes = await controller.invokeEditProfileImage(image);
        if (!imageRes.success) return imageRes;
        return { success: true, message: "Profile image changed." };
    }

    return { success: false, message: "Please input at least one of the fields" };
}
