import { ApiResponse } from "@/types/api_res_type";
import { UpdateQueue } from "@/types/queue_type";
import { DeleteQueue } from "@/types/queue_type";

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

export interface MPData {
    verifyAccess(staffId: string, eventId: bigint): Promise<any>;
    getEventQueueWithDonors(eventId: bigint, stationFilter?: string | null): Promise<any>;
    verifyAccess(staffId: string, eventId: bigint): Promise<any>;
    getStaffStatusForEvent(eventId: bigint, staffId: string): Promise<any>;
    getActiveQueueByDonorAndEvent(donorId: bigint, eventId: bigint, station: string): Promise<any>;
    updateQueueStation(queueTarget: UpdateQueue): Promise<any>;
    deleteQueue(donorTarget: DeleteQueue): Promise<any>;
}

export interface MPController {
    invokeVerifyEventAccess(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeGetQueue(eventIdStr: string, station?: string | null): Promise<ApiResponse<any>>;
    invokeGetStaffStatus(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeUpdateQueueStation(queueTarget: UpdateQueue): Promise<ApiResponse<any>>;
    invokeCompleteScreening(donorId: bigint, eventId: bigint): Promise<ApiResponse<any>>;
    invokeDeleteQueue(donorTarget: DeleteQueue): Promise<ApiResponse<any>>;
    invokeFailScreening(donorId: bigint, eventId: bigint): Promise<ApiResponse<any>>;
}