import { AccessType } from "@/db/enums/access_level";
import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";

export interface RegisterData {
    createStaff(email: string, redirectTo: string): Promise<ApiResponse<string>>;
    setPassword(id: string, password: string): Promise<ApiResponse>;
    createProfile(id: string, role: AccessType, email: string): Promise<ApiResponse>;
    finishProfile(id: string, name: string): Promise<ApiResponse>;
    deleteStaff(id: string): Promise<ApiResponse>;
    findStaffByEmail(email: string): Promise<ApiResponse<string | null>>;
    isProfileComplete(id: string): Promise<ApiResponse<ReadProfile>>;
    toggleStaff(id: string): Promise<ApiResponse<boolean>>;
}

export interface RegisterController {
    invokeCreateStaff(email:string, redirectTo: string): Promise<ApiResponse<string>>;
    invokeSetPassword(password: string): Promise<ApiResponse>;
    invokeCreateProfile(id: string, role: AccessType, email: string): Promise<ApiResponse>;
    invokeFinishProfile(name: string): Promise<ApiResponse>;
    invokeDeleteStaff(id: string): Promise<ApiResponse>;
    invokeFindStaffByEmail(email: string): Promise<ApiResponse<string | null>>;
    invokeIsProfileComplete(id: string): Promise<ApiResponse<ReadProfile>>;
    invokeToggleStaff(id: string): Promise<ApiResponse<boolean>>;
}