import { getAssignedEvent } from "@/app/actions/event";
import OAEventClient from "./client";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";

export default async function Page({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;

    const event = await getAssignedEvent(eventId);

    return (
        <OAEventClient
            event={event}
            eventId={eventId}
        />
    );
}