import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { RegisterData } from "@/abstract/register/register_abstract";
import { adminSupa } from "@/db/supaadmin";
import { AccessType } from "@/db/enums/access_level";
import { authUsers, profiles } from "@/db/schemas/profiles";
import { eq, sql } from "drizzle-orm";
import { ReadProfile } from "@/types/profile_type";

export class ImpRegisterModel implements RegisterData {
    private access: typeof orm;
    private admin: typeof adminSupa;

    constructor(injectAccess: typeof orm, injectAdmin: typeof adminSupa) {
        this.access = injectAccess;
        this.admin = injectAdmin;
    }

    async createStaff(email: string, redirectTo: string): Promise<ApiResponse<string>> {
        try {
            const { data, error } = await this.admin.auth.admin.inviteUserByEmail(email, { redirectTo });
            if (error) {
                if (error.code === 'user_already_exists') {
                    const { data: linkData, error: linkError } = await this.admin.auth.admin.generateLink({
                        type: 'invite',
                        email,
                        options: { redirectTo },
                    });
                    if (linkError) return { success: false, message: linkError.message };
                    if (!linkData?.properties?.action_link) return { success: false, message: "Failed to generate invite link" };
                    return { success: true, message: "Invite link generated", data: linkData.properties.action_link };
                }
                return { success: false, message: error.message };
            }
            if (!data?.user) return { success: false, message: "Failed to create user" };
            return { success: true, message: "Staff invited", data: data.user.id };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }

    async createProfile(id: string, role: AccessType, email: string): Promise<ApiResponse> {
        try {
            await this.access.insert(profiles).values({
                id,
                name: '',
                role,
                email,
                active: false
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
                .set({ name, active: true })
                .where(eq(profiles.id, id));

            return { success: true, message: "Profile updated" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }        
    }

    async deleteStaff(id: string): Promise<ApiResponse> {
        try {
            await this.access.delete(profiles).where(eq(profiles.id, id));
            const { error } = await this.admin.auth.admin.deleteUser(id);
            if (error) return { success: false, message: error.message };
            return { success: true, message: "Staff deleted" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }        
    }

    async findStaffByEmail(email: string): Promise<ApiResponse<string | null>> {
        try {
            const [user] = await this.access
            .select()
            .from(authUsers)
            .where(eq(authUsers.email, email))
            .limit(1);
            
            if (!user) return { success: true, message: "No user found" };
            return { success: true, message: "User found", data: user.id };
        } catch (err: any) {
            return { success: false, message: err.message };
        }      
    }

    async isProfileComplete(id: string): Promise<ApiResponse<ReadProfile>> {
        try {
            const [profile] = await this.access
            .select()
            .from(profiles)
            .where(eq(profiles.id, id))
            .limit(1);

            if (!profile) return { success: true, message: "No profile" };
            return { success: true, message: "Profile checked", data: profile };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }

    async toggleStaff(id: string): Promise<ApiResponse<boolean>> {
        try {
            const [profile] = await this.access
                .select({ active: profiles.active })
                .from(profiles)
                .where(eq(profiles.id, id))
                .limit(1);

            if (!profile) return { success: false, message: "Staff not found" };

            const nextActive = profile.active === true ? false : true;
            await this.access
                .update(profiles)
                .set({ active: nextActive })
                .where(eq(profiles.id, id));

            return { success: true, message: "Active toggled", data: nextActive };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }
}