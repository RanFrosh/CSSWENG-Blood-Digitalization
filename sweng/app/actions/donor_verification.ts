"use server";

import { eq } from "drizzle-orm";

import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function verifyDonorAction(token: string) {
    try {
        const result = await orm
            .select({
                id: donor.id,
                qr_token: donor.qr_token,
                first_name: donor.first_name,
                middle_name: donor.middle_name,
                last_name: donor.last_name,
                email: donor.email,
                mobile_no: donor.mobile_no,
                age: donor.age,
                birthdate: donor.birthdate,
                blood: donor.blood,
                sex: donor.sex,
                verifiedBlood: donor.verifiedBlood,
                medicalNote: donor.medicalNote,
                active: donor.active,
            })
            .from(donor)
            .where(eq(donor.qr_token, token))
            .limit(1);

        if (result.length === 0) {
            return {
                success: false,
                message: "Invalid QR code.",
            };
        }

        return {
            success: true,
            donor: result[0],
        };
    } catch (error) {
        console.error("VERIFY QR ERROR:", error);

        return {
            success: false,
            message: "Internal server error.",
        };
    }
}