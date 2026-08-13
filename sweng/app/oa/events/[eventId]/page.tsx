import { verifyEventAccess } from "@/app/event_records/event_action";
import OAEventClient from "./client";

export default async function Page({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;

    const result = await verifyEventAccess(BigInt(eventId));

    const event = result.success && result.data ? result.data : null;

    return (
        <OAEventClient
            event={event}
            eventId={eventId}
        />
    );
}
