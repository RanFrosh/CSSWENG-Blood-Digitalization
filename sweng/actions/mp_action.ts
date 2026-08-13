"use server"

import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";
import { orm } from "@/db/drizzle";
import { ImpProfileGetter } from "@/queries/profile_query";
import { serverSupa } from "@/db/supaserver";
import { adminSupa } from "@/db/supaadmin";
import { helpGateKeep } from "@/utils/access/bouncer";
import { ImpProfilesModel } from "@/app/profiles/imp_profiles_data";
import { ImpProfilesManager } from "@/app/profiles/imp_profiles_controller";
import { ImpMPManager } from "@/controllers/mp_controller";
import { ImpMPModel } from "@/queries/mp_query";

async function getMPController() {

    const database = await serverSupa();
    const model = new ImpMPModel();
    const profiler = new ImpProfileGetter(database);

    return new ImpMPManager(model, profiler);
}

export async function completeScreening(donorId: bigint, eventId: bigint): Promise<ApiResponse> {
    try {
        const controller = await getMPController();

        return await controller.invokeCompleteScreening(donorId, eventId);
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}

export async function failScreening(donorId: bigint, eventId: bigint): Promise<ApiResponse> {
    try {
        const controller = await getMPController();

        return await controller.invokeFailScreening(donorId, eventId);
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

export async function verifyMPEventAccess(eventIdStr: string) {
    
    try {
        const controller = await getMPController();
        return await controller.invokeVerifyEventAccess(eventIdStr);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Invalid Event ID format" };
    }
}

export async function getMPQueue(eventIdStr: string) {

    try {
        const controller = await getMPController();
        return await controller.invokeGetQueue(eventIdStr, "med_queue");
    } catch (err: any) {
        console.error("Queue Fetch Error:", err);
        return { success: false, message: "Failed to fetch donor queue" };
    }
}

export async function getStaffStatus(eventIdStr: string) {

    try {
        const controller = await getMPController();
        return await controller.invokeGetStaffStatus(eventIdStr);
    } catch (err: any) {
        console.error("Staff Status Fetch Error:", err);
        return { success: false, message: "Failed to fetch staff status" };
    }
}
