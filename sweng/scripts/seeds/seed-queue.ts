import { orm } from "@/db/drizzle";
import { event_queue } from "@/db/schemas/event_queue"; 
import { event_log } from "@/db/schemas/event_log";
import { donor_to_event } from "@/db/schemas/donor_to_event";
import { profiles } from "@/db/schemas/profiles";
import { eq, and } from "drizzle-orm";

async function seedEventQueue() {
    console.log("Seeding live donors into assigned stations...");

    try {
        // Fetch one Medical Professional dynamically
        const medStaffData = await orm
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.role, "med_prof"))
            .limit(1);

        // Fetch one Lab Staff dynamically
        const labStaffData = await orm
            .select({ id: profiles.id })
            .from(profiles)
            .where(eq(profiles.role, "lab_staff"))
            .limit(1);

        if (!medStaffData[0] || !labStaffData[0]) {
            throw new Error("Required staff not found. Run the profiles seed first.");
        }

        const medStaffId = medStaffData[0].id;
        const labStaffId = labStaffData[0].id;

        // Fetch the active event
        const activeEvent = await orm
            .select({ id: event_log.id })
            .from(event_log)
            .where(eq(event_log.name, "Lingkod Dugo sa Maynila"))
            .limit(1);

        if (!activeEvent[0]) {
            throw new Error("Active event not found. Run the events seed first.");
        }
        const eventId = activeEvent[0].id;

        // Fetch pending donors
        const queuedDonors = await orm
            .select({ donor_id: donor_to_event.donor_id })
            .from(donor_to_event)
            .where(
                and(
                    eq(donor_to_event.event_id, eventId),
                    eq(donor_to_event.is_success, false)
                )
            );

        if (queuedDonors.length === 0) {
            throw new Error("No donors found waiting for this event. Run the queue seed first.");
        }

        console.log(`Found ${queuedDonors.length} donors waiting for the Manila event.`);

        const queueToInsert = [];
        let isMedAssigned = false;
        let isLabAssigned = false;

        for (let i = 0; i < queuedDonors.length; i++) {
            const donorId = queuedDonors[i].donor_id;
            
            // Distribute donors: Even indices to Med Queue, Odd indices to Lab Queue
            const isLab = i % 2 !== 0; 
            const station = isLab ? "lab_queue" : "med_queue";
            
            // Assign staff only to the first person in each queue
            let assignedStaff = null;
            if (isLab && !isLabAssigned) {
                assignedStaff = labStaffId;
                isLabAssigned = true;
            } else if (!isLab && !isMedAssigned) {
                assignedStaff = medStaffId;
                isMedAssigned = true;
            }

            queueToInsert.push({
                event_log_id: eventId,
                donor_id: donorId,
                station: station as any, 
                staff_id: assignedStaff,
            });
        }

        if (queueToInsert.length > 0) {
            await orm
                .insert(event_queue)
                .values(queueToInsert)
                .onConflictDoNothing();
        }

        console.log(`Placed 1 donor at [med_queue] handled by Staff ${medStaffId.split('-')[0]}`);
        console.log(`Placed 1 donor at [lab_queue] handled by Staff ${labStaffId.split('-')[0]}`);
        console.log(`Placed ${queueToInsert.length - 2} remaining donors in queues without assigned staff.`);
        console.log("Live event queue seeding complete.");
        process.exit(0);

    } catch (error: any) {
        console.error("Failed to seed event queue:", error.message);
        process.exit(1);
    }
}

seedEventQueue();