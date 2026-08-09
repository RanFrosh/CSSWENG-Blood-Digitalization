import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";
import { sql } from "drizzle-orm";

async function clearDonors() {
  console.log("🗑️  Clearing mock donors...\n");

  try {
    await orm.delete(donor);
    console.log("✅ Deleted all donors");
  } catch (err: any) {
    console.error("❌ Failed to delete donors", err.message);
    process.exit(1);
  }

  try {
    await orm.execute(sql`ALTER SEQUENCE donor_id_seq RESTART WITH 1`);
    console.log("✅ Reset donor sequence back to 1");
  } catch (err: any) {
    console.error("❌ Failed to reset sequence", err.message);
    process.exit(1);
  }

  console.log("\n✅ Clear complete.");
  process.exit(0);
}

clearDonors();