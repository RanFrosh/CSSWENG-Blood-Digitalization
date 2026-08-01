import { ApiResponse } from "@/types/api_res_type";
import { inArray, eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { ProfilesData } from "@/abstract/profiles/profiles_abstract";
import { ReadProfile } from "@/types/profile_type";
import { profiles } from "@/db/models/profiles";
import { StaffUserRow } from "@/types/staff_type";
import { authUsers } from "@/db/models/profiles";

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

    async getAllProfiles(): Promise<ApiResponse<ReadProfile[]>> {
        try {
            const res = await this.access.select().from(profiles);
            if (res.length === 0) return { success: false, message: "No staff found", data: [] };
            return { success: true, message: "Staff retrieved", data: res };
        } catch (err: any) {
            return { success: false, message: err.message };
        }       
    }

    async getStaffUsers(): Promise<ApiResponse<StaffUserRow[]>> {
        try {
            const res = await this.access
                .select({
                    id: profiles.id,
                    name: profiles.name,
                    email: authUsers.email,
                    role: profiles.role,
                    dateJoined: profiles.created_at,
                })
                .from(profiles)
                .innerJoin(authUsers, eq(profiles.id, authUsers.id));

            if (res.length === 0) return { success: false, message: "No staff found", data: [] };
            return { success: true, message: "Staff retrieved", data: res };
        } catch (err: any) {
            return { success: false, message: err.message };
        }       
    }
}