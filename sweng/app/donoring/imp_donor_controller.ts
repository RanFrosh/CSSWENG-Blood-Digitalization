import { ApiResponse } from "@/types/api_res_type";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../global/helper_bouncer/bouncer";
import { DonorController, DonorData } from "@/abstract/donor/donor_abstract";
import { ViewDonorPartial, ViewDonor } from "@/types/donor_type";

export class ImpDonorManager implements DonorController {
    private donorModel: DonorData
    private profileReader: ProfileSessionProvider

    constructor(injectDonorModel: DonorData, injectProfileReader: ProfileSessionProvider) {
        this.donorModel = injectDonorModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetSingleDonor(filterer: ViewDonorPartial): Promise<ApiResponse<ViewDonor>> {
        const res = await helpGateKeep(this.profileReader, 'viewdonor');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.donorModel.getSingleDonor(filterer);        
    }

    async invokeGetDonorsByIds(ids: bigint[]): Promise<ApiResponse<ViewDonor[]>> {       
        const res = await helpGateKeep(this.profileReader, 'viewdonor');
        if (!res.success || !res.data) return { success: false, message: res.message };
        if (ids.length === 0) return { success: true, message: "No IDs provided", data: [] };
        return await this.donorModel.getDonorsByIds(ids);       
    }
}