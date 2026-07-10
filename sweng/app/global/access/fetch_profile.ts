"use server";

import { serverSupa } from "@/db/supaserver"; 
import { ImpProfileGetter } from "../query_session.ts/query_user";

export async function fetch_profile() {

    const database = await serverSupa();
    
    const profileReader = new ImpProfileGetter(database);
    
    return await profileReader.getCurrentUser();
}