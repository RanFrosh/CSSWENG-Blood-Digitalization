"use server";

// Imports the 'eq' function from the 'drizzle-orm' library, which is used for creating equality conditions in database queries.
import { eq } from "drizzle-orm"; 

// Imports the 'orm' instance from the local 'drizzle' module, which is likely a configured instance of the Drizzle ORM for interacting with the database.
import { orm } from "@/db/drizzle"; 

// Imports the 'donor' model from the local 'donor' module, which represents the structure of the 'donor' table in the database.
import { donor } from "@/db/models/donor"; 

export async function softDeleteDonorAction(formData: FormData): Promise<void> {
  // Retrieves the 'donorId' and 'reason' values from the provided FormData object, casting them to strings.
  const donorId = formData.get("donorId") as string;

  // Retrieves the 'reason' value from the provided FormData object, casting it to a string.
  const reason = formData.get("reason") as string;

  //Ensure both required fields are present before updating the donor record, if not throw an error.
  if (!donorId || !reason) {
    throw new Error("Missing donor ID or reason");
  }

  // Perform a soft delete operation on the donor record in the database by calling the 'softDeleteDonor' function with the provided 'donorId' and 'reason'.
  await orm
    .update(donor)
    .set({
      active: false,  // Marks the donor as inactive
      delete_datetime: new Date(),    // Records the datetime of deletion
      deleted_by: null,               // Records the user who deleted the donor (in this implementation)
      delete_reason: reason,          // Records the reason for deletion
    })

    // Updates the donor record where the donor's ID matches the provided 'donorId', converting it to a BigInt for comparison.
    .where(eq(donor.id, BigInt(donorId)));
}