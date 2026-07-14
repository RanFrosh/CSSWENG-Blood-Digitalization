import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/app/global/query_session.ts/query_user";
import { helpGateKeep } from "../helper_bouncer/bouncer";
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