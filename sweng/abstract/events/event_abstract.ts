import { ApiResponse } from "@/types/api_res_type";
import { Sorter } from "@/types/sort_type";
import { ViewCorrections,
    ViewCorrectionFilters,
    ViewEvents,
    ViewEventFilters,
    CreateEvents, 
    CreateCorrections} from "@/types/event_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";

export interface EventData {
    queryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
    createEvent(data: CreateEvents): Promise<ApiResponse>
    queryEventStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter): Promise<ApiResponse<ViewEvents[]>>

    queryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>>
    createCorrection(data: CreateCorrections): Promise<ApiResponse>
}

export interface EventController {
    invokeQueryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
    invokeCreateEvent(data: CreateEvents): Promise<ApiResponse>
    invokeQueryEventStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter): Promise<ApiResponse<ViewEvents[]>>

    invokeQueryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>>
    invokeCreateCorrection(data: Omit<CreateCorrections, 'ref_profile_id'>): Promise<ApiResponse>
}