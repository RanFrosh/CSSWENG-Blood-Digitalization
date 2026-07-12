"use server";

import { eq } from "drizzle-orm";

import { orm } from "@/db/drizzle";
import { event_log } from "@/db/models/event";
import { city } from "@/db/models/city";
import { province } from "@/db/models/province";

export type AssignedEvent = {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    partner: string;
    status: "Ongoing" | "Upcoming" | "Completed";
};

export async function getAssignedEvent(
    eventId: string
): Promise<AssignedEvent | null> {

    const result = await orm
        .select({
            id: event_log.id,
            name: event_log.name,
            street: event_log.street,
            zipCode: event_log.zip_code,
            city: city.name,
            province: province.name,
            eventDate: event_log.event_date,
            startTime: event_log.start_time,
            endTime: event_log.end_time,
            partner: event_log.partner,
            status: event_log.status,
        })
        .from(event_log)
        .leftJoin(city, eq(event_log.city_id, city.id))
        .leftJoin(province, eq(city.province_id, province.id))
        .where(eq(event_log.id, BigInt(eventId)));

    if (result.length === 0) {
        return null;
    }

    const event = result[0];

    return {
        id: event.id.toString(),

        name: event.name,

        location: `${event.street}, ${event.city}, ${event.province} ${event.zipCode}`,

        date: event.eventDate ?? "",

        time:
            event.startTime && event.endTime
                ? `${event.startTime} - ${event.endTime}`
                : "",

        partner: event.partner ?? "No Partner",

        status: event.status ?? "Upcoming",
    };
}