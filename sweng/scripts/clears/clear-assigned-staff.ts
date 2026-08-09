import { orm } from "@/db/drizzle";
import { assigned_staff } from "@/db/schemas/assigned_staff";
import { sql } from "drizzle-orm";

async function clearAssignedStaff() {
  console.log("🗑️  Clearing assigned staff...\n");

  try {
    await orm.delete(assigned_staff);
    console.log("✅ Deleted all assigned staff records");
  } catch (err: any) {
    console.error("❌ Failed to delete assigned staff", err.message);
    process.exit(1);
  }

  try {
    await orm.execute(sql`ALTER SEQUENCE assigned_staff_id_seq RESTART WITH 1`);
    console.log("✅ Reset assigned_staff sequence back to 1");
  } catch (err: any) {
    console.error("❌ Failed to reset sequence", err.message);
    process.exit(1);
  }

  console.log("\n✅ Assigned staff clear complete.");
  process.exit(0);
}

clearAssignedStaff();