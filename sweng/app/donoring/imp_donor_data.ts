import { ApiResponse } from "@/types/api_res_type";
import { SQL, eq, and } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { DonorData } from "@/abstract/donor/donor_abstract";
import { ViewDonorPartial, ViewDonor } from "@/types/donor_type";
import { donor } from "@/db/models/donor";

export class ImpDonorModel implements DonorData {
    private access: typeof orm;

    constructor(injectAccess: typeof orm) {
        this.access = injectAccess;
    }

    async getSingleDonor(filterer: ViewDonorPartial): Promise<ApiResponse<ViewDonor>> {
        try {
            const filtersDonor: SQL[] = [];
            if (filterer.id) filtersDonor.push(eq(donor.id, filterer.id));
            if (filterer.sex) filtersDonor.push(eq(donor.sex, filterer.sex));
            if (filterer.email) filtersDonor.push(eq(donor.email, filterer.email));
            if (filterer.first_name) filtersDonor.push(eq(donor.first_name, filterer.first_name));
            if (filterer.last_name) filtersDonor.push(eq(donor.last_name, filterer.last_name));
            if (filterer.middle_name) filtersDonor.push(eq(donor.middle_name, filterer.middle_name));
            if (filterer.mobile_no) filtersDonor.push(eq(donor.mobile_no, filterer.mobile_no));
            if (filterer.blood) filtersDonor.push(eq(donor.blood, filterer.blood));
            if (filterer.city_id) filtersDonor.push(eq(donor.city_id, filterer.city_id));

            const [result] = await this.access
            .select()
            .from(donor)
            .where(and(...filtersDonor))
            .limit(1);

            if (!result) return { success: true, message: "Donor not found" };
            return { success: true, message: "Donor retrieved", data: result }    
        } catch (err: any) {
            return { success: false, message: err.message }
        }  
    }
}