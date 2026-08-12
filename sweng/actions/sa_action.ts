"use server"

import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";
import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/queries/profile_query";
import { helpGateKeep } from "@/utils/access/bouncer";
import { ImpProfilesModel } from "../app/profiles/imp_profiles_data";
import { ImpProfilesManager } from "../app/profiles/imp_profiles_controller";
import { orm } from "@/db/drizzle";
import { adminSupa } from "@/db/supaadmin";
import { ImpSuperAdminModel } from "@/queries/sa_query";
import { ImpSuperAdminManager } from "@/controllers/sa_controller";
import { revalidatePath } from "next/cache";

async function getSAController() {

    const database = await serverSupa();
    const model = new ImpSuperAdminModel();
    const profiler = new ImpProfileGetter(database);

    return new ImpSuperAdminManager(model, profiler);
}

export async function fetchSACurrentUser(): Promise<ApiResponse<ReadProfile>> {
    
    const database = await serverSupa();
    const profiler = new ImpProfileGetter(database);

    const auth = await helpGateKeep(profiler, "access_sa_page");

    if (!auth.success || !auth.data) {
        return { success: false, message: auth.message };
    }

    return { success: true, message: "Profile retrieved", data: auth.data };
}

export async function editSACurrentUser(input: {
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

export async function getEventSummaryAction(eventId: string) {

    try {
        const controller = await getSAController();
        return await controller.invokeFetchEventSummary(eventId);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Internal server error" };
    }
}


export async function getEventStaffAction(eventId: string) {

    try {
        const controller = await getSAController();
        return await controller.invokeFetchEventStaffLists(eventId);
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { success: false, message: "Internal server error" };
    }
}

export async function assignStaffAction(eventId: string, staffIds: string[]) {
    try {
        const controller = await getSAController();
        const response = await controller.invokeAssignStaffToEvent(eventId, staffIds);

        if (response.success) {
            revalidatePath(`/sa/management/events/${eventId}/staff`); 
        }
        
        return response;
    } catch (err: any) {
        console.error("Server Action Error (assignStaff):", err);
        return { success: false, message: "Internal server error" };
    }
}

export async function removeStaffAction(eventId: string, staffIds: string[]) {
    try {
        const controller = await getSAController();
        const response = await controller.invokeRemoveStaffFromEvent(eventId, staffIds);
        
        if (response.success) {
            revalidatePath(`/sa/management/events/${eventId}/staff`);
        }
        
        return response;
    } catch (err: any) {
        console.error("Server Action Error (removeStaff):", err);
        return { success: false, message: "Internal server error" };
    }
}
