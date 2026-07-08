import { orm } from "@/db/drizzle";
import { corrected_event } from "@/db/models/corrected_event";
import { sql } from "drizzle-orm";

async function clearCorrections() {
  console.log("🗑️  Clearing mock corrections...\n");

  try {
    await orm.delete(corrected_event);
    console.log("✅ Deleted all corrections");
  } catch (err: any) {
    console.error("❌ Failed to delete corrections", err.message);
    process.exit(1);
  }

  try {
    await orm.execute(sql`ALTER SEQUENCE corrected_event_id_seq RESTART WITH 1`);
    console.log("✅ Reset corrected_event sequence");
  } catch (err: any) {
    console.error("❌ Failed to reset sequence", err.message);
    process.exit(1);
  }

  console.log("\n✅ Clear complete.");
  process.exit(0);
}

clearCorrections();