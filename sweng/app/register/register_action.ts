"use server"

import { ApiResponse } from "@/types/api_res_type";
import { adminSupa } from "@/db/supaadmin";
import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { ImpRegisterModel } from "./imp_register_data";
import { ImpRegisterManager } from "./imp_register_controller";
import { AccessType } from "@/db/enums/access_level";
import { orm } from "@/db/drizzle";
import { ImpEventModel } from "../event_records/imp_event_data";
import { ImpEventManager } from "../event_records/imp_event_controller";

export async function prepareStaff(email: string, role: AccessType): Promise<ApiResponse<string | null>> {
    const database = await serverSupa();
    const model = new ImpRegisterModel(orm, adminSupa);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpRegisterManager(model, profiler);

    const existing = await controller.invokeFindStaffByEmail(email);
    if (!existing.success) return { success: existing.success, message: existing.message };
    if (existing.data) {
        const complete = await controller.invokeIsProfileComplete(existing.data);
        if (!complete.success) return { success: complete.success, message: complete.message };
        if (complete.data?.active === true) return { success: false, message: "Already registered" }
        const reInvite = await controller.invokeCreateStaff(email, `${process.env.APP_URL}/signup`);
        return { success: reInvite.success, message: reInvite.message, data: reInvite.data ?? null };
    }

    const staffResult = await controller.invokeCreateStaff(email, `${process.env.APP_URL}/signup`);
    if (!staffResult.success || !staffResult.data) return { success: staffResult.success, message: staffResult.message };

    const profileResult = await controller.invokeCreateProfile(staffResult.data, role);
    if (!profileResult.success) {
        const deleter = await controller.invokeDeleteStaff(staffResult.data);
        return { success: false, message: `Profile creation failed: ${profileResult.message}. Additionally, ${deleter.message}` };
    }

    return { success: true, message: "Staff invited" };
}

export async function finishRegistration(
    name: string,
    password: string
): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpRegisterModel(orm, adminSupa);
    const profiler = new ImpProfileGetter(database);

    const current = await profiler.getCurrentUser();
    if (!current.success || !current.data?.id) {
        return { success: false, message: current.message };
    }
    if (current.data.active === true) {
        return { success: false, message: "Already registered" };
    }

    const id = current.data.id;

    const passRes = await model.setPassword(id, password);
    if (!passRes.success) return passRes;

    const profileRes = await model.finishProfile(id, name);
    if (!profileRes.success) return profileRes;

    return { success: true, message: "Registration completed" };
}

export async function deleteStaffUser(id: string): Promise<ApiResponse> {
    const database = await serverSupa();
    const model = new ImpRegisterModel(orm, adminSupa);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpRegisterManager(model, profiler);
    const eventModel = new ImpEventModel(orm);
    const eventController = new ImpEventManager(eventModel, profiler);

    const guard = await eventController.invokeIsStaffOnOngoingEvent(id);
    if (!guard.success) return { success: false, message: guard.message };
    if (guard.data) {
        return { success: false, message: "Cannot delete: staff is assigned to an ongoing event" };
    }

    return await controller.invokeDeleteStaff(id);
}

export async function staffToggler(id: string): Promise<ApiResponse<boolean>> {
    const database = await serverSupa();
    const model = new ImpRegisterModel(orm, adminSupa);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpRegisterManager(model, profiler);
    const eventModel = new ImpEventModel(orm);
    const eventController = new ImpEventManager(eventModel, profiler);

    const current = await controller.invokeIsProfileComplete(id);
    if (!current.success) return { success: false, message: current.message };
    if (!current.data) return { success: false, message: "Profile not found" };
    
    if (current.data.active === true) {
        const guard = await eventController.invokeIsStaffOnOngoingEvent(id);
        if (!guard.success) return { success: false, message: guard.message };
        if (guard.data) {
            return { success: false, message: "Cannot deactivate: staff is assigned to an ongoing event" };
        }
    }

    if (current.data.active !== true && current.data.name.trim() === "") {
        return { success: false, message: "Cannot activate: staff has not completed registration" };
    }

    return await controller.invokeToggleStaff(id);
}

export async function establishInviteSession(
    accessToken: string,
    refreshToken: string
): Promise<ApiResponse> {
    const database = await serverSupa();

    const { data, error } = await database.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    if (error || !data.session) {
        return { success: false, message: error?.message ?? "Invite session could not be established" };
    }

    return { success: true, message: "Invite session established" };
}

export async function hasInviteSession(): Promise<ApiResponse<string>> {
    const database = await serverSupa();
    const profiler = new ImpProfileGetter(database);

    const current = await profiler.getCurrentUser();
    if (!current.success || !current.data?.id) {
        return { success: false, message: current.message };
    }

    return { success: true, message: "Invite session active", data: current.data.id };
}