import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../global/helper_bouncer/bouncer";
import { LabStaffController, LabStaffData } from "@/abstract/ls/ls_abstract";

export class ImpLabStaffManager implements LabStaffController {
    
    private labStaffModel: LabStaffData;
    private profileReader: ProfileSessionProvider;

    constructor(injectLabStaffModel: LabStaffData, injectProfileReader: ProfileSessionProvider) {
        this.labStaffModel = injectLabStaffModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetStaffEvents(statusTab?: string) {

        const authRes = await helpGateKeep(this.profileReader, 'view_event');
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: authRes.message };
        }

        try {

            const events = await this.labStaffModel.getStaffEvents(authRes.data.id, statusTab);
            
            return {
                success: true,
                message: "Events retrieved",
                data: events
            };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async invokeVerifyEventAccess(eventIdStr: string) {

        const authRes = await helpGateKeep(this.profileReader, 'view_event');
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: authRes.message };
        }

        try {
            const numericEventId = BigInt(eventIdStr.replace(/\D/g, ''));
            
            const eventDetails = await this.labStaffModel.verifyAccess(authRes.data.id, numericEventId);

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

            const event = await this.labStaffModel.verifyAccess(staffId, numericEventId);
            
            if (!event) 
                return { success: false, message: "Not assigned to this event or it doesn't exist." };

            if (event.status === 'Completed') 
                return { success: false, message: "Event is already over." };

            if (event.status === 'Upcoming')
                 return { success: false, message: "Event has not yet started." };

            const rawQueue = await this.labStaffModel.getEventQueueWithDonors(numericEventId, station);

            const formattedQueue = rawQueue.map((row: any) => ({
                ...row.queue,
                donor_profile: row.donor || null
            }));

            return { 
                success: true, 
                message: "Queue retrieved", 
                data: formattedQueue 
            };

        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

}