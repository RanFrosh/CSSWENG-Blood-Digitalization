import { orm } from "@/db/drizzle";
import { event_queue } from "@/db/models/event_queue"; // Adjust path if needed
import { sql } from "drizzle-orm";

async function clearEventQueue() {
  console.log("🗑️  Clearing the live event queue...\n");

  try {
    await orm.delete(event_queue);
    console.log("✅ Deleted all live queue records");
  } catch (err: any) {
    console.error("❌ Failed to delete event queue", err.message);
    process.exit(1);
  }

  try {
    await orm.execute(sql`ALTER SEQUENCE event_queue_id_seq RESTART WITH 1`);
    console.log("✅ Reset event_queue sequence back to 1");
  } catch (err: any) {
    console.error("❌ Failed to reset sequence", err.message);
    process.exit(1);
  }

  console.log("\n✅ Event queue clear complete.");
  process.exit(0);
}

clearEventQueue();