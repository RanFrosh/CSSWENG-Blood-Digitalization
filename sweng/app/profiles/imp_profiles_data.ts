import { ApiResponse } from "@/types/api_res_type";
import { inArray } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { ProfilesData } from "@/abstract/profiles/profiles_abstract";
import { ReadProfile } from "@/types/profile_type";
import { profiles } from "@/db/models/profiles";

export class ImpProfilesModel implements ProfilesData {
    private access: typeof orm;

    constructor(injectAccess: typeof orm) {
        this.access = injectAccess;
    }

    async getProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>> {
        try {
            const res = await this.access
                .select()
                .from(profiles)
                .where(inArray(profiles.id, ids));
            if (res.length === 0) return { success: false, message: "Staff do not exist", data: [] };
            return { success: true, message: "Staff retrieved", data: res };
        } catch (err: any) {
            return { success: false, message: err.message }  ;          
        }
    }
}