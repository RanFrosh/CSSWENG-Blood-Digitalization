"use server";

import { ImpAnalyticsManager } from "./analytics_controller";
import { ImpAnalyticsData } from "./analytics_queries";
import { ImpProfileGetter } from "../global/query_session.ts/query_user";
import { serverSupa } from "@/db/supaserver";

export async function fetchDirectorDashboardStats() {

    const dataLayer = new ImpAnalyticsData();

    const supabaseClient = await serverSupa();
    const authProvider = new ImpProfileGetter(supabaseClient)

    const analyticsController = new ImpAnalyticsManager(dataLayer, authProvider);

    return await analyticsController.invokeGetDirectorStats();
}