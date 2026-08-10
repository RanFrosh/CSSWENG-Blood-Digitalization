"use server";

import { serverSupa } from "@/db/supaserver";
import { revalidatePath } from "next/cache";
import { ImpProfilesManager } from "@/controllers/profile_controller";
import { ImpProfileGetter } from "@/queries/profile_query";

async function getProfileController() {
    const database = await serverSupa();
    
    const profiler = new ImpProfileGetter(database);

    return new ImpProfilesManager(profiler, profiler);
}

export async function getProfileAction() {
    try {
        const database = await serverSupa();
        const profileReader = new ImpProfileGetter(database);
        
        return await profileReader.getCurrentUser();
    } catch (err: any) {
        console.error("Error fetching profile:", err);
        return { success: false, message: "Server error occurred." };
    }
}

export async function updateProfileAction(data: { 
    name: string; 
    email: string; 
    profile_image_url: string | null 
}) {
    try {
        const controller = await getProfileController();
        const result = await controller.invokeUpdateProfile(data);

        if (result.success) {
            revalidatePath("/");
        }

        return result;
    } catch (err: any) {
        console.error("Error updating profile:", err);
        return { success: false, message: "Server error occurred." };
    }
}