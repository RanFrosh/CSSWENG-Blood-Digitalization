import { ApiResponse } from "@/types/api_res_type";
import { ViewDirectorStats } from "@/types/analytics_type";

export interface AnalyticsData {
    countActiveDonors(): Promise<number>;
    getDonorBloodTypeBreakdown(): Promise<any[]>;
    getDonorById(numericId: bigint): Promise<any | undefined>;
    getAllDonors(): Promise<any[]>;
    getEventsByStatus(status: string): Promise<any[]>;
    getEventById(numericId: bigint): Promise<any | undefined>;
}

export interface AnalyticsController {
    invokeGetDirectorStats(): Promise<ApiResponse<ViewDirectorStats>>
    invokeGetAllDonors(): Promise<ApiResponse<any>>; 
    invokeGetDonorAnalytics(donorIdStr: string): Promise<ApiResponse<any>>;
    invokeGetDirectorEvents(status: string): Promise<ApiResponse<any>>;
    invokeGetEventAnalytics(eventIdStr: string): Promise<ApiResponse<any>>;
}