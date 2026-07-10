// scripts/clear-events-drizzle.ts
import { orm } from "@/db/drizzle";
import { event_log } from "@/db/models/event";
import { sql } from "drizzle-orm";

async function clearEvents() {
  console.log("🗑️  Clearing mock events...\n");

  try {
    await orm.delete(event_log);
    console.log("✅ Deleted all events");
  } catch (err: any) {
    console.error("❌ Failed to delete events", err.message);
    process.exit(1);
  }

  try {
    await orm.execute(sql`ALTER SEQUENCE event_log_id_seq RESTART WITH 1`);
    console.log("✅ Reset event_log sequence");
  } catch (err: any) {
    console.error("❌ Failed to reset sequence", err.message);
    process.exit(1);
  }

  console.log("\n✅ Clear complete.");
  process.exit(0);
}

clearEvents();