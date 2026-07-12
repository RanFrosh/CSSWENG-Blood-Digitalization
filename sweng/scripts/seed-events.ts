// scripts/seed-events-drizzle.ts
import { orm } from "@/db/drizzle";
import { event_log } from "@/db/models/event";
import { eq } from "drizzle-orm";

const events = [
  {
    name: "Lingkod Dugo sa Maynila",
    city_id: BigInt(6),
    zip_code: "1000",
    street: "Padre Faura St.",
    target_blood: BigInt(100),
    visitors: BigInt(134),
    extractions: BigInt(110),
    produced_bags: BigInt(98),
    perk_claims: BigInt(98),
  },
  {
    name: "RedBank Cebu Blood Drive",
    city_id: BigInt(107),
    zip_code: "6000",
    street: "Osmeña Blvd.",
    target_blood: BigInt(80),
    visitors: BigInt(95),
    extractions: BigInt(78),
    produced_bags: BigInt(70),
    perk_claims: BigInt(70),
  },
  {
    name: "Davao Gives Life",
    city_id: BigInt(136),
    zip_code: "8000",
    street: "JP Laurel Ave.",
    target_blood: BigInt(120),
    visitors: BigInt(140),
    extractions: BigInt(115),
    produced_bags: BigInt(100),
    perk_claims: BigInt(100),
  },
  {
    name: "QC Community Blood Drive",
    city_id: BigInt(13),
    zip_code: "1100",
    street: "Elliptical Rd.",
    target_blood: BigInt(150),
    visitors: BigInt(0),
    extractions: BigInt(0),
    produced_bags: BigInt(0),
    perk_claims: BigInt(0),
  },
];

async function seedEvents() {
  console.log("🌱 Seeding mock events (Drizzle)...\n");

  for (const event of events) {
    try {
      const existing = await orm
        .select()
        .from(event_log)
        .where(eq(event_log.name, event.name))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⚠️  Skipped (already exists): ${event.name}`);
        continue;
      }

      await orm.insert(event_log).values(event);
      console.log(`✅ Created: ${event.name}`);
    } catch (err: any) {
      console.error(`❌ Failed to create: ${event.name}`, err.message);
    }
  }

  console.log("\n✅ Seeding complete.");
  process.exit(0);
}

seedEvents();