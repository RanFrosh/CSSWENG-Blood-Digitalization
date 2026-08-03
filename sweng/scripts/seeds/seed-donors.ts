import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { city } from "@/db/models/city";
import { eq } from "drizzle-orm";

async function seedDonors() {

  console.log("🩸 Seeding mock donors...\n");

  try {

    const cityResult = await orm.select({ id: city.id }).from(city).limit(1);
    
    if (cityResult.length === 0) {
      throw new Error("❌ No cities found! Please insert at least one city first.");
    }

    const defaultCityId = cityResult[0].id;

    const donors = [
      // --- Original 5 Donors ---
      {
        first_name: "Juan", last_name: "Dela Cruz", email: "juan.delacruz@example.com", mobile_no: "09171234567",
        sex: "Male" as any, blood: "O+" as any, birthdate: "1995-05-15", age: 31, city_id: defaultCityId,
        zip_code: "1000", height: 170.5, weight: 75.0, verifiedBlood: true, active: true, next_eligibility: "2025-01-01", 
      },
      {
        first_name: "Maria", last_name: "Santos", email: "maria.santos@example.com", mobile_no: "09189876543",
        sex: "Female" as any, blood: "A+" as any, birthdate: "1998-08-22", age: 28, city_id: defaultCityId,
        zip_code: "1226", height: 158.0, weight: 55.5, verifiedBlood: true, active: true, next_eligibility: "2026-05-10", 
      },
      {
        first_name: "Miguel", last_name: "Reyes", email: "miguel.reyes@example.com", mobile_no: "09191122334",
        sex: "Male" as any, blood: "B-" as any, birthdate: "2001-11-30", age: 24, city_id: defaultCityId,
        zip_code: "1100", height: 165.0, weight: 62.3, verifiedBlood: false, active: true, next_eligibility: null,
      },
      {
        first_name: "Sofia", last_name: "Garcia", email: "sofia.garcia@example.com", mobile_no: "09204455667",
        sex: "Female" as any, blood: "AB+" as any, birthdate: "1992-02-14", age: 34, city_id: defaultCityId,
        zip_code: "1630", height: 160.2, weight: 58.1, verifiedBlood: true, active: true, next_eligibility: "2026-09-15",
      },
      {
        first_name: "Carlos", last_name: "Mendoza", email: "carlos.mendoza@example.com", mobile_no: "09227788990",
        sex: "Male" as any, blood: "O-" as any, birthdate: "1988-07-07", age: 38, city_id: defaultCityId,
        zip_code: "1015", height: 175.0, weight: 82.5, verifiedBlood: true, active: true, next_eligibility: "2024-12-25", 
      },

      // --- 10 New Donors ---
      {
        first_name: "Ana", last_name: "Villanueva", email: "ana.villanueva@example.com", mobile_no: "09173344556",
        sex: "Female" as any, blood: "A-" as any, birthdate: "1994-03-12", age: 32, city_id: defaultCityId,
        zip_code: "1105", height: 155.0, weight: 52.0, verifiedBlood: true, active: true, next_eligibility: "2026-02-14",
      },
      {
        first_name: "Mark", last_name: "Bautista", email: "mark.bautista@example.com", mobile_no: "09184455667",
        sex: "Male" as any, blood: "B+" as any, birthdate: "1990-09-05", age: 36, city_id: defaultCityId,
        zip_code: "1550", height: 178.5, weight: 85.0, verifiedBlood: true, active: true, next_eligibility: "2025-11-20",
      },
      {
        first_name: "Patricia", last_name: "Gonzales", email: "patricia.gonzales@example.com", mobile_no: "09195566778",
        sex: "Female" as any, blood: "O+" as any, birthdate: "2000-01-20", age: 26, city_id: defaultCityId,
        zip_code: "1600", height: 162.0, weight: 60.0, verifiedBlood: true, active: true, next_eligibility: "2026-10-01", 
      },
      {
        first_name: "Jose", last_name: "Aquino", email: "jose.aquino@example.com", mobile_no: "09206677889",
        sex: "Male" as any, blood: "AB-" as any, birthdate: "1985-11-11", age: 41, city_id: defaultCityId,
        zip_code: "1700", height: 168.0, weight: 78.5, verifiedBlood: false, active: true, next_eligibility: null,
      },
      {
        first_name: "Christine", last_name: "Ramos", email: "christine.ramos@example.com", mobile_no: "09217788990",
        sex: "Female" as any, blood: "O-" as any, birthdate: "1997-07-30", age: 29, city_id: defaultCityId,
        zip_code: "1410", height: 159.5, weight: 54.2, verifiedBlood: true, active: true, next_eligibility: "2026-07-01", 
      },
      {
        first_name: "Kevin", last_name: "Cruz", email: "kevin.cruz@example.com", mobile_no: "09228899001",
        sex: "Male" as any, blood: "A+" as any, birthdate: "1993-04-18", age: 33, city_id: defaultCityId,
        zip_code: "1008", height: 172.0, weight: 70.0, verifiedBlood: true, active: true, next_eligibility: "2025-06-15",
      },
      {
        first_name: "Bea", last_name: "Torres", email: "bea.torres@example.com", mobile_no: "09179900112",
        sex: "Female" as any, blood: "B-" as any, birthdate: "1999-12-05", age: 26, city_id: defaultCityId,
        zip_code: "1109", height: 163.0, weight: 59.0, verifiedBlood: false, active: true, next_eligibility: null,
      },
      {
        first_name: "Rafael", last_name: "Ocampo", email: "rafael.ocampo@example.com", mobile_no: "09181011223",
        sex: "Male" as any, blood: "O+" as any, birthdate: "1982-08-22", age: 44, city_id: defaultCityId,
        zip_code: "1229", height: 171.0, weight: 80.2, verifiedBlood: true, active: true, next_eligibility: "2026-01-10",
      },
      {
        first_name: "Diana", last_name: "Castro", email: "diana.castro@example.com", mobile_no: "09192122334",
        sex: "Female" as any, blood: "AB+" as any, birthdate: "1991-06-14", age: 35, city_id: defaultCityId,
        zip_code: "1740", height: 157.0, weight: 53.5, verifiedBlood: true, active: true, next_eligibility: "2026-08-25", 
      },
      {
        first_name: "Paolo", last_name: "Navarro", email: "paolo.navarro@example.com", mobile_no: "09203233445",
        sex: "Male" as any, blood: "A+" as any, birthdate: "2004-02-10", age: 22, city_id: defaultCityId,
        zip_code: "1632", height: 169.5, weight: 65.0, verifiedBlood: true, active: true, next_eligibility: "2025-09-09",
      }
    ];

    for (const d of donors) {
      const existing = await orm
        .select()
        .from(donor)
        .where(eq(donor.email, d.email))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⚠️  Skipped (already exists): ${d.first_name} ${d.last_name}`);
        continue;
      }

      await orm.insert(donor).values(d);
      console.log(`✅ Created Donor: ${d.first_name} ${d.last_name} (${d.blood})`);
    }

    console.log("\n✅ Donor seeding complete.");
    process.exit(0);

  } catch (error: any) {
    console.error("💥 Failed to seed donors:", error.message);
    process.exit(1);
  }
}

seedDonors();