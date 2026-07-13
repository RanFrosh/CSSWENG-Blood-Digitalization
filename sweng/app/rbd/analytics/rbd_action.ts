"use server"

import { authenticate } from "@/app/global/access/authenticate";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";
import { ViewEventFilters } from "@/types/event_type";

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