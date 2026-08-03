import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { event_log } from "@/db/models/event_log";
import { donor_to_event } from "@/db/models/donor_to_event";
import { eq } from "drizzle-orm";

async function seedDonorToEvent() {
  console.log("📋 Seeding Donor-to-Event (Queue & History)...\n");

  try {
    // 1. Fetch all our 15 donors and order them so we can consistently slice them
    const allDonors = await orm.select({ id: donor.id }).from(donor).orderBy(donor.id);
    if (allDonors.length < 15) {
      throw new Error("❌ Not enough donors found! Please run seed:donors first.");
    }

    // 2. Fetch our 3 specific target events
    const baguioEvent = await orm.select({ id: event_log.id }).from(event_log).where(eq(event_log.name, "Baguio Cordillera Drive")).limit(1);
    const pasigEvent = await orm.select({ id: event_log.id }).from(event_log).where(eq(event_log.name, "Pasig LGU Bloodletting")).limit(1);
    const manilaEvent = await orm.select({ id: event_log.id }).from(event_log).where(eq(event_log.name, "Lingkod Dugo sa Maynila")).limit(1);

    if (!baguioEvent[0] || !pasigEvent[0] || !manilaEvent[0]) {
      throw new Error("❌ Missing target events! Please run seed:events first.");
    }

    const recordsToInsert = [];

    // --- PAST EVENT 1: Baguio (Jan 20, 2026) ---
    // Donors 0 to 9 attended.
    for (let i = 0; i < 10; i++) {
      const isSuccess = i < 9; // 9 succeeded, 1 rejected
      recordsToInsert.push({
        donor_id: allDonors[i].id,
        event_id: baguioEvent[0].id,
        is_success: isSuccess,
        blood_amount: isSuccess ? 450 : null, // 450ml is standard bag size
        perk_claimed: isSuccess, // Usually only successful donors get the good perks
      });
    }

    // --- PAST EVENT 2: Pasig (June 15, 2026) ---
    // Donors 10 to 14 attended.
    for (let i = 10; i < 15; i++) {
      recordsToInsert.push({
        donor_id: allDonors[i].id,
        event_id: pasigEvent[0].id,
        is_success: true, // All 5 succeeded
        blood_amount: 450,
        perk_claimed: true,
      });
    }

    // --- ACTIVE QUEUE: Manila (Aug 3, 2026) ---
    // Donors 0 to 4 (who donated way back in Jan and are eligible) are in the waiting room today!
    for (let i = 0; i < 5; i++) {
      recordsToInsert.push({
        donor_id: allDonors[i].id,
        event_id: manilaEvent[0].id,
        is_success: false, // Haven't donated yet! They are just in the queue.
        blood_amount: null,
        perk_claimed: false,
      });
    }

    // 3. Insert everything
    for (const record of recordsToInsert) {
      await orm.insert(donor_to_event).values(record);
    }

    console.log(`✅ Seeded 10 past records for Baguio (9 successful bags to generate)`);
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