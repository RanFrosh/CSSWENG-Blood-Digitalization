import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";

export interface ProfileProvider {
    getCurrentUser(): Promise<ApiResponse<ReadProfile>>;
}