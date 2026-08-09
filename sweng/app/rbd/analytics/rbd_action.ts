"use server"

import { ImpAnalyticsManager } from "./rbd_controller";
import { ImpAnalyticsData } from "./rbd_queries";
import { ImpProfileGetter } from "@/queries/profile_query";
import { serverSupa } from "@/db/supaserver";

async function getAnalyticsController() {

    const database = await serverSupa();
    const model = new ImpAnalyticsData();
    const profiler = new ImpProfileGetter(database);

    return new ImpAnalyticsManager(model, profiler);
}

export async function fetchDonorAnalytics(donorIdStr: string) {
    
    const analyticsController = await getAnalyticsController();

    return await analyticsController.invokeGetDonorAnalytics(donorIdStr);
}

export async function fetchFilteredDonors(filters: { 
        search?: string;
        bloodFilter?: string;
        sexFilter?: string;
        eligibilityFilter?: string;
        sortBy?: string;
    } = {}) {

    const analyticsController = await getAnalyticsController();

    return await analyticsController.invokeGetFilteredDonors(filters);
}

export async function fetchFilteredEvents(filters: { 
        search?: string;
        status?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {

    const analyticsController = await getAnalyticsController();

    return await analyticsController.invokeGetFilteredEvents(filters);
}

export async function fetchEventAnalytics(eventIdStr: string) {

    const analyticsController = await getAnalyticsController();

    return await analyticsController.invokeGetEventAnalytics(eventIdStr);
}

export async function fetchOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {

    const analyticsController = await getAnalyticsController();

    return await analyticsController.invokeGetOverallAnalytics(filters);
}