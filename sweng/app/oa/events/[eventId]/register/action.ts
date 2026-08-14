"use server";

import { redirect } from "next/navigation";
import { eq, or } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";
import { executeLogEvent } from "@/actions/event_action";

type RegisterState = {
  error?: string;
} | null;

/**
 * Registers a new donor by extracting form data, validating
 * required fields, inserting the donor into the database,
 * and redirecting the user to the scanner page.
 *
 * @param formData - Form data submitted from the donor registration form.
 * @throws {Error} If any required field is missing.
 * @returns A Promise that resolves after the donor has been registered.
 */
export async function registerDonorAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  
  const eventId = formData.get("eventId") as string;

  const firstName = formData.get("firstName") as string;
  const middleName = formData.get("middleName") as string | null;
  const lastName = formData.get("lastName") as string;

  const age = formData.get("age") as string;

  const sex = formData.get("sex") as string;
  const bloodType = formData.get("bloodType") as string;

  const email = formData.get("email") as string;
  const mobileNumber = formData.get("mobileNumber") as string;

  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;
  
  console.log("FORM VALUES:", {
    firstName,
    lastName,
    address,
    city,
    zipCode,
    email,
    mobileNumber,
    sex,
    bloodType,
  });

  // Validate that all required fields have been provided
  if (
    !firstName ||
    !lastName ||
    !address ||
    !city ||
    !zipCode ||
    !email ||
    !mobileNumber ||
    !sex ||
    !bloodType
  ) {
    return { error: "Missing required fields." };
  }

  // Validate the ZIP code format (must be exactly 4 digits)
  const zipCodePattern = /^\d{4}$/;

  if (!zipCodePattern.test(zipCode)) {
    return { error: "ZIP code must be exactly 4 digits." };
  }

  // Validate the mobile number format (must be 11 digits and start with 09)
  const mobilePattern = /^09\d{9}$/;

  if (!mobilePattern.test(mobileNumber)) {
    return { error: "Mobile number must be 11 digits and start with 09." };
  }
  
  // Check if the email or mobile number already exists in the database
  const existingDonor = await orm
    
  .select({
    email: donor.email,
    mobile_no: donor.mobile_no,
  })
  .from(donor)
  .where(or(eq(donor.email, email), eq(donor.mobile_no, mobileNumber)))
  .limit(1);

  if (existingDonor.length > 0) {
    const existing = existingDonor[0];

    if (existing.email === email) {
      return {
        error: "Email address is already registered.",
      };
    }

    if (existing.mobile_no === mobileNumber) {
      return {
        error: "Mobile number is already registered.",
      };
    }
  }

  // Insert the new donor record into the database
try {
  const [newDonor] = await orm
    .insert(donor)
    .values({
      first_name: firstName,
      middle_name: middleName || null,
      last_name: lastName,
      email,
      mobile_no: mobileNumber,
      age: Number(age),
      street: address.trim(),
      zip_code: zipCode,
      sex,
      blood: bloodType,
      city_id: BigInt(city),
      photo_path: "placeholder.jpg",
    } as any)
    .returning({
      id: donor.id,
      qr_token: donor.qr_token,
    });

  console.log("New donor:", newDonor);
  console.log("QR Token:", newDonor.qr_token);
  await executeLogEvent({
    event_log_id: BigInt(eventId),
    donor_id: newDonor.id,
    action: "register",
    time: new Date().toTimeString().slice(0, 8)
  });
} catch (error) {
  console.error("DONOR INSERT ERROR:", error);
  throw error;
}

  // Redirect the user to the scanner page after successful registration
  redirect(`/oa/events/${eventId}/scanner`);
}