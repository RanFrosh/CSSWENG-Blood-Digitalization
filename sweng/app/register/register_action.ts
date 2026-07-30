"use server"

import { ApiResponse } from "@/types/api_res_type";
import { adminSupa } from "@/db/supaadmin";
import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { ImpRegisterModel } from "./imp_register_data";
import { ImpRegisterManager } from "./imp_register_controller";
import { AccessType } from "@/db/enums/access_level";
import { orm } from "@/db/drizzle";

export async function prepareStaff(email: string, role: AccessType): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpRegisterModel(orm, adminSupa);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpRegisterManager(model, profiler);

    const staffResult = await controller.invokeCreateStaff(email, `${process.env.NEXT_PUBLIC_APP_URL}/signup`);
    if (!staffResult.success || !staffResult.data) return { success: staffResult.success, message: staffResult.message };

    const profileResult = await controller.invokeCreateProfile(staffResult.data, role);
    if (!profileResult.success) return profileResult;

    return { success: true, message: "Staff invited" };
}