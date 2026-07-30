import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { RegisterData } from "@/abstract/register/register_abstract";
import { adminSupa } from "@/db/supaadmin";
import { AccessType } from "@/db/enums/access_level";
import { profiles } from "@/db/models/profiles";
import { eq } from "drizzle-orm";

export class ImpRegisterModel implements RegisterData {
    private access: typeof orm;
    private admin: typeof adminSupa;

    constructor(injectAccess: typeof orm, injectAdmin: typeof adminSupa) {
        this.access = injectAccess;
        this.admin = injectAdmin;
    }

    async createStaff(email: string, redirectTo: string): Promise<ApiResponse<string>> {
        try {
            const { data, error } = await this.admin.auth.admin.generateLink({
                type: 'invite',
                email,
                options: { redirectTo }
            });

            if (error) return { success: false, message: error.message };
            if (!data?.user) return { success: false, message: "Failed to create user" };

            return { success: true, message: "Staff invited", data: data.user.id };
        } catch (err: any) {
            return { success: false, message: err.message };
        }        
    }

    async createProfile(id: string, role: AccessType): Promise<ApiResponse> {
        try {
            await this.access.insert(profiles).values({
                id,
                name: '',
                role,
            });
            return { success: true, message: "Profile created" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }       
    }

    async setPassword(id: string, password: string): Promise<ApiResponse> {
        try {
            const { error } = await this.admin.auth.admin.updateUserById(id, { password });
            if (error) return { success: false, message: error.message };
            return { success: true, message: "Registration password set" }
        } catch (err: any) {
            return { success: false, message: err.message }
        }     
    }

    async finishProfile(id: string, name: string): Promise<ApiResponse> {
        try {
            await this.access
                .update(profiles)
                .set({ name })
                .where(eq(profiles.id, id));

            return { success: true, message: "Profile updated" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }        
    }
}