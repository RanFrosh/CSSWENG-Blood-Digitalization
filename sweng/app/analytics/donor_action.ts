"use server";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { eq } from "drizzle-orm";

export async function fetchDonorAnalytics(donorIdStr: string) {
    try {

        const idString = donorIdStr.replace(/\D/g, ''); 

        const numericId = BigInt(idString); 

        const [dbDonor] = await orm
            .select()
            .from(donor)
            .where(eq(donor.id, numericId))
            .limit(1);

        if (!dbDonor) {
            return { success: false, message: "Donor not found in database" };
        }

        return {
            success: true,
            data: {
                id: `D-${String(dbDonor.id).padStart(3, '0')}`,
                name: `${dbDonor.first_name} ${dbDonor.last_name}`,
                sex: dbDonor.sex,
                bloodType: dbDonor.blood,
                mobile_no: dbDonor.mobile_no,
                age: dbDonor.age,
                email: dbDonor.email,
                location: `${dbDonor.street}, ${dbDonor.zip_code}`,
                verifiedBlood: dbDonor.verifiedBlood,
                active: dbDonor.active,
                
                // PLACEHOLDER
                totalVisits: 4,
                mostRecentVisitDate: "2026-07-15",
                mostRecentVisitEvent: "Blood Donation Drive",
                bloodDonated: "1,350 mL",
                bloodBagsFilled: 3,
                successfulDonations: 3,
                deferredVisits: 1,
                nextEligibleDate: "2026-10-13"
            }
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function fetchAllDonors() {
    try {
        const dbDonors = await orm
            .select({
                id: donor.id,
                first_name: donor.first_name,
                last_name: donor.last_name,
                email: donor.email,
                mobile_no: donor.mobile_no,
                active: donor.active,
                age: donor.age,
                blood: donor.blood,
                sex: donor.sex,
                street: donor.street,
                zip_code: donor.zip_code
            })
            .from(donor)
            .limit(50); 
        return { success: true, data: dbDonors };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}