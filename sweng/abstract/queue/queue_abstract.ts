import { ApiResponse } from "@/types/api_res_type";


export interface EventData {
    queryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
}

export interface EventController {
    invokeQueryEvent(data: ViewEventFilters, sort: Sorter<ViewEvents>): Promise<ApiResponse<ViewEvents[]>>
}