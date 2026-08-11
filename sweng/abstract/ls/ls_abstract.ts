import { ApiResponse } from "@/types/api_res_type";
import { ViewDonorPartial } from "@/types/donor_type";

export interface SubmitDonationPayload {
    donor_id: bigint;
    event_id: bigint;
    staff_id: string;
    blood_bag_id: string;
    blood_type: string;
    volume: number;
    outcome: string;
    quality: string;
    observations: string;
    collection_date: string;
}

export interface LabStaffData {
    getStaffEvents (staffId: string, filters: { 
        search?: string;
        status?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    }): Promise<any>;
    verifyAccess(staffId: string, eventId: bigint): Promise<any>;
    getEventQueueWithDonors(eventId: bigint, stationFilter?: string | null): Promise<any>;
    getStaffStatusForEvent(eventId: bigint, staffId: string): Promise<any>;
    acceptDonor(queueId: bigint, staffProfileId: string): Promise<any>;
    getSingleDonor(filter: ViewDonorPartial): Promise<any>;
    validateExtractionAccess(staffId: string, eventId: bigint, donorId: bigint): Promise<any>;
    submitDonationRecord(payload: SubmitDonationPayload): Promise<any>;
    getEventDonors(eventId: string, filters?: any): Promise<any>;
    joinEvent(eventId: string, staffId: string): Promise<any>;
}

export interface LabStaffController {
    invokeGetStaffEvents(filters: { 
        search?: string;
        status?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    }): Promise<ApiResponse<any>>;
    invokeVerifyEventAccess(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeGetQueue(eventIdStr: string, station?: string | null): Promise<ApiResponse<any>>;
    invokeGetStaffStatus(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeAcceptDonor(queueIdStr: string, eventIdStr: string): Promise<ApiResponse<any>>;
    invokeGetSingleDonor(filter: ViewDonorPartial): Promise<ApiResponse<any>>;
    invokeValidateExtractionAccess(staffId: string, eventId: bigint, donorId: bigint): Promise<ApiResponse<any>>;
    invokeSubmitDonationRecord(payload: SubmitDonationPayload): Promise<ApiResponse<any>>;
    invokeGetEventDonors(eventId: string, filters?: any): Promise<ApiResponse<any>>;
    invokeJoinEvent(eventId: string): Promise<ApiResponse<any>>;
}