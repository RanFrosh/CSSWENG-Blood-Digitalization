"use server"

import { serverSupa } from "@/db/supaserver";
import { orm } from "@/db/drizzle";
import { profiles } from "@/db/models/profiles";

type AppRole = 'donor' | 'onsite_admin' | 'med_prof' | 'director' | 'super_admin' | 'staff_admin';

export async function create_account (name: string, email: string, role: any, password: string) {
    const supabase = await serverSupa();
    const {data, error} = await supabase.auth.signUp({email :  email, password: password});

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
            role: role as AppRole
        });

    } catch (dbError: any) {
        console.error("FULL DB ERROR:", dbError); 
        return { success: false, message: dbError.message };
    }
    

    return { success: true , message: "User created"};
}