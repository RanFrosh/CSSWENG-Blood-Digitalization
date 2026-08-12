import { ApiResponse } from "@/types/api_res_type";
import { inArray, eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { ProfilesData } from "@/abstract/profiles/profiles_abstract";
import { ReadProfile } from "@/types/profile_type";
import { profiles } from "@/db/schemas/profiles";
import { StaffUserRow } from "@/types/staff_type";
import { authUsers } from "@/db/schemas/profiles";
import { adminSupa } from "@/db/supaadmin";

export class ImpProfilesModel implements ProfilesData {
    private access: typeof orm;
    private admin: typeof adminSupa;

    constructor(injectAccess: typeof orm, injectAdmin: typeof adminSupa) {
        this.access = injectAccess;
        this.admin = injectAdmin;
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
                    active: profiles.active
                })
                .from(profiles)
                .innerJoin(authUsers, eq(profiles.id, authUsers.id));

            if (res.length === 0) return { success: false, message: "No staff found", data: [] };
            return { success: true, message: "Staff retrieved", data: res };
        } catch (err: any) {
            return { success: false, message: err.message };
        }       
    }

    async editProfileName(id: string, name: string): Promise<ApiResponse> {
        try {
            await this.access.update(profiles).set({ name }).where(eq(profiles.id, id));
            return { success: true, message: "Profile name updated" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }        
    }

    async editProfileEmail(id: string, email: string): Promise<ApiResponse> {
        try {
            const { error } = await this.admin.auth.admin.updateUserById(id, { email });
            if (error) return { success: false, message: error.message };
            await this.access.update(profiles).set({ email }).where(eq(profiles.id, id));
            return { success: true, message: "Profile email updated" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }        
    }

    async editProfileImage(id: string, profileImageUrl: string | null): Promise<ApiResponse> {
        try {
            await this.access.update(profiles).set({ profile_image_url: profileImageUrl }).where(eq(profiles.id, id));
            return { success: true, message: "Profile image updated" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }        
    }
}