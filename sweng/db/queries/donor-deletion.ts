// Imports the 'eq' function from the 'drizzle-orm' library, which is used for creating equality conditions in database queries.
import { eq } from "drizzle-orm"; 

// Imports the 'orm' instance from the local 'drizzle' module, which is likely a configured instance of the Drizzle ORM for interacting with the database.
import { orm } from "@/db/drizzle"; 

// Imports the 'donor' model from the local 'donor' module, which represents the structure of the 'donor' table in the database.
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
  // Updates the 'donor' record in the database to mark it as deleted (soft delete) by setting the 'active' field to false, recording the deletion timestamp, the user who deleted it, and the reason for deletion. 
  // It returns the updated donor record or null if no record was found.
  const result = await orm
    .update(donor)
    .set({
      active: false,
      delete_datetime: new Date(),
      deleted_by: deletedBy,
      delete_reason: reason,
    })
    // Updates the donor record where the donor's ID matches the provided 'donorId', converting it to a BigInt for comparison.
    .where(eq(donor.id, BigInt(donorId)))

    // donorId is a string, but the database expects a BigInt for the 'id' field, so we convert it to BigInt for the comparison in the 'where' clause.
    .returning();

  // The 'returning()' method is used to return the updated donor record after the update operation. If no record was found to update, it will return an empty array.
  return result[0] ?? null;
}