"use server";
import { serverSupa } from "@/db/supaserver";
import { orm } from "@/db/drizzle";
import { profiles } from "@/db/schemas/profiles";

export type AppRole = 'onsite_admin' | 'med_prof' | 'director' | 'super_admin';

export async function create_account(name: string, email: string, role: AppRole, password: string) {
    const supabase = await serverSupa();
    
    const { data, error } = await supabase.auth.signUp({ email: email, password: password });

    if (error) {
        console.error("Auth Error:", error.message);
        return { success: false, message: error.message };
    }

    if (!data.user) {
        return { success: false, message: "User creation failed" };
    }

    try {
        await orm.insert(profiles).values({
            id: data.user.id,
            name: name,
            role: role
        });
    } catch (dbError: any) {
        console.error("FULL DB ERROR:", dbError); 
        return { success: false, message: "Auth succeeded, but profile creation failed." };
    }

    return { success: true, message: "Account created successfully" };
}