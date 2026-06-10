import { NextResponse } from "next/server";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    const result = await orm
      .insert(donor)
      .values({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email,
        mobile_no: mobileNumber,
        street: `${addressLine1} ${addressLine2 ?? ""}`.trim(),
        zip_code: zipCode,
        sex,
        blood: bloodType,
        city_id: BigInt(city),
        photo_path: "placeholder.jpg",
      })
      .returning();

    const insertedDonor = result[0];

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
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to register donor",
      },
      { status: 500 }
    );
  }
}