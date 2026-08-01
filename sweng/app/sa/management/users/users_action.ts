"use server"

import { ApiResponse } from "@/types/api_res_type";
import { serverSupa } from "@/db/supaserver";
import { orm } from "@/db/drizzle";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { ImpProfilesModel } from "@/app/profiles/imp_profiles_data";
import { ImpProfilesManager } from "@/app/profiles/imp_profiles_controller";
import { StaffUser, StaffUserRow } from "@/types/staff_type";

export async function getUsers(): Promise<ApiResponse<StaffUser[]>> {
    const database = await serverSupa();
    const model = new ImpProfilesModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpProfilesManager(model, profiler);

    const result = await controller.invokeGetStaffUsers();
    if (!result.success) return { success: false, message: result.message, data: [] };

    const users: StaffUser[] = (result.data ?? []).map((row: StaffUserRow) => ({
        ...row,
        status: row.active ? "Active" : "Inactive",
    }));

    return { success: true, message: "StaffUser retrieved", data: users }
}