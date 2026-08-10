import { orm } from "@/db/drizzle";
import { assigned_staff } from "@/db/schemas/assigned_staff"; 
import { event_log } from "@/db/schemas/event_log";
import { profiles } from "@/db/schemas/profiles";
import { inArray, eq, or } from "drizzle-orm";

async function seedAssignedStaff() {
    console.log("Starting staff assignment seed...");

    try {

        const availableStaff = await orm
            .select({ id: profiles.id })
            .from(profiles)
            .where(
                or(
                    eq(profiles.role, "lab_staff"),
                    eq(profiles.role, "med_prof")
                )
            )
            .limit(3);

        if (availableStaff.length < 3) {
            throw new Error("Insufficient staff records found. Run the profiles seed first.");
        }

        const staffIds = availableStaff.map(s => s.id);

        const targetEvents = await orm
            .select({ id: event_log.id, name: event_log.name })
            .from(event_log)
            .where(inArray(event_log.name, [
                "Lingkod Dugo sa Maynila", 
                "Pasig LGU Bloodletting", 
                "Baguio Cordillera Drive"
            ]));

        if (targetEvents.length === 0) {
            throw new Error("Target events not found. Run the events seed first.");
        }

        const assignmentsToInsert = [];

        for (const event of targetEvents) {
            if (event.name === "Lingkod Dugo sa Maynila") {
                staffIds.forEach(staffId => {
                    assignmentsToInsert.push({ event_log_id: event.id, staff_id: staffId });
                });
            } else {
                assignmentsToInsert.push({ event_log_id: event.id, staff_id: staffIds[0] });
                assignmentsToInsert.push({ event_log_id: event.id, staff_id: staffIds[1] });
            }
        }

        if (assignmentsToInsert.length > 0) {
            await orm
                .insert(assigned_staff)
                .values(assignmentsToInsert)
                .onConflictDoNothing();
        }

        console.log("Assigned 3 staff to Manila.");
        console.log("Assigned 2 staff to Pasig.");
        console.log("Assigned 2 staff to Baguio.");
        console.log("Staff assignment seeding complete.");
        process.exit(0);

    } catch (error: any) {
        console.error("Failed to seed assigned staff:", error.message);
        process.exit(1);
    }
}

seedAssignedStaff();