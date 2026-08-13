import { ApiResponse } from "@/types/api_res_type";
import { Sorter } from "@/types/sort_type";
import { ViewCorrections,
    ViewCorrectionFilters,
    ViewEvents,
    ViewEventsWithProvince,
    ViewEventFilters,
    CreateEvents, 
    CreateCorrections,
    CreateEventRecords,
    ViewEventRecords,
    ViewCities,
    UpdateEvents} from "@/types/event_type";
import { ViewAssignedStaffFilter } from "@/types/assigned_staff_type";

export interface EventData {
    queryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
    queryAllEvents(): Promise<ApiResponse<ViewEventsWithProvince[]>>
    createEvent(data: CreateEvents): Promise<ApiResponse>
    logEvent(data: CreateEventRecords): Promise<ApiResponse>
    queryEventRecords(event_log_id: bigint): Promise<ApiResponse<ViewEventRecords[]>>
    queryEventStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter): Promise<ApiResponse<ViewEventsWithProvince[]>>

    queryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>>
    createCorrection(data: CreateCorrections): Promise<ApiResponse>

    queryEventById(id: bigint): Promise<ApiResponse<ViewEventsWithProvince>>
    isStaffOnOngoingEvent(staff_id: string): Promise<ApiResponse<boolean>>;
    getProvince(provinceName: string): Promise<ApiResponse<bigint>>;
    getCity(cityName: string): Promise<ApiResponse<bigint>>;
    getAllCities(): Promise<ApiResponse<ViewCities[]>>;
    updateEvent(id: bigint, data: UpdateEvents): Promise<ApiResponse>;
    deleteEvent(id: bigint): Promise<ApiResponse>;
    updateEventStatuses(): Promise<ApiResponse<number>>;
}

export interface EventController {
    invokeQueryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
    invokeQueryAllEvents(): Promise<ApiResponse<ViewEventsWithProvince[]>>
    invokeCreateEvent(data: CreateEvents): Promise<ApiResponse>
    invokeLogEvent(data: Omit<CreateEventRecords, 'staff_id'>): Promise<ApiResponse>
    invokeQueryEventRecords(event_log_id: bigint): Promise<ApiResponse<ViewEventRecords[]>>
    invokeQueryEventStaff(data: ViewEventFilters, staff: ViewAssignedStaffFilter): Promise<ApiResponse<ViewEventsWithProvince[]>>

    invokeQueryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>>
    invokeCreateCorrection(data: Omit<CreateCorrections, 'ref_profile_id'>): Promise<ApiResponse>

    invokeVerifyEventAccess(event_log_id: bigint): Promise<ApiResponse<ViewEventsWithProvince>>
    invokeIsStaffOnOngoingEvent(staff_id: string): Promise<ApiResponse<boolean>>;
    invokeGetProvince(provinceName: string): Promise<ApiResponse<bigint>>;
    invokeGetCity(cityName: string): Promise<ApiResponse<bigint>>;
    invokeGetAllCities(): Promise<ApiResponse<ViewCities[]>>;
    invokeUpdateEvent(id: bigint, data: UpdateEvents): Promise<ApiResponse>;
    invokeDeleteEvent(id: bigint): Promise<ApiResponse>;
    invokeUpdateEventStatuses(): Promise<ApiResponse<number>>;
}