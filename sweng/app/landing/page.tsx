import LandingClient, { LandingEvent } from "./client";
import { fetchLandingEventsAction } from "../event_records/event_action";

export default async function Home() {
    
    const response = await fetchLandingEventsAction();
    
    const dbEvents: LandingEvent[] = response.success && response.data ? response.data : [];

    return <LandingClient initialEvents={dbEvents} />;
}