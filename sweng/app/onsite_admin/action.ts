"use server";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

export async function register_new_donor(formData: any) {
    try {
        const [newDonor] = await orm.insert(donor).values({
            first_name: formData.fname,
            middle_name: formData.mname,
            last_name: formData.lname,
            age: formData.age,
            sex: formData.sex,
            blood: formData.blood,
            email: formData.email,
            mobile_no: formData.mobile,
            street: formData.address,
            zip_code: formData.zip,
            city_id: BigInt(3),
            photo_path: "user.png",
            active: true, 
            verifiedBlood: false 
        }).returning({ id: donor.id });

        return { success: true, newId: newDonor.id };
    } catch (error: any) {
        console.error("DONOR INSERT ERROR:", error);
        return { success: false, message: error.message };
    }
}