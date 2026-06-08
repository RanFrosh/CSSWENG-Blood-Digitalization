"use server"

import { supabase } from "@/db/supa";
import { orm } from "@/db/drizzle";
import { profiles } from "@/db/models/profiles";

type AppRole = 'donor' | 'onsite_admin' | 'med_prof' | 'director' | 'super_admin' | 'staff_admin';

export async function testing (name: string, email: string, role: any, password: string) {
    const {data, error} = await supabase.auth.signUp({email :  email, password: password});
    if (error) console.log("problem");
    if (data && !error) {
        await orm.insert(profiles).values({
            id: data.user.id,
            name: name,
            role: role as AppRole
        })
    }

    return { success: true };
}