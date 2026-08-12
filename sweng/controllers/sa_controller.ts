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
            if (!eventId) return { success: false, message: "Event ID is required." };

            const res = await this.saModel.getEventById(eventId);
            if (!res.length) return { success: false, message: "Event not found." };

            const event = res[0];
            return {
                success: true,
                data: {
                    id: String(event.id),
                    name: event.name,
                    partner: event.partner,
                    city: event.city_name,
                    date: event.event_date,
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
}