"use server"

import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { eq, inArray } from "drizzle-orm";
import { ViewDonor, ViewDonorPartial } from "@/types/donor_type";
import { ViewQueueFilters, ViewQueue, QueueEntryWithDonor } from "@/types/queue_type";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { serverSupa } from "@/db/supaserver";

export async function retrieveDonor(donor_info: bigint): Promise<ApiResponse<ViewDonor>> {
    try {
        if (!donor_info) return { success: false, message: "Donor id is missing" };

        const [result] = await orm
        .select()
        .from(donor)
        .where(eq(donor.id, donor_info))
        .limit(1);

        if (!result) return { success: false, message: "Donor not found" };

        return { success: true, message: "Donor retrieved", data: result };

    } catch (err: any) {
        return { success: false, message: err.message };
    }
}

export async function viewQueueWithDonors(event_info: bigint): Promise<ApiResponse<QueueEntryWithDonor[]>> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const queueResult = await controller.invokeQueryQueue({ event_log_id: event_info });

        if (!queueResult.success || !queueResult.data) return { success: queueResult.success, message: queueResult.message, data: undefined };

        if (queueResult.data.length === 0) return { success: true, message: queueResult.message, data: [] };
        
        const donor_ids = queueResult.data
        .map(entry => entry.donor_id)
        .filter((id): id is bigint => id !== null);

        const donors = donor_ids.length > 0
            ? await orm.select().from(donor).where(inArray(donor.id, donor_ids))
            : [];

        const donorMap = new Map(donors.map(d => [d.id, d]));

        const combined: QueueEntryWithDonor[] = queueResult.data.map(entry => ({
            ...entry,
            donor_profile: entry.donor_id ? donorMap.get(entry.donor_id) ?? null : null
        }));

        return { success: true, message: "Queue retrieved", data: combined };

    } catch (err: any) {
        return { success: false, message: err.message }
    }
}