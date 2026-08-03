import { orm } from "@/db/drizzle";
import { blood_bag } from "@/db/models/blood_bag"; 
import { donor_to_event } from "@/db/models/donor_to_event";
import { donor } from "@/db/models/donor";
import { event_log } from "@/db/models/event_log";
import { eq } from "drizzle-orm";

const STAFF_IDS = [
  "8df2859b-d4d5-4a9a-a903-4b37769a4651", // Lab Staff
  "744134c8-dbf7-4bfd-99bf-09bebfea97da" // Kylie
];

async function seedBloodBags() {
  console.log("🩸 Generating physical blood bags...\n");

  try {
    const successfulExtractions = await orm
      .select({
        donor_id: donor.id,
        event_id: event_log.id,
        blood_type: donor.blood,
        collection_date: event_log.event_date,
        volume_ml: donor_to_event.blood_amount,
      })
      .from(donor_to_event)
      .innerJoin(donor, eq(donor_to_event.donor_id, donor.id))
      .innerJoin(event_log, eq(donor_to_event.event_id, event_log.id))
      .where(eq(donor_to_event.is_success, true));

    if (successfulExtractions.length === 0) {
      throw new Error("❌ No successful extractions found! Run seed:queue first.");
    }

    console.log(`Found ${successfulExtractions.length} successful donations to process.`);

    for (let i = 0; i < successfulExtractions.length; i++) {
      const record = successfulExtractions[i];
      const isPerfectBag = i < 13; 
      
      // Alternate staff members for each bag
      const assignedStaffId = STAFF_IDS[i % STAFF_IDS.length];

      const [insertedBag] = await orm.insert(blood_bag).values({
        serial_number: `TEMP-${Date.now()}-${i}`,
        donor_id: record.donor_id,
        event_id: record.event_id,
        staff_id: assignedStaffId, // 💥 Added the assigned staff ID!
        blood_type: record.blood_type,
        volume_ml: record.volume_ml ?? 450,
        collection_date: record.collection_date,
        outcome: isPerfectBag ? "Successful" : "Incomplete", 
        quality: isPerfectBag ? "Pass" : "Fail",             
        observations: isPerfectBag ? "Standard extraction." : "Failed lipid panel. Discarded.",
      }).returning({ id: blood_bag.id });

      const collectionYear = record.collection_date.split("-")[0]; 
      const finalSerialNumber = `BAG-${collectionYear}-${insertedBag.id}`;

      await orm
        .update(blood_bag)
        .set({ serial_number: finalSerialNumber })
        .where(eq(blood_bag.id, insertedBag.id));

      console.log(`✅ Generated Bag: ${finalSerialNumber} | Type: ${record.blood_type} | Quality: ${isPerfectBag ? "Pass" : "Fail"}`);
    }

    console.log(`\n✅ Generated ${successfulExtractions.length} blood bags successfully.`);
    process.exit(0);

  } catch (error: any) {
    console.error("💥 Failed to seed blood bags:", error.message);
    process.exit(1);
  }
}

seedBloodBags();