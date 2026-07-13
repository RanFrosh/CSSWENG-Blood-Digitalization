"use server";

import { eq, sql } from "drizzle-orm";

import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { event_log } from "@/db/models/event-log";

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

        // Increment visitors
        await orm
            .update(event_log)
            .set({
                visitors: sql`${event_log.visitors} + 1`,
            })
            .where(eq(event_log.id, BigInt(eventId)));

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