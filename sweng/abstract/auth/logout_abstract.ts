import { ApiResponse } from "@/types/api_res_type"

export interface LogoutProvider {
    provideLogout(): Promise<ApiResponse>
}

export interface LogoutControl {
    invokeLogout(): Promise<ApiResponse>
}