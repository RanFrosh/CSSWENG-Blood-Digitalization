"use server" // Added this

import { serverSupa } from "@/db/supaserver";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login (formData: FormData) {

    const supabase = await serverSupa();

    // Ask Supabase if a session exists
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        console.error('Already logged in');
        return { success: false, data: null, message: 'Already logged in' };
    } 
    
    else {

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({ email: email, password: password });
        
        if (error) {
            console.error("Login error", error.message)
            return { success: false, data: null, message: error.message }
        }

        revalidatePath('/');
        redirect('profile');
    }
}

export async function logout () {

    const supabase = await serverSupa();
    await supabase.auth.signOut();

    revalidatePath('/');
}