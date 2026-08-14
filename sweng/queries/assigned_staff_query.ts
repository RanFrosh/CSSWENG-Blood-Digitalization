import { ApiResponse } from "@/types/api_res_type";
import { eq } from "drizzle-orm";
import { orm } from "@/db/drizzle";
import { assigned_staff } from "@/db/schemas/assigned_staff";
import { ViewAssignedStaff } from "@/types/assigned_staff_type";
import { AssignedStaffData } from "@/abstract/assigned_staff/assigned_staff_abstract";

export class ImpAssignedStaffModel implements AssignedStaffData {
    private access: typeof orm;

    constructor(injectAccess: typeof orm) {
        this.access = injectAccess;
    }

    async getStaff(event_id: bigint): Promise<ApiResponse<ViewAssignedStaff[]>> {
        try {
            const assigned = await this.access
            .select()
            .from(assigned_staff)
            .where(eq(assigned_staff.event_log_id, event_id));

            if (assigned.length === 0) return { success: true, message: "No staff assigned", data: [] };

            return { success: true, message: "Returning list of staff for event", data: assigned };
        } catch (err: any) {
            return { success: false, message: err.message };            
        }
        
    }
}