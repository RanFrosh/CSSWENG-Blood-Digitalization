import { ApiResponse } from "@/types/api_res_type";
import { ViewDirectorStats } from "@/types/analytics_type";
import { BloodType } from "@/db/enums/blood_type";

export interface AnalyticsData {
    countActiveDonors(): Promise<number>;
    getDonorBloodTypeBreakdown(): Promise<any[]>;
}

export interface AnalyticsController {
    invokeGetDirectorStats(): Promise<ApiResponse<ViewDirectorStats>>
}