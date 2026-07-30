import { AccessType } from "@/db/enums/access_level";
import { ApiResponse } from "@/types/api_res_type";

export interface RegisterData {
    createStaff(email: string, redirectTo: string): Promise<ApiResponse<string>>;
    setPassword(id: string, password: string): Promise<ApiResponse>;
    createProfile(id: string, role: AccessType): Promise<ApiResponse>;
    finishProfile(id: string, name: string): Promise<ApiResponse>;
    deleteStaff(id: string): Promise<ApiResponse>;
}

export interface RegisterController {
    invokeCreateStaff(email:string, redirectTo: string): Promise<ApiResponse<string>>;
    invokeSetPassword(password: string): Promise<ApiResponse>;
    invokeCreateProfile(id: string, role: AccessType): Promise<ApiResponse>;
    invokeFinishProfile(name: string): Promise<ApiResponse>;
    invokeDeleteStaff(id: string): Promise<ApiResponse>;
}