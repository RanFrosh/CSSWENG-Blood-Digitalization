import { serverSupa } from "@/db/supaserver";

export async function login (prevData: FormData, curData: FormData) {
    const supabase = await serverSupa();
    if (prevData) {
        console.error('Already logged in');
        return { success: false, data: null, message: 'Already logged in' };
    } else {
        const email = curData.get('email') as string;
        const password = curData.get('password') as string;
        const { error } = await supabase.auth.signInWithPassword({ email: email, password: password });
        if (error) {
            return { success: false, data: null, message: error.message }
        }
        return { success: true, data: null, message: 'Logged in successfully' }
    }
}

export async function logout () {
    const supabase = await serverSupa();
    await supabase.auth.signOut();
    return { success: true, data: null, message: 'Logged out successfully' }
}