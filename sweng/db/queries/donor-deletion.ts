import { eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function softDeleteDonor({
  donorId,
  reason,
  deletedBy = null,
}: {
  donorId: string;
  reason: string;
  deletedBy?: bigint | null;
}) {
  const result = await orm
    .update(donor)
    .set({
      active: false,
      delete_datetime: new Date(),
      deleted_by: deletedBy,
      delete_reason: reason,
    })
    .where(eq(donor.id, BigInt(donorId)))
    .returning();

  return result[0] ?? null;
}