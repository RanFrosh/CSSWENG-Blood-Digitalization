"use server"

import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";
import { serverSupa } from "@/db/supaserver";
import { adminSupa } from "@/db/supaadmin";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";
import { ImpProfileGetter } from "@/queries/profile_query";
import { helpGateKeep } from "@/utils/access/bouncer";
import { ImpProfilesModel } from "@/app/profiles/imp_profiles_data";
import { ImpProfilesManager } from "@/app/profiles/imp_profiles_controller";

export async function fetchOACurrentUser(): Promise<ApiResponse<ReadProfile>> {
    const database = await serverSupa();
    const profiler = new ImpProfileGetter(database);

    const auth = await helpGateKeep(profiler, "access_oa_page");

    if (!auth.success || !auth.data) {
        return { success: false, message: auth.message };
    }

    return { success: true, message: "Profile retrieved", data: auth.data };
}

export async function editOACurrentUser(input: {
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

export async function register_new_donor(formData: any) {
    try {
        const [newDonor] = await orm.insert(donor).values({
            first_name: formData.fname,
            middle_name: formData.mname,
            last_name: formData.lname,
            age: formData.age,
            sex: formData.sex,
            blood: formData.blood,
            email: formData.email,
            mobile_no: formData.mobile,
            zip_code: formData.zip,
            city_id: BigInt(3),
            active: true, 
            verifiedBlood: false 
        }).returning({ id: donor.id });

        return { success: true, newId: newDonor.id };
    } catch (error: any) {
        console.error("DONOR INSERT ERROR:", error);
        return { success: false, message: error.message };
    }
}