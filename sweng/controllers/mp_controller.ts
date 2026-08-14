import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "@/utils/access/bouncer";
import { MPController, MPData } from "@/abstract/mp/mp_abstract";
import { ViewDonorPartial } from "@/types/donor_type";
import { UpdateQueue } from "@/types/queue_type";
import { DeleteQueue } from "@/types/queue_type";
import { executeLogEvent } from "@/actions/event_action";

export class ImpMPManager implements MPController {
    
    private mpModel: MPData;
    private profileReader: ProfileSessionProvider;

    constructor(injectLabStaffModel: MPData, injectProfileReader: ProfileSessionProvider) {
        this.mpModel = injectLabStaffModel;
        this.profileReader = injectProfileReader;
    }

    async invokeVerifyEventAccess(eventIdStr: string) {

        const authRes = await helpGateKeep(this.profileReader, 'view_event');
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: authRes.message };
        }

        try {
            const numericEventId = BigInt(eventIdStr.replace(/\D/g, ''));
            
            const eventDetails = await this.mpModel.verifyAccess(authRes.data.id, numericEventId);

            if (!eventDetails) {
                return { success: false, message: "You are not assigned to this event, or it does not exist." };
            }

            return {
                success: true,
                message: "Access verified",
                data: eventDetails
            };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async invokeGetQueue(eventIdStr: string, station?: string | null) {

        const authRes = await helpGateKeep(this.profileReader, 'viewqueue');
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: authRes.message };
        }

        try {
            const numericEventId = BigInt(eventIdStr.replace(/\D/g, ''));
            const staffId = authRes.data.id;

            const event = await this.mpModel.verifyAccess(staffId, numericEventId);
            
            if (!event) 
                return { success: false, message: "Not assigned to this event or it doesn't exist." };

            if (event.status === 'Completed') 
                return { success: false, message: "Event is already over." };

            if (event.status === 'Upcoming')
                 return { success: false, message: "Event has not yet started." };

            const rawQueue = await this.mpModel.getEventQueueWithDonors(numericEventId, station);

            const formattedQueue = rawQueue.map((row: any) => ({
                ...row.queue,
                donor_profile: row.donor || null
            }));

            return { 
                success: true, 
                message: "Queue retrieved", 
                data: {
                    eventName: event.name,
                    queue: formattedQueue 
                }
            };

        } catch (error: any) {
            return { success: false, message: error.message, data: null };
        }
    }

    async invokeGetStaffStatus(eventIdStr: string) {

        const authRes = await helpGateKeep(this.profileReader, 'viewqueue');
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: authRes.message };
        }

        try {
            const numericEventId = BigInt(eventIdStr.replace(/\D/g, ''));
            const staffId = authRes.data.id;

            const event = await this.mpModel.verifyAccess(staffId, numericEventId);

            if (!event) 
                return { success: false, message: "Not assigned to this event." };

            const rawStaffData = await this.mpModel.getStaffStatusForEvent(numericEventId, staffId);

            if (rawStaffData.length === 0) {
                return { success: false, message: "You are not assigned to this event" };
            }

            const myData = rawStaffData[0];
            const isBusy = !!myData?.queue;

            const formattedStaff = {
                profiles_id: myData.profile.id,
                name: myData.profile.name,
                role: myData.profile.role,
                isBusy: isBusy,
                queueEntryId: isBusy ? Number(myData.queue!.id) : null,
                currentDonorId: isBusy ? Number(myData.queue!.donor_id) : null,
                currentDonorName: (isBusy && myData.donor) 
                    ? `${myData.donor.first_name} ${myData.donor.last_name}` 
                    : null
            };

            return { success: true, message: "Status retrieved", data: formattedStaff };

        } catch (error: any) {
            return { success: false, message: error.message, data: null };
        }
    }

    async invokeUpdateQueueStation(queueTarget: UpdateQueue) {
            
            const res = await helpGateKeep(this.profileReader, 'updatequeue');
            if (!res.success || !res.data) 
                return { success: false, message: res.message }
    
            return await this.mpModel.updateQueueStation(queueTarget);
        }

    async invokeCompleteScreening(donorId: bigint, eventId: bigint) {
        try {
            const activeQueue = await this.mpModel.getActiveQueueByDonorAndEvent(donorId, eventId, 'med_queue');

            if (!activeQueue || activeQueue.length === 0) {
                return { success: false, message: "Could not find an active medical screening queue for this donor." };
            }

            const queueId = activeQueue[0].id;

            return await this.invokeUpdateQueueStation({
                id: queueId,
                station: 'lab_queue',
                staff_id: null, 
            });
        } catch (error: any) {
            console.error("Controller Error (invokeCompleteScreening):", error);
            return { success: false, message: "Failed to process screening completion." };
        }
    }

    async invokeDeleteQueue(donorTarget: DeleteQueue) {
            
        const res = await helpGateKeep(this.profileReader, 'dequeue');
        if (!res.success || !res.data) 
            return { success: false, message: res.message }

        const outcome = await this.mpModel.deleteQueue(donorTarget);
        return outcome;
    }

    async invokeFailScreening(donorId: bigint, eventId: bigint) {
        try {
            const activeQueue = await this.mpModel.getActiveQueueByDonorAndEvent(donorId, eventId, 'med_queue');

            if (!activeQueue || activeQueue.length === 0) {
                return { success: false, message: "Could not find an active medical screening queue for this donor." };
            }

            const queueId = activeQueue[0].id;

            const result = await this.invokeDeleteQueue({ id: queueId });

            if (result.success) {
                await executeLogEvent({
                    event_log_id: eventId,
                    donor_id: donorId,
                    action: "deferral",
                    time: new Date().toTimeString().slice(0, 8),
                });           
            }

            return result;
        } catch (error: any) {
            console.error("Controller Error (invokeFailScreening):", error);
            return { success: false, message: "Failed to process screening deferral." };
        }
    }
}