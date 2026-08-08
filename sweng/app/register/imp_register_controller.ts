import { ApiResponse } from "@/types/api_res_type";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../global/helper_bouncer/bouncer";
import { RegisterData, RegisterController } from "@/abstract/register/register_abstract";
import { AccessType } from "@/db/enums/access_level";
import { ReadProfile } from "@/types/profile_type";

export class ImpRegisterManager implements RegisterController {
    private registerModel: RegisterData
    private profileReader: ProfileSessionProvider

    constructor(injectRegisterModel: RegisterData, injectProfileReader: ProfileSessionProvider) {
        this.registerModel = injectRegisterModel;
        this.profileReader = injectProfileReader;
    }

    async invokeCreateStaff(email: string, redirectTo: string): Promise<ApiResponse<string>> {
        const res = await helpGateKeep(this.profileReader, 'register_user');        
        if (!res.success) return { success: false, message: res.message };
        return await this.registerModel.createStaff(email, redirectTo);        
    }

    async invokeCreateProfile(id: string, role: AccessType): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'register_user');        
        if (!res.success) return { success: false, message: res.message };
        return await this.registerModel.createProfile(id, role);        
    }

    async invokeSetPassword(password: string): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'finish_registration');        
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.registerModel.setPassword(res.data.id, password);        
    }

    async invokeFinishProfile(name: string): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'finish_registration');        
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.registerModel.finishProfile(res.data.id, name);        
    }
    
    async invokeDeleteStaff(id: string): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'register_user');
        if (!res.success) return { success: false, message: res.message };
        return await this.registerModel.deleteStaff(id);
    }

    async invokeFindStaffByEmail(email: string): Promise<ApiResponse<string | null>> {
        const res = await helpGateKeep(this.profileReader, 'register_user');
        if (!res.success) return { success: false, message: res.message };
        return await this.registerModel.findStaffByEmail(email);
    }

    async invokeIsProfileComplete(id: string): Promise<ApiResponse<ReadProfile>> {
        const res = await helpGateKeep(this.profileReader, 'register_user');
        if (!res.success) return { success: false, message: res.message };
        return await this.registerModel.isProfileComplete(id);
    }

    async invokeToggleStaff(id: string): Promise<ApiResponse<boolean>> {
        const res = await helpGateKeep(this.profileReader, 'register_user');
        if (!res.success) return { success: false, message: res.message };
        return await this.registerModel.toggleStaff(id);
    }
}