"use server"

import { authenticate } from "@/app/global/access/authenticate";
import { ViewEventFilters } from "@/types/event_type";
import { ImpAnalyticsManager } from "./rbd_controller";
import { ImpAnalyticsData } from "./rbd_queries";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { serverSupa } from "@/db/supaserver";

export async function fetchDonorAnalytics(donorIdStr: string) {
    
    const dataLayer = new ImpAnalyticsData();

    const supabaseClient = await serverSupa();
    const authProvider = new ImpProfileGetter(supabaseClient)

    const analyticsController = new ImpAnalyticsManager(dataLayer, authProvider);

    return await analyticsController.invokeGetDonorAnalytics(donorIdStr);
}

export async function fetchFilteredDonors(search: string, bloodFilter: string, sexFilter: string, sortBy: string) {

    const dataLayer = new ImpAnalyticsData();

    const supabaseClient = await serverSupa();
    const authProvider = new ImpProfileGetter(supabaseClient)

    const analyticsController = new ImpAnalyticsManager(dataLayer, authProvider);

    return await analyticsController.invokeGetFilteredDonors(search, bloodFilter, sexFilter, sortBy);
}

export async function fetchFilteredEvents(filters: { 
        search?: string;
        status?: string;
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {

    const dataLayer = new ImpAnalyticsData();
    const supabaseClient = await serverSupa();
    const authProvider = new ImpProfileGetter(supabaseClient);
    
    const eventController = new ImpAnalyticsManager(dataLayer, authProvider);

    return await eventController.invokeGetFilteredEvents(filters);
}

export async function fetchEventAnalytics(eventIdStr: string) {

    const dataLayer = new ImpAnalyticsData();
    const supabaseClient = await serverSupa();
    const authProvider = new ImpProfileGetter(supabaseClient);
    
    const eventController = new ImpAnalyticsManager(dataLayer, authProvider);

    return await eventController.invokeGetEventAnalytics(eventIdStr);
}

export async function fetchOverallAnalytics(filters: { 
        startDate?: string; 
        endDate?: string; 
        partner?: string;
        selectedCity?: string;
        sortBy?: string;
    } = {}) {

    const dataLayer = new ImpAnalyticsData();

    const supabaseClient = await serverSupa();
    const authProvider = new ImpProfileGetter(supabaseClient)

    const analyticsController = new ImpAnalyticsManager(dataLayer, authProvider);

    return await analyticsController.invokeGetOverallAnalytics(filters);
}

export async function checkAuthentication(data?: ViewEventFilters) {
    
    return authenticate('access_rbd_page', async (userId) => {
        
        
        /* const model = new ImpLabModel(orm);
        const controller = new ImpLabController(model);
        return controller.getQueue(userId); */

        await new Promise(resolve => setTimeout(resolve, 800));

        // Hardcoded
        return {
            success: true,
            message: "Mock OA data loaded successfully",
            data: [
                { 
                    id: 1, 
                    eventName: "Campus Blood Drive", 
                    status: "Ongoing", 
                    donorsWaiting: 12 
                },
                { 
                    id: 2, 
                    eventName: "Community Center Drive", 
                    status: "Upcoming", 
                    donorsWaiting: 0 
                }
            ]
        };
    })
}