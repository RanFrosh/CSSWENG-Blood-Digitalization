// This file defines an API route for handling donor registration in a Next.js application. It uses the Drizzle ORM to interact with the database and insert new donor records.
import { NextResponse } from "next/server";

// Imports the 'orm' instance from the local 'drizzle' module, which is likely a configured instance of the Drizzle ORM for interacting with the database.
import { orm } from "@/db/drizzle";

// Imports the 'donor' model from the local 'donor' module, which represents the structure of the 'donor' table in the database.
import { donor } from "@/db/models/donor";

// The POST function handles incoming POST requests to register a new donor. 
// It extracts the donor information from the request body, validates the required fields, and inserts a new donor record into the database. If successful, it returns a JSON response with the inserted donor's details; otherwise, it returns an error response.
export async function POST(request: Request) {
  try {
    // Parses the incoming request body as JSON to extract donor information.
    const body = await request.json();

    // Extracts individual donor fields from the parsed request body for further processing.
    const {
      firstName,
      middleName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      province,
      zipCode,
      email,
      mobileNumber,
      sex,
      bloodType,
    } = body;

    // Validates that all required donor fields are present. 
    // If any required field is missing, it returns a JSON response with an error message and a 400 status code.
    if (
      !firstName ||
      !lastName ||
      !addressLine1 ||
      !city ||
      !province ||
      !zipCode ||
      !email ||
      !mobileNumber ||
      !sex ||
      !bloodType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Inserts a new donor record into the database using the Drizzle ORM.
    // The 'insert' method is called on the 'donor' model, and the donor's information is provided as an object to the 'values' method.
    const result = await orm
      .insert(donor)
      .values({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email,
        mobile_no: mobileNumber,

        // Combines the address lines into a single 'street' field, ensuring that any optional second address line is included if provided. The 'trim()' method is used to remove any leading or trailing whitespace.
        street: `${addressLine1} ${addressLine2 ?? ""}`.trim(),
        
        zip_code: zipCode,
        sex,
        blood: bloodType,

        // Converts the 'city' value to a BigInt before storing it in the database, as the database expects a BigInt for the 'city_id' field.
        city_id: BigInt(city),

        // Termporary placeholder for the photo path, as the actual photo upload functionality is not implemented in this snippet. The 'photo_path' field is set to a default value of "placeholder.jpg".
        photo_path: "placeholder.jpg",
      })

      // Returns the inserted donor record after the insert operation. 
      // The 'returning()' method is used to retrieve the newly created donor record, which can then be included in the response.
      .returning();

    // Retrieves the first inserted donor record from the result array returned by the 'returning()' method. 
    // This record contains the details of the newly created donor, including the auto-generated ID and other fields.
    const insertedDonor = result[0];

    // Returns a JSON response indicating the successful registration of the donor, along with the inserted donor's details.
    // The donor's ID and city ID are converted to strings before being included in the response, as they are stored as BigInt in the database.
    return NextResponse.json(
      {
        success: true,
        donor: {
          ...insertedDonor,
          id: insertedDonor.id.toString(),
          city_id: insertedDonor.city_id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Logs any errors that occur during the donor registration process to the console for debugging purposes.
    console.error(error);

    // Returns a JSON response indicating that the donor registration failed, along with an error message and a 500 status code.
    return NextResponse.json(
      {
        success: false,
        error: "Failed to register donor",
      },
      { status: 500 } // HTTP status code 500 indicates an internal server error, which is appropriate for unexpected errors that occur during the processing of the request.
    );
  }
}