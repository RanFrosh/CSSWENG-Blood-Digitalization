import { ApiResponse } from "@/types/api_res_type";

export interface LabStaffData {
    getStaffEvents (staffId: string, statusTab?: string): Promise<any>;
    verifyAccess(staffId: string, eventId: bigint): Promise<any>;
    getEventQueueWithDonors(eventId: bigint, stationFilter?: string | null): Promise<any>;
    getStaffStatusForEvent(eventId: bigint, staffId: string): Promise<any>;
    acceptDonor(queueId: bigint, staffProfileId: string): Promise<any>;
}

export interface LabStaffController {
    invokeGetStaffEvents(statusTab?: string): Promise<ApiResponse<any>>;
    invokeVerifyEventAccess(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeGetQueue(eventIdStr: string, station?: string | null): Promise<ApiResponse<any>>;
    invokeGetStaffStatus(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeAcceptDonor(queueIdStr: string, eventIdStr: string): Promise<ApiResponse<any>>;
}