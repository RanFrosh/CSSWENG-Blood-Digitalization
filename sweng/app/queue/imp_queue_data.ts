import { ApiResponse } from "@/types/api_res_type";
import { SQL, eq, asc, and, isNull } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { QueueData } from "@/abstract/queue/queue_abstract";
import { ViewQueueFilters, ViewQueue, DeleteQueue, CreateQueue, UpdateQueue } from "@/types/queue_type";
import { event_queue } from "@/db/schemas/event_queue";
import { event_log } from "@/db/schemas/event_log";
import { assigned_staff } from "@/db/schemas/assigned_staff";

export class ImpQueueModel implements QueueData {
    private access: typeof orm;

    constructor(injectAccess: typeof orm) {
        this.access = injectAccess;
    }

    async queryQueue(filterer: ViewQueueFilters): Promise<ApiResponse<ViewQueue[]>> {
        try {
            if (!filterer.event_log_id) {
                return { success: false, message: "Missing event", data: undefined };
            }

            if (filterer.staff_id) {
                const assignment = await this.access
                .select()
                .from(assigned_staff)
                .where(
                    and(
                        eq(assigned_staff.staff_id, filterer.staff_id),
                        eq(assigned_staff.event_log_id, filterer.event_log_id)
                    )
                )
                .limit(1);

                if (assignment.length === 0) return { success: false, message: "Not assigned to this event", data: undefined }
            }
            
            const event = await this.access
            .select()
            .from(event_log)
            .where(
                and(
                    eq(event_log.id, filterer.event_log_id)
                )
            )
            .limit(1);

            if (event.length === 0) return { success: false, message: "Event does not exist", data: undefined }

            if (event[0].status === 'Completed') return { success: false, message: "Event is already over", data: undefined }

            if (event[0].status === 'Upcoming') return { success: false, message: "Event has not yet started", data: undefined }

            const conditions: SQL[] = [eq(event_queue.event_log_id, filterer.event_log_id)];
            if (filterer.donor_id !== undefined && filterer.donor_id !== null) {
                conditions.push(eq(event_queue.donor_id, filterer.donor_id));
            }
            if (filterer.station !== undefined) {
                if (filterer.station === null) {
                    conditions.push(isNull(event_queue.station));
                } else {
                    conditions.push(eq(event_queue.station, filterer.station));
                }
            }

            const queue = await this.access
            .select()
            .from(event_queue)
            .where(and(...conditions))
            .orderBy(asc(event_queue.id));

            if (queue.length === 0) return { success: true, message: "Queue is empty", data: [] }

            return { success: true, message: "Queue retrieved", data: queue }

        } catch (err: any) {
            return { success: false, message: err.message, data: undefined }
        }
    }

    async deleteQueue(donorTarget: DeleteQueue): Promise<ApiResponse> {
        try {
            await this.access
            .delete(event_queue)
            .where(eq(event_queue.id, donorTarget.id));

            return { success: true, message: "Donor dequeued" };
        } catch (err: any) {
            return { success: false, message: err.message }
        }     
    }

    async addToQueue(queueTarget: CreateQueue): Promise<ApiResponse> {
        try {
            await this.access
            .insert(event_queue)
            .values({ ...queueTarget, station: 'med_queue' })

            return { success: true, message: "Donor enqueued" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }     
    }

    async updateQueueStation(queueTarget: UpdateQueue): Promise<ApiResponse> {
        try {
            await this.access
            .update(event_queue)
            .set({
                station: queueTarget.station,
                staff_id: queueTarget.staff_id
            })
            .where(eq(event_queue.id, queueTarget.id));          

            return { success: true, message: 'Donor station updated' };
        } catch (err: any) {
            return { success: false, message: err.message };
        }    
    }

    async getNullStations(event_guy: bigint): Promise<ApiResponse<ViewQueue[]>> {
        try {
            const busy = await this.access
            .select()
            .from(event_queue)
            .where(
                and(
                    eq(event_queue.event_log_id, event_guy),
                    isNull(event_queue.station)
                )
            );

            if (busy.length === 0) return { success: true, message: "No donors with null stations", data: [] };

            return { success: true, message: "Returning list of donors being handled by a staff", data: busy };
        } catch (err: any) {
            return { success: false, message: err.message }
        }
    }


}