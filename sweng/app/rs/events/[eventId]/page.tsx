import { getAssignedEvent } from "@/app/actions/event";
import RSEventClient from "./client";

export default async function Page({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;

    const event = await getAssignedEvent(eventId);

    return (
        <RSEventClient
            event={event}
            eventId={eventId}
        />
    );
}