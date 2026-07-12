import { eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function hardDeleteDonor(donorId: string) {
  const result = await orm
    .delete(donor)
    .where(eq(donor.id, BigInt(donorId)))
    .returning();

  return result[0] ?? null;
}