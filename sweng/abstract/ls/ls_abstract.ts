import { ApiResponse } from "@/types/api_res_type";

export interface LabStaffData {
    getStaffEvents (staffId: string, statusTab?: string): Promise<any>;
    verifyAccess(staffId: string, eventId: bigint): Promise<any>;
    getEventQueueWithDonors(eventId: bigint, stationFilter?: string | null): Promise<any>;
}

export interface LabStaffController {
    invokeGetStaffEvents(statusTab?: string): Promise<ApiResponse<any>>;
    invokeVerifyEventAccess(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeGetQueue(eventIdStr: string, station?: string | null): Promise<ApiResponse<any>>;
}