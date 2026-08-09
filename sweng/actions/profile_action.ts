"use server";

import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/queries/profile_query";

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