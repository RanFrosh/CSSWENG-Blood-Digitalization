import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";

import { event_log } from "@/db/models/event-log";
import { profiles } from "@/db/models/profiles";
import { assigned_staff } from "@/db/models/assigned-staff";

import OAEventsClient, { AssignedEvent, StaffDetails } from "./client";

export default async function OAEventsPage() {
  const supabase = await serverSupa();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentProfileId = user.id;

  const staffFromDb = await orm
    .select()
    .from(profiles)
    .where(eq(profiles.id, currentProfileId))
    .limit(1);

  const staff: StaffDetails | null = staffFromDb[0]
    ? {
        id: staffFromDb[0].id,
        name: staffFromDb[0].name,
        role: staffFromDb[0].role,
      }
    : null;

  const eventsFromDb = await orm
    .select()
    .from(assigned_staff)
    .innerJoin(event_log, eq(assigned_staff.event_log_id, event_log.id))
    .where(eq(assigned_staff.profiles_id, currentProfileId));

  const assignedEvents: AssignedEvent[] = eventsFromDb.map((row) => ({
    id: row.event_log.id.toString(),
    name: row.event_log.name,
    location: `${row.event_log.street}, ${row.event_log.zip_code}`,
    date: row.event_log.event_date ?? "No date",
    time: `${row.event_log.start_time} - ${row.event_log.end_time ?? ""}`,
    partner: row.event_log.partner,
    status: row.event_log.status,
  }));

  return <OAEventsClient assignedEvents={assignedEvents} staff={staff} />;
}
