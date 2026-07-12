import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { event_log } from "@/db/models/event-log";

export async function POST(req: NextRequest) {
    try {
        const { eventId, qrToken } = await req.json();

        if (!eventId || !qrToken) {
            return NextResponse.json(
                { message: "Missing eventId or qrToken." },
                { status: 400 }
            );
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
            return NextResponse.json(
                { message: "Invalid QR code." },
                { status: 404 }
            );
        }

        // Increment perk_claims
        await orm
            .update(event_log)
            .set({
                perk_claims: sql`${event_log.perk_claims} + 1`,
            })
            .where(eq(event_log.id, BigInt(eventId)));

        return NextResponse.json({
            success: true,
            donor: foundDonor[0],
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}