"use server"

import { orm } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { serverSupa } from "@/db/supaserver";
import { profiles } from "@/db/schemas/profiles";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProfile (client?: SupabaseClient) {  
    {
    const supabase = client ?? await serverSupa();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('Invalid request on single_profile, anonymous');
        return { success: false, data: null, message: 'Invalid request on single_profile, anonymous' }
    }
    try {
        const [profile] = await orm
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1);

        if (profile) {
        return { success: true, data: profile, message: "Query for profile is a success" };
        } else {
            return { success: false, data: null, message: "Profile does not exist" }
        }
    } catch (err: any) {
        console.error("try block failed on single profile: " + err.message);
        return { success: false, data: null, message: err.message };
    }   
    }
}