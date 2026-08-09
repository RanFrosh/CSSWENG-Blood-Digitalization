import { NextResponse } from "next/server";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/schemas/donor";

export async function POST(request: Request) {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      blood,
      sex,
      city_id,
      email,
      mobile_no,
      birthdate,
      age,
      height,
      weight,
      zip_code,
      medicalNote,
      assessment_status,
      next_eligibility,
    } = await request.json();

    if (
      !first_name ||
      !last_name ||
      !blood ||
      !sex ||
      !city_id ||
      !email ||
      !mobile_no
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await orm
      .insert(donor)
      .values({
        first_name,
        middle_name: middle_name ?? null,
        last_name,
        email,
        mobile_no,
        birthdate: birthdate ?? null,
        age: age ?? null,
        height: height ?? null,
        weight: weight ?? null,
        zip_code: zip_code ?? null,
        sex,
        blood,
        city_id: BigInt(city_id),
        medicalNote: medicalNote ?? null,
        assessment_status: assessment_status ?? null,
        next_eligibility: next_eligibility ?? null,
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