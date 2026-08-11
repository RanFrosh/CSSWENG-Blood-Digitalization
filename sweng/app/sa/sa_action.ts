"use server"

import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";
import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/queries/profile_query";
import { helpGateKeep } from "@/utils/access/bouncer";
import { ImpProfilesModel } from "../profiles/imp_profiles_data";
import { ImpProfilesManager } from "../profiles/imp_profiles_controller";
import { orm } from "@/db/drizzle";
import { adminSupa } from "@/db/supaadmin";

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
}): Promise<ApiResponse> {
    const database = await serverSupa();
    const profiler = new ImpProfileGetter(database);
    const model = new ImpProfilesModel(orm, adminSupa);
    const controller = new ImpProfilesManager(model, profiler);
    const name = input.name?.trim();
    const email = input.email?.trim();

    if (!name && !email) {
        return { success: false, message: "Please input at least one of the fields" };
    }

    if (name && email) {
        const nameRes = await controller.invokeEditProfileName(name);
        if (!nameRes.success) return nameRes;
        const emailRes =  await controller.invokeEditProfileEmail(email);
        if (!emailRes.success) return emailRes;
        return { success: true, message: "Name and email changed." };   
    }

    if (name) {
        return await controller.invokeEditProfileName(name);
    }

    if (email) {
        return await controller.invokeEditProfileEmail(email);
    }

    return { success: false, message: "Please input at least one of the fields" };
}
