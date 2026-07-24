import { ApiResponse } from "@/types/api_res_type";

export interface AnalyticsData {
    getDonorById(numericId: bigint): Promise<any | undefined>;
    getFilteredDonors(search: string, bloodFilter: string, sexFilter: string, sortBy: string): Promise<any>;
    getLatestVisit(numericId: bigint): Promise<any>;
    getDonorMetrics(numericId: bigint): Promise<any>;
    getEventById(numericId: bigint): Promise<any | undefined>;
    getFilteredEvents(status: string, search: string, sortBy: string): Promise<any>;
    getEventAnalyticsData(eventIdStr: string): Promise<any>;
    countActiveDonors(eventWhereClause: any): Promise<number>;
    getDonorBloodTypeBreakdown(eventWhereClause: any): Promise<any[]>;
    getOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        sortBy?: string;     
    }): Promise<any>;
}

export interface AnalyticsController {
    invokeGetFilteredDonors(search: string, bloodFilter: string, sexFilter: string, sortBy: string): Promise<ApiResponse<any>>; 
    invokeGetDonorAnalytics(donorIdStr: string): Promise<ApiResponse<any>>;
    invokeGetFilteredEvents(search: string, status: string, sortBy: string): Promise<ApiResponse<any>>;
    invokeGetEventAnalytics(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeGetOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        sortBy?: string;     
    }): Promise<any>;
}