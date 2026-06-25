import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import type { DonorRegistrationRequest } from "@/lib/interfaces/donor-registration";

export async function registerDonor(data: DonorRegistrationRequest) {
  const result = await orm
    .insert(donor)
    .values({
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      email: data.email,
      mobile_no: data.mobileNumber,
      street: `${data.addressLine1} ${data.addressLine2 ?? ""}`.trim(),
      zip_code: data.zipCode,
      sex: data.sex,
      blood: data.bloodType,
      city_id: BigInt(data.city),
      photo_path: "placeholder.jpg",
    })
    .returning();

  return result[0] ?? null;
}