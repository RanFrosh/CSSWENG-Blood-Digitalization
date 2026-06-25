import { NextResponse } from "next/server";
import { softDeleteDonor } from "@/db/queries/donor-deletion";

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

    const deletedDonor = await softDeleteDonor({
      donorId: id,
      reason,
      deletedBy: null,
    });

    if (!deletedDonor) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }

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