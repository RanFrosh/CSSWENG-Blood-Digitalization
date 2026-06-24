"use server"

import { serverSupa } from "@/db/supaserver";
import { getProfile } from "../fetch_profile/single_profile";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { eq, and, SQL, getTableColumns } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type Donor = InferSelectModel<typeof donor>;

export type Filters = Partial<Donor>;

export async function getDonors (filters?: Filters) {
    const supabase = await serverSupa();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("Illegal attempt, anonymous request on query donors");
        return { success: false, data: null, message: "Illegal attempt, anonymous request on query donors" };
    } else {
        const res = await getProfile();
        if (!res.data || !res.success) {
            console.error('Problem in donor query after getprofile: ' + res.message);
            return { success: false, data: null, message: res.message }
        }
        if (res.data.role === 'super_admin') {
            const instructions: SQL[] = [];
            const columns = getTableColumns(donor);
            try {
                if (filters) {
                    for (const [key, value] of Object.entries(filters)) {
                        if (value === undefined || value === null) continue;
                        if (key in columns) {
                            const col = columns[key as keyof typeof columns];
                            instructions.push(eq(col, value));
                        }
                    }
                }
            } catch (err: any) {
                console.error("Problem with filter builder: " + err.message);
                return { success: false, data: null, message: "Problem with filter builder: " + err.message }
            }
            const donors = await orm
            .select()
            .from(donor)
            .where(instructions.length > 0 ? and(...instructions) : undefined);
            return { success: true, data: donors, message: `Query for ${donors.length} donors success` }     
        } else {
            console.error("Request denied, no admin privilege");
            return { success: false, data: null, message: "Request denied, no admin privilege" };
        }
    }
}