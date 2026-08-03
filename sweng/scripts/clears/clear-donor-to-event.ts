import { orm } from "@/db/drizzle";
import { donor_to_event } from "@/db/models/donor_to_event";
import { sql } from "drizzle-orm";

async function clearDonorToEvent() {
  console.log("🗑️  Clearing the event queue (donor_to_event)...\n");

  try {
    await orm.delete(donor_to_event);
    console.log("✅ Deleted all queue records");
  } catch (err: any) {
    console.error("❌ Failed to delete queue", err.message);
    process.exit(1);
  }

  try {
    await orm.execute(sql`ALTER SEQUENCE donor_to_event_id_seq RESTART WITH 1`);
    console.log("✅ Reset donor_to_event sequence back to 1");
  } catch (err: any) {
    console.error("❌ Failed to reset sequence", err.message);
    process.exit(1);
  }

  console.log("\n✅ Queue clear complete.");
  process.exit(0);
}

clearDonorToEvent();