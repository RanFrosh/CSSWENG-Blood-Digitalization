import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const { reason } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing donor ID" },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { success: false, error: "Deletion reason is required" },
        { status: 400 }
      );
    }

    const result = await orm
      .update(donor)
      .set({
        active: false,
        deleted_at: new Date(),
        deleted_by: null, // temporary until auth/super admin ID is available
        deletion_reason: reason,
      })
      .where(eq(donor.id, BigInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }

    const deletedDonor = result[0];

    return NextResponse.json({
      success: true,
      message: "Donor deleted successfully",
      donor: {
        ...deletedDonor,
        id: deletedDonor.id.toString(),
        city_id: deletedDonor.city_id.toString(),
        deleted_by: deletedDonor.deleted_by
          ? deletedDonor.deleted_by.toString()
          : null,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete donor",
      },
      { status: 500 }
    );
  }
}