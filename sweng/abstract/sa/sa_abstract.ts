import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";
import { StaffUserRow } from "@/types/staff_type";

export interface SuperAdminData {
    //getProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>>;
    //getAllProfiles(): Promise<ApiResponse<ReadProfile[]>>;
    //getStaffUsers(): Promise<ApiResponse<StaffUserRow[]>>;
    //editProfileName(id: string, name: string): Promise<ApiResponse>;
    //editProfileEmail(id: string, email: string): Promise<ApiResponse>; 
    //editProfileImage(id: string, profileImageUrl: string | null): Promise<ApiResponse>;
    getEventById(eventId: string): Promise<any>;
    getEligibleStaff(): Promise<any>;
    getAssignedStaffIdsForEvent(eventId: string): Promise<any>;
    insertEventStaff(eventId: string, staffIds: string[]): Promise<any>;
    deleteEventStaff(eventId: string, staffIds: string[]): Promise<any>;
    getEditRequests(): Promise<any>;
    getEditRequestById(requestId: string): Promise<any>;
    rejectEditRequest(requestId: string, adminId: string, remarks: string): Promise<any>;
    approveEditRequest(requestId: string, adminId: string, bloodBagSerial: string, payload: any, remarks?: string): Promise<any>;
}

export interface SuperAdminController {
    //invokeGetProfiles(ids: string[]): Promise<ApiResponse<ReadProfile[]>>;
    //invokeGetAllProfiles(): Promise<ApiResponse<ReadProfile[]>>;
    //invokeGetStaffUsers(): Promise<ApiResponse<StaffUserRow[]>>;
    //invokeEditProfileName(name: string): Promise<ApiResponse>;
    //invokeEditProfileEmail(email: string): Promise<ApiResponse>;
    //invokeEditProfileImage(profileImageUrl: string | null): Promise<ApiResponse>;
    invokeFetchEventSummary(eventId: string): Promise<ApiResponse<any>>;
    invokeFetchEventStaffLists(eventId: string): Promise<ApiResponse<any>>;
    invokeAssignStaffToEvent(eventId: string, staffIds: string[]): Promise<ApiResponse<any>>;
    invokeRemoveStaffFromEvent(eventId: string, staffIds: string[]): Promise<ApiResponse<any>>;
    invokeFetchEditRequests(): Promise<ApiResponse<any>>;
    invokeRejectEditRequest(requestId: string, adminId: string, remarks: string): Promise<ApiResponse<any>>;
    invokeApproveEditRequest(requestId: string, adminId: string, remarks?: string): Promise<ApiResponse<any>>;
    
}