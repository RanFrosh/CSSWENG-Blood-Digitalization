import { ApiResponse } from "@/types/api_res_type";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../global/helper_bouncer/bouncer";
import { QueueController, QueueData } from "@/abstract/queue/queue_abstract";
import { ViewQueueFilters, ViewQueue, DeleteQueue, CreateQueue, UpdateQueue } from "@/types/queue_type";
import { getQueueStation } from "../global/access/permissions";

export class ImpQueueManager implements QueueController {
    private queueModel: QueueData
    private profileReader: ProfileSessionProvider

    constructor(injectQueueModel: QueueData, injectProfileReader: ProfileSessionProvider) {
        this.queueModel = injectQueueModel;
        this.profileReader = injectProfileReader;
    }

    async invokeQueryQueue(filterer: ViewQueueFilters): Promise<ApiResponse<ViewQueue[]>> {
        const res = await helpGateKeep(this.profileReader, 'viewqueue');
        if (!res.success) return { success: false, message: res.message, data: res.data }

        const profile = await this.profileReader.getCurrentUser();
        if (!profile.success || !profile.data?.id) return { success: profile.success, message: profile.message};

        const appendedFilterer: ViewQueueFilters = {
            ...filterer,
            profiles_id: profile.data.id,
            station: getQueueStation(profile.data.role)
        }

        const outcome = await this.queueModel.queryQueue(appendedFilterer);
        return outcome;
    }

    async invokeDeleteQueue(donorTarget: DeleteQueue): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'dequeue');
        if (!res.success) return { success: false, message: res.message, data: res.data }

        const outcome = await this.queueModel.deleteQueue(donorTarget);
        return outcome;
    }

    async invokeAddToQueue(queueTarget: CreateQueue): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'enqueue');
        if (!res.success) return { success: false, message: res.message, data: res.data }

        const outcome = await this.queueModel.addToQueue(queueTarget);
        return outcome;
    }

    async invokeUpdateQueueStation(queueTarget: UpdateQueue): Promise<ApiResponse> {
        const res = await helpGateKeep(this.profileReader, 'updatequeue');
        if (!res.success) return { success: false, message: res.message, data: res.data }

        const profile = await this.profileReader.getCurrentUser();
        if (!profile.success || !profile.data?.id) return { success: profile.success, message: profile.message};

        const appendedQueueTarget: UpdateQueue = {
            ...queueTarget,
            profiles_id: profile.data.id
        }

        const outcome = await this.queueModel.updateQueueStation(appendedQueueTarget);
        return outcome; 
    }
}