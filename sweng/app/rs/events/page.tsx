import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";

import { event_log } from "@/db/models/event_log";
import { assigned_staff } from "@/db/models/assigned_staff";

import RSClient, { AssignedEvent } from "./client";

export default async function RSEventsPage() {
    // 1. Authenticate the User
    const supabase = await serverSupa();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/landing");
    }

    // 2. Fetch Assigned Events from Drizzle
    const eventsFromDb = await orm
        .select()
        .from(assigned_staff)
        .innerJoin(event_log, eq(assigned_staff.event_log_id, event_log.id))
        .where(eq(assigned_staff.staff_id, user.id));

    // 3. Map Database Types to Client Props
    const assignedEvents: AssignedEvent[] = eventsFromDb.map((row) => ({
        id: row.event_log.id.toString(),
        name: row.event_log.name,
        location: `${row.event_log.street}, ${row.event_log.zip_code}`,
        date: row.event_log.event_date ?? "No date",
        time: `${row.event_log.start_time} - ${row.event_log.end_time ?? ""}`,
        partner: row.event_log.partner,
        // Cast the status to match the strict type in your Client component
        status: row.event_log.status as "Ongoing" | "Upcoming" | "Completed",
    }));

    // 4. Pass the data to the Client Component
    return <RSClient assignedEvents={assignedEvents} />;
}