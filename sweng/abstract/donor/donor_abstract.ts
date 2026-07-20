import { ApiResponse } from "@/types/api_res_type";
import { ViewDonor, ViewDonorPartial, CreateDonor } from "@/types/donor_type";

export interface DonorData {
    getSingleDonor(filterer: ViewDonorPartial): Promise<ApiResponse<ViewDonor>>;
    getDonorsByIds(ids: bigint[]): Promise<ApiResponse<ViewDonor[]>>;
}

export interface DonorController {
    invokeGetSingleDonor(filterer: ViewDonorPartial): Promise<ApiResponse<ViewDonor>>;
    invokeGetDonorsByIds(ids: bigint[]): Promise<ApiResponse<ViewDonor[]>>;
}