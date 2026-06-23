import { LoginProvider } from "@/auth/abstract/login_abstract";
import { ApiResponse } from "@/types/api_res_type";
import { SupabaseClient } from "@supabase/supabase-js";

export class ImpLoginProvider implements LoginProvider {
    private provider: SupabaseClient;

    constructor(injectDatabase: SupabaseClient) {
        this.provider = injectDatabase;
    }

    public async provideLogin(email: string, password: string): Promise<ApiResponse> {
       const { error } = await this.provider.auth.signInWithPassword({email: email, password: password});
       if (error) {
        return { success: false, message: error.message }
       }

       return { success: true, message: 'Success in logging in'}
    }
}