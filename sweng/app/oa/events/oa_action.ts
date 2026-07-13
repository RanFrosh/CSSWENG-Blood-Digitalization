"use server"

import { authenticate } from "@/app/global/access/authenticate";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { ViewEventFilters } from "@/types/event_type";

export async function checkAuthentication(data?: ViewEventFilters) {
    
    return authenticate('access_oa_page', async (userId) => {
        
        
        /* const model = new ImpLabModel(orm);
        const controller = new ImpLabController(model);
        return controller.getQueue(userId); */

        await new Promise(resolve => setTimeout(resolve, 800));

        // Hardcoded
        return {
            success: true,
            message: "Mock OA data loaded successfully",
            data: [
                { 
                    id: 1, 
                    eventName: "Campus Blood Drive", 
                    status: "Ongoing", 
                    donorsWaiting: 12 
                },
                { 
                    id: 2, 
                    eventName: "Community Center Drive", 
                    status: "Upcoming", 
                    donorsWaiting: 0 
                }
            ]
        };
    })
}

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