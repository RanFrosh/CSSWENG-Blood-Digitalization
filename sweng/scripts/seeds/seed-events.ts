import { orm } from "@/db/drizzle";
import { event_log } from "@/db/models/event_log";
import { eq } from "drizzle-orm";

const events = [
  {
    name: "Lingkod Dugo sa Maynila",
    partner: "Red Cross",
    event_date: "2026-08-03",
    start_time: "08:00:00",
    status: "Ongoing" as const,
    city_id: BigInt(6),
    zip_code: "1000",
    street: "Padre Faura St.",
    target_blood: BigInt(100),
    visitors: BigInt(0),
    extractions: BigInt(0),
    produced_bags: BigInt(0),
    perk_claims: BigInt(0),
  },
  {
    name: "RedBank Cebu Blood Drive",
    partner: "RedBank",
    event_date: "2026-02-10", 
    start_time: "09:00:00",
    status: "Completed" as const,
    city_id: BigInt(107),
    zip_code: "6000",
    street: "Osmeña Blvd.",
    target_blood: BigInt(15),
    visitors: BigInt(12),
    extractions: BigInt(10),
    produced_bags: BigInt(9),
    perk_claims: BigInt(9),
  },
  {
    name: "Davao Gives Life",
    partner: "City Health",
    event_date: "2026-03-05", 
    start_time: "07:30:00",
    status: "Completed" as const,
    city_id: BigInt(136),
    zip_code: "8000",
    street: "JP Laurel Ave.",
    target_blood: BigInt(10),
    visitors: BigInt(8),
    extractions: BigInt(7),
    produced_bags: BigInt(7),
    perk_claims: BigInt(7),
  },
  {
    name: "QC Community Blood Drive",
    partner: "Community Partners",
    event_date: "2026-08-20", 
    start_time: "10:00:00",
    status: "Upcoming" as const,
    city_id: BigInt(13),
    zip_code: "1100",
    street: "Elliptical Rd.",
    target_blood: BigInt(25),
    visitors: BigInt(0),
    extractions: BigInt(0),
    produced_bags: BigInt(0),
    perk_claims: BigInt(0),
  },
  {
    name: "Makati Corporate Heroes",
    partner: "Makati Medical Center",
    event_date: "2026-09-01", 
    start_time: "09:00:00",
    status: "Upcoming" as const,
    city_id: BigInt(63),
    zip_code: "1226",
    street: "Ayala Avenue",
    target_blood: BigInt(30),
    visitors: BigInt(0),
    extractions: BigInt(0),
    produced_bags: BigInt(0),
    perk_claims: BigInt(0),
  }
];

async function seedEvents() {

    console.log("Seeding mock events... \n");

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