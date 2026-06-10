"use server"

import { orm } from "@/db/drizzle";
import { inArray } from "drizzle-orm";
import { serverSupa } from "@/db/supaserver";
import { getProfile } from "../fetch_profile/single_profile";
import { donor } from "@/db/models/donor";

export type DeletionMode = 'soft' | 'hard' | 'reactivate';

export async function deleteDonors (donorlist: (number | string)[], command: DeletionMode) {
    {/* const supabase = await serverSupa();
        const { data: { user } } = await supabase.auth.getUser();
    
        if (!user) {
            console.error("Illegal attempt, anonymous request on donor deletion");
            return { success: false, data: null, message: "Illegal attempt, anonymous request on donor deletion" };
        } else {
            const res = await getProfile();
            if (!res.data || !res.success) {
                console.error('Problem in donor deletion after getprofile: ' + res.message);
                return { success: false, message: res.message }
            }
            if (res.data.role === 'super_admin') {
                
                try {
                    const idList = donorlist.map((item) => BigInt(item));
                    if (command === 'hard') {
                        await orm.delete(donor)
                        .where(inArray(donor.id, idList));
                    } else {
                        const status = command === 'reactivate';
                        await orm.update(donor)
                        .set({ active: status })
                        .where(inArray(donor.id, idList));
                    }
                    return { success: true, message: `Done processing ${donorlist.length} donors` };
                } catch (err: any) {
                    console.error('try block failed on donor toggle: ' + err.message);
                    return { success: false, message: err.message };
                }
            }
        }*/

        try {
                    const idList = donorlist.map((item) => BigInt(item));
                    if (command === 'hard') {
                        await orm.delete(donor)
                        .where(inArray(donor.id, idList));
                    } else {
                        const status = command === 'reactivate';
                        await orm.update(donor)
                        .set({ active: status })
                        .where(inArray(donor.id, idList));
                    }
                    return { success: true, message: `Done processing ${donorlist.length} donors` };
                } catch (err: any) {
                    console.error('try block failed on donor toggle: ' + err.message);
                    return { success: false, message: err.message };
                }
}}