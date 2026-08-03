import { orm } from "@/db/drizzle";
import { corrected_event } from "@/db/models/corrected_event";
import { eq, and } from "drizzle-orm";

const corrections = [
  {
    ref_event_id: BigInt(1),
    ref_profile_id: "736f8ede-d61a-4eea-85cb-6a2a2defd6b8",
    street: "Taft Ave.",
    created_at: new Date("2025-02-15T09:00:00+08:00"),
  },
  {
    ref_event_id: BigInt(2),
    ref_profile_id: "867e1755-145f-4161-8fda-6f210689eaea",
    zip_code: "6001",
    visitors: BigInt(100),
    extractions: BigInt(82),
    produced_bags: BigInt(75),
    perk_claims: BigInt(75),
    created_at: new Date("2025-03-09T10:30:00+08:00"),
  },
  {
    ref_event_id: BigInt(3),
    ref_profile_id: "69f68e05-71bb-4e95-88b0-d6bbc011d6f3",
    visitors: BigInt(145),
    extractions: BigInt(118),
    produced_bags: BigInt(105),
    perk_claims: BigInt(105),
    target_blood: BigInt(130),
    created_at: new Date("2025-04-06T08:00:00+08:00"),
  },
];

async function seedCorrections() {
  console.log("🌱 Seeding mock corrections (Drizzle)...\n");

  for (const correction of corrections) {
    try {
      const existing = await orm
        .select()
        .from(corrected_event)
        .where(
          and(
            eq(corrected_event.ref_event_id, correction.ref_event_id),
            eq(corrected_event.ref_profile_id, correction.ref_profile_id)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        console.log(`⚠️  Skipped (already exists): event_id ${correction.ref_event_id} by profile ${correction.ref_profile_id}`);
        continue;
      }

      await orm.insert(corrected_event).values(correction);
      console.log(`✅ Created correction for event_id: ${correction.ref_event_id}`);
    } catch (err: any) {
      console.error(`❌ Failed to create correction for event_id: ${correction.ref_event_id}`, err.message);
    }
  }

  console.log("\n✅ Seeding complete.");
  process.exit(0);
}

seedCorrections();