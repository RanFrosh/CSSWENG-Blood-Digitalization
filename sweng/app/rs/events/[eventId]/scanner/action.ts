"use server";

import { eq, and, sql } from "drizzle-orm";

import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";
import { event_log } from "@/db/schemas/event_log";
import { donor_to_event } from "@/db/schemas/donor_to_event";
import { executeLogEvent } from "@/actions/event_action";

export async function claimPerkAction(
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

        // Find donor's record for this event
        const donorEvent = await orm
            .select()
            .from(donor_to_event)
            .where(
                and(
                    eq(donor_to_event.donor_id, foundDonor[0].id),
                    eq(donor_to_event.event_id, BigInt(eventId))
                )
            )
            .limit(1);

        // Verify donor is registered for the event
        if (donorEvent.length === 0) {
            return {
                success: false,
                message: "Donor is not registered for this event.",
            };
        }

        // Verify donor successfully donated
        if (!donorEvent[0].is_success) {
            return {
                success: false,
                message: "Donor is not eligible to claim a perk.",
            };
        }

        // Prevent duplicate perk claims
        if (donorEvent[0].perk_claimed) {
            return {
                success: false,
                message: "This donor has already claimed their perk.",
            };
        }

        // Update donor_to_event and event_log atomically
        await orm.transaction(async (tx) => {
            await tx
                .update(donor_to_event)
                .set({
                    perk_claimed: true,
                    updated_at: new Date(),
                })
                .where(eq(donor_to_event.id, donorEvent[0].id));

            await tx
                .update(event_log)
                .set({
                    perk_claims: sql`${event_log.perk_claims} + 1`,
                })
                .where(eq(event_log.id, BigInt(eventId)));
        });

        await executeLogEvent({
            event_log_id: BigInt(eventId),
            donor_id: foundDonor[0].id,
            action: "perk_claim",
            time: new Date().toTimeString().slice(0, 8),
        });

        return {
            success: true,
            donor: foundDonor[0],
        };
    } catch (error) {
        console.error("CLAIM PERK ERROR:", error);

        return {
            success: false,
            message: "Internal server error.",
        };
    }
}