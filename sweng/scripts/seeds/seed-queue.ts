import { orm } from "@/db/drizzle";
import { event_queue } from "@/db/schemas/event_queue"; 
import { event_log } from "@/db/schemas/event_log";
import { donor_to_event } from "@/db/schemas/donor_to_event";
import { eq, and } from "drizzle-orm";

// 1. Lock the staff IDs to their specific stations
const STAFF_MED = "867e1755-145f-4161-8fda-6f210689eaea";
const STAFF_LABS = [
  "8df2859b-d4d5-4a9a-a903-4b37769a4651",
  "744134c8-dbf7-4bfd-99bf-09bebfea97da"
];

async function seedEventQueue() {
  console.log("🚶 Seeding live donors into assigned stations...\n");

  try {
    const activeEvent = await orm
      .select({ id: event_log.id })
      .from(event_log)
      .where(eq(event_log.name, "Lingkod Dugo sa Maynila"))
      .limit(1);

    if (!activeEvent[0]) {
      throw new Error("❌ Active event not found!");
    }
    const eventId = activeEvent[0].id;

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
      throw new Error("❌ No donors found waiting for this event! Run seed:queue first.");
    }

    console.log(`Found ${queuedDonors.length} donors waiting for the Manila event.`);

    let labCounter = 0; // Keeps track so the two lab staff take turns

    for (let i = 0; i < queuedDonors.length; i++) {
      const donorId = queuedDonors[i].donor_id;
      
      // 2. Distribute donors: Even numbers to Med, Odd numbers to Lab
      const isLab = i % 2 !== 0; 
      const station = isLab ? "lab_queue" : "med_queue";
      
      // 3. Assign the correct staff
      let assignedStaff;
      if (isLab) {
        // Alternate between the two lab techs
        assignedStaff = STAFF_LABS[labCounter % STAFF_LABS.length];
        labCounter++;
      } else {
        // Only one med tech
        assignedStaff = STAFF_MED;
      }

      await orm.insert(event_queue).values({
        event_log_id: eventId,
        donor_id: donorId,
        station: station as any, 
        staff_id: assignedStaff,
      });

      console.log(`✅ Placed Donor ID ${donorId} at [${station}] handled by Staff ${assignedStaff.split('-')[0]}`);
    }

    console.log("\n✅ Live event queue seeding complete.");
    process.exit(0);

  } catch (error: any) {
    console.error("💥 Failed to seed event queue:", error.message);
    process.exit(1);
  }
}

seedEventQueue();