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

export async function retrieveDonor(donor_info: ViewDonorPartial): Promise<ApiResponse<ViewDonor>> {
    try {
        if (!donor_info.id) return { success: false, message: "Donor id is missing" };

        const [result] = await orm
        .select()
        .from(donor)
        .where(eq(donor.id, donor_info.id))
        .limit(1);

        if (!result) return { success: false, message: "Donor not found" };

        return { success: true, message: "Donor retrieved", data: result };

    } catch (err: any) {
        return { success: false, message: err.message };
    }
}