import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/queries/profile_query";
import { helpGateKeep } from "./bouncer";
import { Actions } from "./permissions";
import { ApiResponse } from "@/types/api_res_type";

export async function authenticate(
    actionType: Actions, 
    businessLogic: (userId: string) => Promise<ApiResponse<any>>
) {
    const database = await serverSupa();
    const profiler = new ImpProfileGetter(database);
    
    const auth = await helpGateKeep(profiler, actionType);
    if (!auth.success || !auth.data) {
        return { success: false, message: auth.message };
    }

    return businessLogic(auth.data.id);
}