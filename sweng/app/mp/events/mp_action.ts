"use server"

import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpProfileGetter } from "@/queries/profile_query";
import { serverSupa } from "@/db/supaserver";
import { executeLogEvent } from "@/app/event_records/event_action";

export async function completeScreening(queueId: bigint): Promise<ApiResponse> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const result = await controller.invokeUpdateQueueStation({
            id: queueId,
            station: 'lab_queue',
            staff_id: null,
        });

        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}

export async function failScreening(queueId: bigint, donorId: bigint, eventId: bigint): Promise<ApiResponse> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const result = await controller.invokeDeleteQueue({ id: queueId });
        if (result.success) {
            await executeLogEvent({
                event_log_id: eventId,
                donor_id: donorId,
                action: "deferral",
                time: new Date().toTimeString().slice(0, 8),
            });           
        }
        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
}
