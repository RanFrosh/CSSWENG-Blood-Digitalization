"use server";

import { eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function softDeleteDonorAction(formData: FormData): Promise<void> {
  const donorId = formData.get("donorId") as string;
  const reason = formData.get("reason") as string;

  if (!donorId || !reason) {
    throw new Error("Missing donor ID or reason");
  }

  await orm
    .update(donor)
    .set({
      active: false,
      delete_datetime: new Date(),
      deleted_by: null,
      delete_reason: reason,
    })
    .where(eq(donor.id, BigInt(donorId)));
}