import { ApiResponse } from "@/types/api_res_type";
import { ViewDirectorStats } from "@/types/analytics_type";

export interface AnalyticsData {
    countActiveDonors(): Promise<number>;
    getDonorBloodTypeBreakdown(): Promise<any[]>;
    getDonorById(numericId: bigint): Promise<any | undefined>;
    getAllDonors(): Promise<any[]>;
}

export interface AnalyticsController {
    invokeGetDirectorStats(): Promise<ApiResponse<ViewDirectorStats>>
}