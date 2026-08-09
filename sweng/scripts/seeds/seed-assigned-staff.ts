import { orm } from "@/db/drizzle";
import { assigned_staff } from "@/db/schemas/assigned_staff"; 
import { event_log } from "@/db/schemas/event_log";
import { inArray } from "drizzle-orm";

const STAFF_IDS = [
  "867e1755-145f-4161-8fda-6f210689eaea", // Med Tech
  "8df2859b-d4d5-4a9a-a903-4b37769a4651", // Lab Tech 1
  "744134c8-dbf7-4bfd-99bf-09bebfea97da"  // Lab Tech 2
];

async function seedAssignedStaff() {
  console.log("📋 Assigning staff to events...\n");

  try {
    // Grab the 3 events we actually have data for
    const targetEvents = await orm
      .select({ id: event_log.id, name: event_log.name })
      .from(event_log)
      .where(inArray(event_log.name, [
        "Lingkod Dugo sa Maynila", 
        "Pasig LGU Bloodletting", 
        "Baguio Cordillera Drive"
      ]));

    if (targetEvents.length === 0) {
      throw new Error("❌ Target events not found! Run seed:events first.");
    }

    const assignmentsToInsert = [];

    for (const event of targetEvents) {
      if (event.name === "Lingkod Dugo sa Maynila") {
        // Today's event gets all 3 staff members
        STAFF_IDS.forEach(staffId => {
          assignmentsToInsert.push({ event_log_id: event.id, staff_id: staffId });
        });
      } else {
        // Past events just get 2 staff members assigned randomly
        assignmentsToInsert.push({ event_log_id: event.id, staff_id: STAFF_IDS[0] });
        assignmentsToInsert.push({ event_log_id: event.id, staff_id: STAFF_IDS[1] });
      }
    }

    // Insert them all
    for (const record of assignmentsToInsert) {
      await orm.insert(assigned_staff).values(record);
    }

    console.log(`✅ Assigned 3 staff to Manila`);
    console.log(`✅ Assigned 2 staff to Pasig`);
    console.log(`✅ Assigned 2 staff to Baguio`);
    console.log("\n✅ Staff assignment seeding complete.");
    process.exit(0);

  } catch (error: any) {
    console.error("💥 Failed to seed assigned staff:", error.message);
    process.exit(1);
  }
}

seedAssignedStaff();