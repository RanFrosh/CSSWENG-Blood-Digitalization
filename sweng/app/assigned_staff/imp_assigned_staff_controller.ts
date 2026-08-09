import { ApiResponse } from "@/types/api_res_type";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { helpGateKeep } from "../../utils/access/bouncer";
import { AssignedStaffController, AssignedStaffData } from "@/abstract/assigned_staff/assigned_staff_abstract";
import { ViewAssignedStaff } from "@/types/assigned_staff_type";

export class ImpAssignedStaffManager implements AssignedStaffController {
    private staffModel: AssignedStaffData
    private profileReader: ProfileSessionProvider

    constructor(injectStaffModel: AssignedStaffData, injectProfileReader: ProfileSessionProvider) {
        this.staffModel = injectStaffModel;
        this.profileReader = injectProfileReader;
    }

    async invokeGetStaff(event_id: bigint): Promise<ApiResponse<ViewAssignedStaff[]>> {
        const res = await helpGateKeep(this.profileReader, 'view_assigned_staff');
        if (!res.success || !res.data) return { success: false, message: res.message };
        return await this.staffModel.getStaff(event_id);        
    }
}