import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";

import { event_log } from "@/db/models/event_log";
import { profiles } from "@/db/models/profiles";
import { assigned_staff } from "@/db/models/assigned_staff";

import OAEventsClient, { AssignedEvent, StaffProfile } from "./client";

export default async function OAEventsPage() {
    // 1. Authenticate
    const supabase = await serverSupa();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/landing");
    }

    const currentProfileId = user.id;

    // 2. Fetch Staff Details
    const staffFromDb = await orm
        .select()
        .from(profiles)
        .where(eq(profiles.id, currentProfileId))
        .limit(1);

    const staff: StaffProfile | null = staffFromDb[0]
        ? {
            id: staffFromDb[0].id,
            name: staffFromDb[0].name,
            role: staffFromDb[0].role,
          }
        : null;

    // 3. Fetch Assigned Events
    const eventsFromDb = await orm
        .select()
        .from(assigned_staff)
        .innerJoin(event_log, eq(assigned_staff.event_log_id, event_log.id))
        .where(eq(assigned_staff.staff_id, currentProfileId));

    // 4. Map to Client Props
    const assignedEvents: AssignedEvent[] = eventsFromDb.map((row) => ({
        id: row.event_log.id.toString(),
        name: row.event_log.name,
        location: `${row.event_log.street}, ${row.event_log.zip_code}`,
        date: row.event_log.event_date ?? "No date",
        time: `${row.event_log.start_time} - ${row.event_log.end_time ?? ""}`,
        partner: row.event_log.partner,
        // Safety cast for strict client types
        status: row.event_log.status as "Ongoing" | "Upcoming" | "Completed",
    }));

    // 5. Render Client Component
    return <OAEventsClient assignedEvents={assignedEvents} staff={staff} />;
}