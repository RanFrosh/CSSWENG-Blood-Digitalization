import { orm } from "@/db/drizzle";
import { blood_bag } from "@/db/models/blood_bag";
import { sql } from "drizzle-orm";

async function clearBags() {
  console.log("🗑️  Clearing physical inventory (blood_bag)...\n");

  try {
    await orm.delete(blood_bag);
    console.log("✅ Deleted all blood bags");
  } catch (err: any) {
    console.error("❌ Failed to delete blood bags", err.message);
    process.exit(1);
  }

  try {
    await orm.execute(sql`ALTER SEQUENCE blood_bag_id_seq RESTART WITH 1`);
    console.log("✅ Reset blood_bag sequence back to 1");
  } catch (err: any) {
    console.error("❌ Failed to reset sequence", err.message);
    process.exit(1);
  }

  console.log("\n✅ Inventory clear complete.");
  process.exit(0);
}

clearBags();