"use server";

import { redirect } from "next/navigation";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function registerDonorAction(formData: FormData): Promise<void> {
  const firstName = formData.get("firstName") as string;
  const middleName = formData.get("middleName") as string | null;
  const lastName = formData.get("lastName") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = formData.get("addressLine2") as string | null;
  const city = formData.get("city") as string;
  const province = formData.get("province") as string;
  const zipCode = formData.get("zipCode") as string;
  const email = formData.get("email") as string;
  const mobileNumber = formData.get("mobileNumber") as string;
  const sex = formData.get("sex") as string;
  const bloodType = formData.get("bloodType") as string;

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
    throw new Error("Missing required fields");
  }

  await orm.insert(donor).values({
    first_name: firstName,
    middle_name: middleName || null,
    last_name: lastName,
    email,
    mobile_no: mobileNumber,
    street: `${addressLine1} ${addressLine2 ?? ""}`.trim(),
    zip_code: zipCode,
    sex,
    blood: bloodType,
    city_id: BigInt(city),
    photo_path: "placeholder.jpg",
  });

  redirect("/scanner");
}