import { ApiResponse } from "@/types/api_res_type";
import { Sorter } from "@/types/sort_type";
import { ViewCorrections,
    ViewCorrectionFilters,
    CreateCorrectionFilters,
    ViewEvents,
    ViewEventFilters,
    CreateEvents } from "@/types/event_type";

export interface EventData {
    queryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
    createEvent(data: CreateEvents): Promise<ApiResponse>

    queryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>>
    createCorrection(data: CreateCorrectionFilters): Promise<ApiResponse>
}

export interface EventController {
    invokeQueryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
    invokeCreateEvent(data: CreateEvents): Promise<ApiResponse>

    invokeQueryCorrection(data: ViewCorrectionFilters, sort: Sorter<ViewCorrections>): Promise<ApiResponse<ViewCorrections[]>>
    invokeCreateCorrection(data: CreateCorrectionFilters): Promise<ApiResponse>
}