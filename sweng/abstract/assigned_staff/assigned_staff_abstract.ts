import { ApiResponse } from "@/types/api_res_type";
import { ViewAssignedStaff } from "@/types/assigned_staff_type";

export interface AssignedStaffData {
    getStaff(event_id: bigint): Promise<ApiResponse<ViewAssignedStaff[]>>;
}

export interface AssignedStaffController {
    invokeGetStaff(event_id: bigint): Promise<ApiResponse<ViewAssignedStaff[]>>;
}