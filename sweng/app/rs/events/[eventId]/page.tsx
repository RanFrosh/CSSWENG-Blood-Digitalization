import { verifyEventAccess } from "@/actions/event_action";
import RSEventClient from "./client";

export default async function Page({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;

    const result = await verifyEventAccess(BigInt(eventId));

    const event = result.success && result.data ? result.data : null;

    return (
        <RSEventClient
            event={event}
            eventId={eventId}
        />
    );
}
