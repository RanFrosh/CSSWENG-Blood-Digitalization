import { ApiResponse } from "@/types/api_res_type";
import { 
    ViewQueueFilters,
    CreateQueue,
    UpdateQueue,
    ViewQueue,
    DeleteQueue
 } from "@/types/queue_type";

export interface QueueData {
    queryQueue(filterer: ViewQueueFilters): Promise<ApiResponse<ViewQueue[]>>
    deleteQueue(donorTarget: DeleteQueue): Promise<ApiResponse>
    addToQueue(queueTarget: CreateQueue): Promise<ApiResponse>
    updateQueueStation(queueTarget: UpdateQueue): Promise<ApiResponse>
}

export interface QueueController {
    invokeQueryQueue(filterer: ViewQueueFilters): Promise<ApiResponse<ViewQueue[]>>
    invokeDeleteQueue(donorTarget: DeleteQueue): Promise<ApiResponse>
    invokeAddToQueue(queueTarget: CreateQueue): Promise<ApiResponse>
    invokeUpdateQueueStation(queueTarget: UpdateQueue): Promise<ApiResponse>
    invokePickNextQueue(event_guy: bigint): Promise<ApiResponse<ViewQueue>>
    invokePeekNextQueue(event_guy: bigint): Promise<ApiResponse<ViewQueue>>
}