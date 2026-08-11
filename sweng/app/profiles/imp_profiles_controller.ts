import { ApiResponse } from "@/types/api_res_type";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../utils/access/bouncer";
import { ProfilesController, ProfilesData } from "@/abstract/profiles/profiles_abstract";
import { ReadProfile } from "@/types/profile_type";
import { StaffUserRow } from "@/types/staff_type";

export class ImpProfilesManager implements ProfilesController {
    private profilesModel: ProfilesData
    private profileReader: ProfileSessionProvider
    constructor(injectProfilesModel: ProfilesData, injectProfileReader: ProfileSessionProvider) {
        this.profilesModel = injectProfilesModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>> {
        const res = await helpGateKeep(this.profileReader, 'viewprofiles');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.profilesModel.getProfiles(ids);        
    }

    async invokeGetAllProfiles(): Promise<ApiResponse<ReadProfile[]>> {
        const res = await helpGateKeep(this.profileReader, 'viewprofiles');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.profilesModel.getAllProfiles();       
    }

    async invokeGetStaffUsers(): Promise<ApiResponse<StaffUserRow[]>> {
        const res = await helpGateKeep(this.profileReader, 'viewprofiles');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.profilesModel.getStaffUsers();        
    }

    async invokeEditProfileName(name: string): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'edit_profile');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.profilesModel.editProfileName(res.data.id, name);
    }

    async invokeEditProfileEmail(email: string): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'edit_profile');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.profilesModel.editProfileEmail(res.data.id, email);
    }
    
}