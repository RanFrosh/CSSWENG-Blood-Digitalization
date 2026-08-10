import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "@/utils/access/bouncer";
import { LabStaffController, LabStaffData } from "@/abstract/ls/ls_abstract";
import { ViewDonorPartial } from "@/types/donor_type";
import { SubmitDonationPayload } from "@/abstract/ls/ls_abstract";

export class ImpLabStaffManager implements LabStaffController {
    
    private labStaffModel: LabStaffData;
    private profileReader: ProfileSessionProvider;

    constructor(injectLabStaffModel: LabStaffData, injectProfileReader: ProfileSessionProvider) {
        this.labStaffModel = injectLabStaffModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetStaffEvents(filters: { 
        search?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {

        const authRes = await helpGateKeep(this.profileReader, 'view_event');
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: authRes.message };
        }

        try {

            const events = await this.labStaffModel.getStaffEvents(authRes.data.id, filters);
            
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

            const event = await this.labStaffModel.verifyAccess(staffId, numericEventId);

            if (!event) 
                return { success: false, message: "Not assigned to this event." };

            const rawStaffData = await this.labStaffModel.getStaffStatusForEvent(numericEventId, staffId);

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

    async invokeAcceptDonor(queueIdStr: string, eventIdStr: string) {

        const authRes = await helpGateKeep(this.profileReader, 'viewqueue'); 
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: authRes.message };
        }

        try {
            const numericQueueId = BigInt(queueIdStr);
            const numericEventId = BigInt(eventIdStr.replace(/\D/g, ''));
            const staffId = authRes.data.id;

            const event = await this.labStaffModel.verifyAccess(staffId, numericEventId);

            if (!event) 
                return { success: false, message: "Not assigned to this event." };

            const claimed = await this.labStaffModel.acceptDonor(numericQueueId, staffId);
            
            if (claimed.length === 0) {
                return { 
                    success: false, 
                    message: "Someone else just claimed this donor! Please close and refresh the queue." 
                };
            }

            return { success: true, message: "Donor claimed successfully", data: claimed[0] };

        } catch (error: any) {
            console.error("Claim Donor Error:", error);
            return { success: false, message: "An error occurred while claiming the donor." };
        }
    }

    async invokeGetSingleDonor(filter: ViewDonorPartial) {

        const res = await helpGateKeep(this.profileReader, 'viewdonor');

        if (!res.success || !res.data) 
            return { success: false, message: res.message };
        
        return await this.labStaffModel.getSingleDonor(filter);        
    }

    async invokeValidateExtractionAccess(staffId: string, eventId: bigint, donorId: bigint) {

        const res = await helpGateKeep(this.profileReader, 'extraction');

        if (!res.success || !res.data) 
            return { success: false, message: res.message };

        return await this.labStaffModel.validateExtractionAccess(staffId, eventId, donorId);
    }

    async invokeSubmitDonationRecord(payload: Omit<SubmitDonationPayload, 'staff_id'>) {
    
        if (payload.volume > 450) {
            return { success: false, message: "Invalid submission: Volume cannot exceed 450 mL." };
        }

        const auth = await helpGateKeep(this.profileReader, 'extraction');
        
        if (!auth.success || !auth.data) {
            return { success: false, message: auth.message };
        }

        const securePayload: SubmitDonationPayload = {
            ...payload,
            staff_id: auth.data.id
        };

        return await this.labStaffModel.submitDonationRecord(securePayload);
    }

    async invokeGetEventDonors(eventId: string) {

        const authRes = await this.profileReader.getCurrentUser();
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: "Unauthorized. Please log in." };
        }

        if (!eventId) {
            return { success: false, message: "Event ID is required to fetch donors." };
        }

        try {
            return await this.labStaffModel.getEventDonors(eventId);
        } catch (error: any) {
            console.error("Controller Error (invokeGetEventDonors):", error);
            return { success: false, message: error.message || "Failed to fetch event donors." };
        }
    }

}