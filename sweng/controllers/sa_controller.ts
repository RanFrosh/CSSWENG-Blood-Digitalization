import { ImpSuperAdminModel } from "@/queries/sa_query";
import { ProfileSessionProvider } from "./profile_controller";
import { SuperAdminController } from "@/abstract/sa/sa_abstract";

export class ImpSuperAdminManager implements SuperAdminController {

    private saModel: ImpSuperAdminModel;
    private profileReader: ProfileSessionProvider;
    
    constructor(injectSuperAdminModel: ImpSuperAdminModel, injectProfileReader: ProfileSessionProvider) {
        this.saModel = injectSuperAdminModel;
        this.profileReader = injectProfileReader;
    }

    async invokeFetchEventSummary(eventId: string) {
        try {
            if (!eventId) 
                return { success: false, message: "Event ID is required." };

            const res = await this.saModel.getEventById(eventId);
            
            if (!res.length) 
                return { success: false, message: "Event not found." };

            const event = res[0];
            return {
                success: true,
                data: {
                    id: String(event.id),
                    name: event.name,
                    partner: event.partner,
                    city: event.city_name || "Unknown",
                    event_date: event.event_date || "",
                    start_time: event.start_time || null, 
                    end_time: event.end_time || null
                },
                message: "Event summary retrieved",
            };
        } catch (error) {
            console.error("Controller Error (fetchEventSummary):", error);
            return { success: false, message: "Failed to process event summary." };
        }
    }

    async invokeFetchEventStaffLists(eventId: string) {
        try {
            const allStaff = await this.saModel.getEligibleStaff();
            
            const assignedIds = await this.saModel.getAssignedStaffIdsForEvent(eventId);

            const assignedStaff = allStaff.filter(staff => assignedIds.includes(staff.id));
            const availableStaff = allStaff.filter(staff => !assignedIds.includes(staff.id));

            return {
                success: true,
                data: { assignedStaff, availableStaff },
                message: "Event staff list retrieved",
            };
        } catch (error) {
            console.error("Controller Error (fetchEventStaffLists):", error);
            return { success: false, message: "Failed to process staff lists." };
        }
    }

    async invokeAssignStaffToEvent(eventId: string, staffIds: string[]) {
        try {
            if (!staffIds.length) return { success: false, message: "No staff selected." };
            await this.saModel.insertEventStaff(eventId, staffIds);
            return { success: true, message: "Staff assigned", };
        } catch (error) {
            console.error("Controller Error (assignStaffToEvent):", error);
            return { success: false, message: "Failed to assign staff." };
        }
    }

    async invokeRemoveStaffFromEvent(eventId: string, staffIds: string[]) {
        try {
            if (!staffIds.length) return { success: false, message: "No staff selected." };
            await this.saModel.deleteEventStaff(eventId, staffIds);
            return { success: true, message: "Staff removed from event", };
        } catch (error) {
            console.error("Controller Error (removeStaffFromEvent):", error);
            return { success: false, message: "Failed to remove staff." };
        }
    }

    async invokeFetchEditRequests() {
        try {
            const rawRequests = await this.saModel.getEditRequests();

            const formattedRequests = rawRequests.map(req => ({
                id: String(req.id),
                bloodBagSerial: req.blood_bag_serial,
                donorId: req.donor_id ? String(req.donor_id) : null,
                eventId: req.event_id ? String(req.event_id) : null,
                staffId: req.staff_id,
                staffName: `${req.staff_name || 'Unknown'}`.trim(),
                payload: req.payload,
                createdAt: req.created_at ?? new Date(),
                status: req.status, 
                admin_remarks: req.admin_remarks || undefined,
            }));

            return { 
                success: true, 
                data: formattedRequests,
                message: "Edit requests fetched"
            };
        } catch (error) {
            console.error("Controller Error (fetchEditRequests):", error);
            return { success: false, message: "Failed to fetch edit requests." };
        }
    }

    async invokeRejectEditRequest(requestId: string, adminId: string, remarks: string) {
        
        try {
            if (!requestId || !adminId || !remarks) return { success: false, message: "Missing required fields." };
            
            await this.saModel.rejectEditRequest(requestId, adminId, remarks);
            return { success: true, message: "Edit request rejected successfully." };
        } catch (error) {
            console.error("Controller Error (rejectRequest):", error);
            return { success: false, message: "Failed to reject request." };
        }
    }

    async invokeApproveEditRequest(requestId: string, adminId: string, remarks?: string) {
        
        try {
            if (!requestId || !adminId) return { success: false, message: "Missing required fields." };
            
            const reqData = await this.saModel.getEditRequestById(requestId);
            if (!reqData.length) return { success: false, message: "Request not found." };
            
            const targetRequest = reqData[0];
            
            await this.saModel.approveEditRequest(
                requestId, 
                adminId, 
                targetRequest.blood_bag_serial, 
                targetRequest.payload, 
                remarks
            );

            return { success: true, message: "Edit request approved and applied to database." };
        } catch (error) {
            console.error("Controller Error (approveRequest):", error);
            return { success: false, message: "Failed to apply edit request. Check payload format." };
        }
    }
}