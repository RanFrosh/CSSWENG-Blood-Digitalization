"use server"

import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { serverSupa } from "@/db/supaserver";

export async function completeScreening(queueId: bigint): Promise<ApiResponse> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const result = await controller.invokeUpdateQueueStation({
            id: queueId,
            station: 'lab_queue',
            profiles_id: null,
        });

        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}

export async function failScreening(queueId: bigint): Promise<ApiResponse> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const result = await controller.invokeDeleteQueue({ id: queueId });
        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}
