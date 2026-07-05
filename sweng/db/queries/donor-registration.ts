// This file contains the database query for registering a new donor in the system. It uses the Drizzle ORM to interact with the database and insert a new record into the 'donor' table based on the provided donor registration data.
import { orm } from "@/db/drizzle";

// Imports the 'donor' model from the local 'donor' module, which represents the structure of the 'donor' table in the database.
import { donor } from "@/db/models/donor";

// Imports the 'DonorRegistrationRequest' interface from the local 'donor-registration' module, which defines the structure of the donor registration data expected by this function.
import type { DonorRegistrationRequest } from "@/lib/interfaces/donor-registration";

export async function registerDonor(data: DonorRegistrationRequest) {
  // Inserts a new donor record into the database using the Drizzle ORM. The 'insert' method is called on the 'donor' model, and the donor's information is provided as an object to the 'values' method. The function returns the newly inserted donor record or null if the insertion fails.
  const result = await orm
    .insert(donor)
    .values({
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      email: data.email,
      mobile_no: data.mobileNumber,

      // Combines the addressLine1 and addressLine2 fields into a single street field, ensuring that any extra whitespace is trimmed. If addressLine2 is not provided, it defaults to an empty string.
      street: `${data.addressLine1} ${data.addressLine2 ?? ""}`.trim(),
      
      zip_code: data.zipCode,
      sex: data.sex,
      blood: data.bloodType,
      
      // Converts the city field from the donor registration data to a BigInt for storage in the database, as the city_id field in the donor table is defined as a bigint type. This establishes a foreign key relationship between the donor and the city.
      city_id: BigInt(data.city),

      // Sets a placeholder value for the photo_path field, as the actual photo upload functionality is not implemented in this function. This field is required in the donor table, so a default value is provided to ensure the insertion succeeds.
      photo_path: "placeholder.jpg",
    })
    // The 'returning()' method is called to return the newly inserted donor record after the insert operation. If the insertion fails, it will return an empty array.
    .returning();

  // Returns the first inserted donor record from the result array returned by the 'returning()' method. If no record was inserted, it returns null.
  return result[0] ?? null;
}