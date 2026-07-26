import { ApiResponse } from "@/types/api_res_type";

export interface AnalyticsData {
    getDonorById(numericId: bigint): Promise<any | undefined>;
    getFilteredDonors(filters: { 
        search?: string;
        bloodFilter?: string;
        sexFilter?: string;
        eligibilityFilter?: string;
        sortBy?: string;
    }): Promise<any>;
    getLatestVisit(numericId: bigint): Promise<any>;
    getDonorMetrics(numericId: bigint): Promise<any>;
    getEventById(numericId: bigint): Promise<any | undefined>;
    getFilteredEvents(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;     
    }): Promise<any>;
    getEventAnalyticsData(eventIdStr: string): Promise<any>;
    countActiveDonors(eventWhereClause: any): Promise<number>;
    getDonorBloodTypeBreakdown(eventWhereClause: any): Promise<any[]>;
    getOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;     
    }): Promise<any>;
}

export interface AnalyticsController {
    invokeGetFilteredDonors(filters: { 
        search?: string;
        bloodFilter?: string;
        sexFilter?: string;
        eligibilityFilter?: string;
        sortBy?: string;
    }): Promise<ApiResponse<any>>; 
    invokeGetDonorAnalytics(donorIdStr: string): Promise<ApiResponse<any>>;
    invokeGetFilteredEvents(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;     
    }): Promise<ApiResponse<any>>;
    invokeGetEventAnalytics(eventIdStr: string): Promise<ApiResponse<any>>;
    invokeGetOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;     
    }): Promise<any>;
}