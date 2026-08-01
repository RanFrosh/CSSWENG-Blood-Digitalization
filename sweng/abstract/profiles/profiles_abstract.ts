import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";
import { StaffUserRow } from "@/types/staff_type";

export interface ProfilesData {
    getProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>>;
    getAllProfiles(): Promise<ApiResponse<ReadProfile[]>>;
    getStaffUsers(): Promise<ApiResponse<StaffUserRow[]>>; 
}

export interface ProfilesController {
    invokeGetProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>>;
    invokeGetAllProfiles(): Promise<ApiResponse<ReadProfile[]>>;
    invokeGetStaffUsers(): Promise<ApiResponse<StaffUserRow[]>>;
}