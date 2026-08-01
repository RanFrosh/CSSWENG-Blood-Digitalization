import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";

export interface ProfilesData {
    getProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>>;
    getAllProfiles(): Promise<ApiResponse<ReadProfile[]>>;
}

export interface ProfilesController {
    invokeGetProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>>;
    invokeGetAllProfiles(): Promise<ApiResponse<ReadProfile[]>>;
}