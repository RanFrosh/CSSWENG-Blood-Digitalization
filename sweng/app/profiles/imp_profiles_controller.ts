import { ApiResponse } from "@/types/api_res_type";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../global/helper_bouncer/bouncer";
import { ProfilesController, ProfilesData } from "@/abstract/profiles/profiles_abstract";
import { ReadProfile } from "@/types/profile_type";

export class ImpProfilesManager implements ProfilesController {
    private profilesModel: ProfilesData
    private profileReader: ProfileSessionProvider

    constructor(injectProfilesModel: ProfilesData, injectProfileReader: ProfileSessionProvider) {
        this.profilesModel = injectProfilesModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>> {
        const res = await helpGateKeep(this.profileReader, 'viewdonor');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.profilesModel.getProfiles(ids);        
    }
    
}