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

    const staffResult = await controller.invokeCreateStaff(email, `${process.env.APP_URL}/signup`);
    if (!staffResult.success || !staffResult.data) return { success: staffResult.success, message: staffResult.message };

    const profileResult = await controller.invokeCreateProfile(staffResult.data, role);
    if (!profileResult.success) {
        const deleter = await controller.invokeDeleteStaff(staffResult.data);
        return { success: false, message: `Profile creation failed: ${profileResult.message}. Additionally, ${deleter.message}` };
    }

    return { success: true, message: "Staff invited" };
}

export async function finishRegistration(name: string, password: string): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpRegisterModel(orm, adminSupa);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpRegisterManager(model, profiler);

    const passRes = await controller.invokeSetPassword(password);
    if (!passRes.success) return passRes;

    const profileRes = await controller.invokeFinishProfile(name);
    if (!profileRes.success) return profileRes;

    return { success: true, message: "Registration completed" };
}