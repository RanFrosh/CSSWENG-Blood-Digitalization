import { ApiResponse } from "@/types/api_res_type"
import { ReadProfile } from "@/types/profile_type"

export interface LoginProvider {
    provideLogin(email: string, password: string): Promise<ApiResponse>
}

export interface LoginControl {
    invokeLogin(email: string, password: string): Promise<ApiResponse<ReadProfile>>
}