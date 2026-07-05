"use server" // Added this

import { serverSupa } from "@/db/supaserver";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProfile } from "../fetch_profile/single_profile";

export async function login (formData: FormData) {

    const supabase = await serverSupa();

    // Ask Supabase if a session exists
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        console.error('Already logged in');
        revalidatePath('/');
        return { success: false, message: 'Already logged in' };
    } 
    
    else {

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({ email: email, password: password });
        
        if (error) {
            console.error("Login error", error.message)
            return { success: false, message: error.message }
        }

        revalidatePath('/');
        const profile = await getProfile(supabase);

        if (profile.data?.role === 'super_admin') {
            redirect('/list');
        }

        if (profile.data?.role === 'onsite_admin') {
            redirect('/log');
        }

        if (profile.data?.role === 'med_prof') {
            redirect('/search');
        }

        if (profile.data?.role === 'director') {
            redirect('/analytics');
        }
        else {
            redirect('/');
        }

        revalidatePath('/');
    }
}

export async function logout () {

    const supabase = await serverSupa();
    await supabase.auth.signOut();
    revalidatePath('/landing');
    redirect('/landing');
}