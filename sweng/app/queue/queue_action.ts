"use server"

import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { ViewDonor } from "@/types/donor_type";
import { ViewQueue, QueueEntryWithDonor } from "@/types/queue_type";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { serverSupa } from "@/db/supaserver";
import { adminSupa } from "@/db/supaadmin";
import { bigintToStr } from "../global/serializer/serial";
import { StaffWithStatus } from "@/types/queue_type";
import { ImpDonorModel } from "../donoring/imp_donor_data";
import { ImpDonorManager } from "../donoring/imp_donor_controller";
import { ImpProfilesManager } from "../profiles/imp_profiles_controller";
import { ImpProfilesModel } from "../profiles/imp_profiles_data";
import { ImpAssignedStaffManager } from "../assigned_staff/imp_assigned_staff_controller";
import { ImpAssignedStaffModel } from "../assigned_staff/imp_assigned_staff_data";

export async function retrieveDonor(donor_info: bigint): Promise<ApiResponse<ViewDonor>> {
    const database = await serverSupa();
    const model = new ImpDonorModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpDonorManager(model, profiler);

    return bigintToStr(await controller.invokeGetSingleDonor({ id: donor_info }));
}

export async function viewQueueWithDonors(event_info_str: string): Promise<ApiResponse<QueueEntryWithDonor[]>> {
    try {
        const database = await serverSupa();
        const model = new ImpQueueModel(orm);
        const profiler = new ImpProfileGetter(database);
        const controller = new ImpQueueManager(model, profiler);
        const event_info_bigInt = BigInt(event_info_str)
        const donorModel = new ImpDonorModel(orm);
        const donorController = new ImpDonorManager(donorModel, profiler);

        const queueResult = await controller.invokeQueryQueue({ event_log_id: event_info_bigInt });

        if (!queueResult.success || !queueResult.data) return { success: queueResult.success, message: queueResult.message, data: undefined };

        if (queueResult.data.length === 0) return { success: true, message: queueResult.message, data: [] };
        
        const donor_ids = queueResult.data
        .map(entry => entry.donor_id)
        .filter((id): id is bigint => id !== null);

        const donors = await donorController.invokeGetDonorsByIds(donor_ids)
        if (!donors.success || !donors.data) return { success: false, message: donors.message };

        const donorMap = new Map(donors.data.map(d => [d.id, d]));

        const combined: QueueEntryWithDonor[] = queueResult.data.map(entry => ({
            ...entry,
            donor_profile: entry.donor_id ? donorMap.get(entry.donor_id) ?? null : null
        }));

        return bigintToStr({ success: true, message: "Queue retrieved", data: combined });

    } catch (err: any) {
        return { success: false, message: err.message }
    }
}

export async function pickNextDonor(event_log_id: bigint): Promise<ApiResponse<ViewQueue>> {
    const database = await serverSupa();
    const model = new ImpQueueModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpQueueManager(model, profiler);

    return bigintToStr(await controller.invokePickNextQueue(event_log_id));
}

export async function peekNextDonor(event_log_id: bigint): Promise<ApiResponse<ViewQueue>> {
    const database = await serverSupa();
    const model = new ImpQueueModel(orm);
    const profiler = new ImpProfileGetter(database);
    const controller = new ImpQueueManager(model, profiler);

    return bigintToStr(await controller.invokePeekNextQueue(event_log_id));
}

export async function viewStaffStatus(event_guy: bigint): Promise<ApiResponse<StaffWithStatus[]>> {
    try {

        const database = await serverSupa();
        const profiler = new ImpProfileGetter(database);
        const profile = await profiler.getCurrentUser();
        const profilesModel = new ImpProfilesModel(orm, adminSupa);
        const profilesController = new ImpProfilesManager(profilesModel, profiler);
        const staffModel = new ImpAssignedStaffModel(orm);
        const staffController = new ImpAssignedStaffManager(staffModel, profiler);
        const donorModel = new ImpDonorModel(orm);
        const donorController = new ImpDonorManager(donorModel, profiler);
        const queueModel = new ImpQueueModel(orm);
        const queueController = new ImpQueueManager(queueModel, profiler);

        if (!profile.success || !profile.data) return { success: false, message: profile.message };

        const assigned = await staffController.invokeGetStaff(event_guy);
        if (!assigned.success || !assigned.data) return { success: assigned.success, message: assigned.message };

        if (assigned.data.length === 0) return { success: assigned.success, message: assigned.message, data: [] };

        const currentUserAssigned = assigned.data.some(a => a.staff_id === profile.data!.id);
        if (!currentUserAssigned) return { success: false, message: "Not assigned to this event", data: [] };

        const profileIds = assigned.data.map(a => a.staff_id);
        const profilesResult = await profilesController.invokeGetProfiles(profileIds);
        if (!profilesResult.success || !profilesResult.data) return { success: profilesResult.success, message: profilesResult.message }
        
        const profileMap = new Map(profilesResult.data.map(p => [p.id, p]));
        
        const sameRoleStaff = assigned
            .data.map(a => profileMap.get(a.staff_id))
            .filter((p): p is typeof profilesResult.data[number] => p?.role === profile.data!.role);

        if (sameRoleStaff.length === 0) return { success: true, message: "No same-role staff assigned", data: [] };

        const busy = await queueController.invokeGetNullStations(event_guy);

        if (!busy.success || !busy.data) return { success: busy.success, message: busy.message };

        const busyByProfile = new Map(
            busy.data.map(b => [b.staff_id, b])
        );

        const busyDonorIds = busy
            .data.map(b => b.donor_id)
            .filter((id): id is bigint => id !== null
        );

        const busyDonors = await donorController.invokeGetDonorsByIds(busyDonorIds);
        if (!busyDonors.success || !busyDonors.data) return { success: busyDonors.success, message: busyDonors.message };

        const donorNameMap = new Map(
            busyDonors.data.map(d => [d.id, `${d.first_name} ${d.last_name}`])
        );

        const result: StaffWithStatus[] = sameRoleStaff.map(p => {
            const busyEntry = busyByProfile.get(p.id);
            const isBusy = busyEntry !== undefined;
            return {
                profiles_id: p.id,
                name: p.name,
                role: p.role,
                isBusy,
                queueEntryId: isBusy ? Number(busyEntry.id) : null,
                currentDonorId: isBusy && busyEntry.donor_id !== null ? Number(busyEntry.donor_id) : null,
                currentDonorName: isBusy && busyEntry.donor_id
                    ? donorNameMap.get(busyEntry.donor_id) ?? null
                    : null,
            };
        });

        return bigintToStr({ success: true, message: "Staff status retrieved", data: result });

    } catch (err: any) {
        return { success: false, message: err.message }
    }
}