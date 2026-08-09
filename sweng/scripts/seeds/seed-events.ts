import { orm } from "@/db/drizzle";
import { event_log } from "@/db/schemas/event_log";
import { eq } from "drizzle-orm";

const events = [
  {
    name: "Lingkod Dugo sa Maynila",
    partner: "Red Cross",
    event_date: "2026-08-03", // Today (Ongoing)
    start_time: "08:00:00",
    end_time: "14:30:00",
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
    end_time: "17:00:00",
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
    end_time: "12:30:00",
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
    end_time: "19:00:00",
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
    end_time: "17:00:00",
    status: "Upcoming" as const,
    city_id: BigInt(63),
    zip_code: "1226",
    street: "Ayala Avenue",
    target_blood: BigInt(30),
    visitors: BigInt(0),
    extractions: BigInt(0),
    produced_bags: BigInt(0),
    perk_claims: BigInt(0),
  },
  {
    name: "Pasig LGU Bloodletting",
    partner: "Pasig City Health Office",
    event_date: "2026-06-15",
    start_time: "08:00:00",
    end_time: "16:00:00",
    status: "Completed" as const,
    city_id: BigInt(16), 
    zip_code: "1600",
    street: "Caruncho Ave",
    target_blood: BigInt(40),
    visitors: BigInt(14),
    extractions: BigInt(12),
    produced_bags: BigInt(11),
    perk_claims: BigInt(10),
  },
  {
    name: "BGC Corporate Drive",
    partner: "St. Luke's Medical Center",
    event_date: "2026-07-22",
    start_time: "10:00:00",
    end_time: "18:00:00",
    status: "Completed" as const,
    city_id: BigInt(64), 
    zip_code: "1634",
    street: "32nd Street",
    target_blood: BigInt(50),
    visitors: BigInt(15),
    extractions: BigInt(14),
    produced_bags: BigInt(13),
    perk_claims: BigInt(13),
  },
  {
    name: "Iloilo Life Savers",
    partner: "Western Visayas Medical Center",
    event_date: "2026-09-15",
    start_time: "07:00:00",
    end_time: "15:00:00",
    status: "Upcoming" as const,
    city_id: BigInt(122), 
    zip_code: "5000",
    street: "Q. Abeto St.",
    target_blood: BigInt(35),
    visitors: BigInt(0),
    extractions: BigInt(0),
    produced_bags: BigInt(0),
    perk_claims: BigInt(0),
  },
  {
    name: "Baguio Cordillera Drive",
    partner: "Baguio General Hospital",
    event_date: "2026-01-20",
    start_time: "08:30:00",
    end_time: "14:00:00",
    status: "Completed" as const,
    city_id: BigInt(72), 
    zip_code: "2600",
    street: "Gov. Pack Road",
    target_blood: BigInt(20),
    visitors: BigInt(11),
    extractions: BigInt(9),
    produced_bags: BigInt(8),
    perk_claims: BigInt(7),
  },
  {
    name: "Alabang Community Drive",
    partner: "Asian Hospital",
    event_date: "2026-10-05",
    start_time: "09:00:00",
    end_time: "16:00:00",
    status: "Upcoming" as const,
    city_id: BigInt(65), 
    zip_code: "1781",
    street: "Civic Drive",
    target_blood: BigInt(25),
    visitors: BigInt(0),
    extractions: BigInt(0),
    produced_bags: BigInt(0),
    perk_claims: BigInt(0),
  },
  {
    name: "Taft University Blood Drive",
    partner: "DLSU Red Cross Youth",
    event_date: "2026-11-12",
    start_time: "09:00:00",
    end_time: "17:00:00",
    status: "Upcoming" as const,
    city_id: BigInt(6), 
    zip_code: "1004",
    street: "Taft Avenue",
    target_blood: BigInt(60),
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