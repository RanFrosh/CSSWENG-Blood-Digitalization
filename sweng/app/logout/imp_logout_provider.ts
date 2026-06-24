import { LogoutProvider } from "@/abstract/auth/logout_abstract";
import { ApiResponse } from "@/types/api_res_type";
import { SupabaseClient } from "@supabase/supabase-js";

export class ImpLogoutProvider implements LogoutProvider {
    private database: SupabaseClient

    constructor(injectDatabase: SupabaseClient) {
        this.database = injectDatabase;
    }

    public async provideLogout(): Promise<ApiResponse> {
        const { error } = await this.database.auth.signOut();
        if (error) {
            return {success: false, message: error.message}
        }
        return {  success: true, message: "Logged out successfully" }
    }
}