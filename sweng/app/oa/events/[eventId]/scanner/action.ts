"use server";

import { eq, and, sql } from "drizzle-orm";

import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { event_log } from "@/db/models/event_log";
import { donor_to_event } from "@/db/models/donor_to_event";

import { serverSupa } from "@/db/supaserver";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";

export async function checkInDonorAction(
    eventId: string,
    qrToken: string
) {
    try {
        if (!eventId || !qrToken) {
            return {
                success: false,
                message: "Missing eventId or qrToken.",
            };
        }

        // Verify donor exists
        const foundDonor = await orm
            .select({
                id: donor.id,
                first_name: donor.first_name,
                last_name: donor.last_name,
            })
            .from(donor)
            .where(eq(donor.qr_token, qrToken))
            .limit(1);

        if (foundDonor.length === 0) {
            return {
                success: false,
                message: "Invalid QR code.",
            };
        }

        // Check if donor has already successfully donated for this event
        const donorEvent = await orm
            .select({
                is_success: donor_to_event.is_success,
            })
            .from(donor_to_event)
            .where(
                and(
                    eq(donor_to_event.donor_id, foundDonor[0].id),
                    eq(donor_to_event.event_id, BigInt(eventId))
                )
            )
            .limit(1);

        // Reject re-entry if donation is already completed
        if (
            donorEvent.length > 0 &&
            donorEvent[0].is_success
        ) {
            return {
                success: false,
                message:
                    "This donor has already completed their donation for this event and cannot re-enter the queue.",
            };
        }

        // Increment visitors
        await orm
            .update(event_log)
            .set({
                visitors: sql`${event_log.visitors} + 1`,
            })
            .where(eq(event_log.id, BigInt(eventId)));

        // Add donor to queue
        const database = await serverSupa();

        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);

        const queueResult = await controller.invokeAddToQueue({
            donor_id: foundDonor[0].id,
            event_log_id: BigInt(eventId),
            profile_id: null,
        });

        if (!queueResult.success) {
            return {
                success: false,
                message: queueResult.message,
            };
        }

        return {
            success: true,
            donor: foundDonor[0],
        };
    } catch (error) {
        console.error("OA CHECK-IN ERROR:", error);

        return {
            success: false,
            message: "Internal server error.",
        };
    }
}