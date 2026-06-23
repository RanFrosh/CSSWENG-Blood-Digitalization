import { SupabaseClient } from "@supabase/supabase-js";
import { ProfileProvider } from "../abstract/query_abstract";
import { orm } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { profiles } from "@/db/models/profiles";
import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";

export class ProfileGetter implements ProfileProvider {
    private database: SupabaseClient;

    constructor(injectDatabase: SupabaseClient) {
        this.database = injectDatabase;
    }

    public async getCurrentUser(): Promise<ApiResponse<ReadProfile>> {
        const {data, error} = await this.database.auth.getUser();
        if (error || !data.user) {
            return { success: false, message: 'Not authenticated' }
        }
        const [profile] = await orm
        .select()
        .from(profiles)
        .where(eq(profiles.id, data.user.id))
        .limit(1);
        if (!profile) {
            return { success: false, message: 'Profile not found', data: undefined }
        }
        return { success: true, message: 'Profile retrieved' };
    }
}