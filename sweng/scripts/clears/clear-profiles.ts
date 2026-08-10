import { orm } from "@/db/drizzle";
import { profiles } from "@/db/schemas/profiles";
import { sql } from "drizzle-orm";

async function clearProfiles() {
  console.log("Clearing Profiles...\n");

  try {
    await orm.delete(profiles);
    console.log("Deleted all profile records");
  } catch (err: any) {
    console.error("Failed to delete profile", err.message);
    process.exit(1);
  }
}

clearProfiles();