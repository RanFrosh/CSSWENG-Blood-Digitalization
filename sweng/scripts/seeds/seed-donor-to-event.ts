import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";
import { event_log } from "@/db/schemas/event_log";
import { donor_to_event } from "@/db/schemas/donor_to_event";
import { eq } from "drizzle-orm";

async function seedDonorToEvent() {
  console.log("Seeding Donor-to-Event...\n");

  try {
    // 1. Fetch our 10 newly minted donors and order them
    const allDonors = await orm.select({ id: donor.id }).from(donor).orderBy(donor.id);
    
    // Updated check: We only have 10 donors in the new roster
    if (allDonors.length < 10) {
      throw new Error(`❌ Found only ${allDonors.length} donors. Need at least 10! Please run master seed first.`);
    }

    // 2. Fetch our 3 specific target events
    const baguioEvent = await orm.select({ id: event_log.id }).from(event_log).where(eq(event_log.name, "Baguio Cordillera Drive")).limit(1);
    const pasigEvent = await orm.select({ id: event_log.id }).from(event_log).where(eq(event_log.name, "Pasig LGU Bloodletting")).limit(1);
    const manilaEvent = await orm.select({ id: event_log.id }).from(event_log).where(eq(event_log.name, "Lingkod Dugo sa Maynila")).limit(1);

    if (!baguioEvent[0] || !pasigEvent[0] || !manilaEvent[0]) {
      throw new Error("❌ Missing target events! Please run seed:events first.");
    }

    const recordsToInsert = [];

    for (let i = 0; i < 5; i++) {
      const isSuccess = i < 4; 
      recordsToInsert.push({
        donor_id: allDonors[i].id,
        event_id: baguioEvent[0].id,
        is_success: isSuccess,
        blood_amount: isSuccess ? 450 : null, // 450ml is standard bag size
        perk_claimed: isSuccess, 
      });
    }

    for (let i = 5; i < 10; i++) {
      recordsToInsert.push({
        donor_id: allDonors[i].id,
        event_id: pasigEvent[0].id,
        is_success: true, // All 5 succeeded
        blood_amount: 450,
        perk_claimed: true,
      });
    }

    for (let i = 0; i < 5; i++) {
      recordsToInsert.push({
        donor_id: allDonors[i].id,
        event_id: manilaEvent[0].id,
        is_success: false, // Haven't donated yet! They are just in the queue.
        blood_amount: null,
        perk_claimed: false,
      });
    }

    if (recordsToInsert.length > 0) {
        await orm.insert(donor_to_event).values(recordsToInsert);
    }

    console.log(`✅ Seeded 5 past records for Baguio (4 successful bags to generate)`);
    console.log(`✅ Seeded 5 past records for Pasig (5 successful bags to generate)`);
    console.log(`✅ Seeded 5 active queue records for Manila (0 bags to generate yet)`);
    console.log("\n✅ Donor-to-Event seeding complete.");
    process.exit(0);

  } catch (error: any) {
    console.error("💥 Failed to seed donor_to_event:", error.message);
    process.exit(1);
  }
}

seedDonorToEvent();