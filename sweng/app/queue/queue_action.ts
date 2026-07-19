"use server"

import { ApiResponse } from "@/types/api_res_type";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { ViewDonor } from "@/types/donor_type";
import { ViewQueue, QueueEntryWithDonor } from "@/types/queue_type";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { serverSupa } from "@/db/supaserver";
import { bigintToStr } from "../global/serializer/serial";
import { StaffWithStatus } from "@/types/queue_type";
import { profiles } from "@/db/models/profiles";
import { assigned_staff } from "@/db/models/assigned_staff";
import { event_queue } from "@/db/models/event_queue";
import { ImpDonorModel } from "../donoring/imp_donor_data";
import { ImpDonorManager } from "../donoring/imp_donor_controller";
import { ImpProfilesManager } from "../profiles/imp_profiles_controller";
import { ImpProfilesModel } from "../profiles/imp_profiles_data";

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

        const queueResult = await controller.invokeQueryQueue({ event_log_id: event_info_bigInt });

        if (!queueResult.success || !queueResult.data) return { success: queueResult.success, message: queueResult.message, data: undefined };

        if (queueResult.data.length === 0) return { success: true, message: queueResult.message, data: [] };
        
        const donor_ids = queueResult.data
        .map(entry => entry.donor_id)
        .filter((id): id is bigint => id !== null);

        const donors = donor_ids.length > 0
            ? await orm.select().from(donor).where(inArray(donor.id, donor_ids))
            : [];

        const donorMap = new Map(donors.map(d => [d.id, d]));

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
        const profilesModel = new ImpProfilesModel(orm);
        const profilesController = new ImpProfilesManager(profilesModel, profiler);

        if (!profile.success || !profile.data) return { success: false, message: profile.message };

        const assigned = await orm
        .select()
        .from(assigned_staff)
        .where(eq(assigned_staff.event_log_id, event_guy));

        if (assigned.length === 0) return { success: true, message: "No staff assigned", data: [] };

        const currentUserAssigned = assigned.some(a => a.profiles_id === profile.data!.id);
        if (!currentUserAssigned) return { success: false, message: "Not assigned to this event", data: [] };

        const profileIds = assigned.map(a => a.profiles_id);
        const profilesResult = await profilesController.invokeGetProfiles(profileIds);
        if (!profilesResult.success || !profilesResult.data) return { success: profilesResult.success, message: profilesResult.message }
        
        const profileMap = new Map(profilesResult.data.map(p => [p.id, p]));
        
        const sameRoleStaff = assigned
            .map(a => profileMap.get(a.profiles_id))
            .filter((p): p is typeof profilesResult.data[number] => p?.role === profile.data!.role);

        if (sameRoleStaff.length === 0) return { success: true, message: "No same-role staff assigned", data: [] };

        const busy = await orm
            .select()
            .from(event_queue)
            .where(
                and(
                    eq(event_queue.event_log_id, event_guy),
                    isNull(event_queue.station)
                )
            );

        const busyByProfile = new Map(
            busy.map(b => [b.profile_id, b])
        );

        const busyDonorIds = busy
            .map(b => b.donor_id)
            .filter((id): id is bigint => id !== null
        );

        const busyDonors = busyDonorIds.length > 0
            ? await orm.select().from(donor).where(inArray(donor.id, busyDonorIds))
            : [];

        const donorNameMap = new Map(
            busyDonors.map(d => [d.id, `${d.first_name} ${d.last_name}`])
        );

        const result: StaffWithStatus[] = sameRoleStaff.map(p => {
            const busyEntry = busyByProfile.get(p.id);
            const isBusy = busyEntry !== undefined;
            return {
                profiles_id: p.id,
                name: p.name,
                role: p.role,
                isBusy,
                queueEntryId: isBusy ? busyEntry.id : null,
                currentDonorId: isBusy ? busyEntry.donor_id ?? null : null,
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