"use server";

import { serverSupa } from "@/db/supaserver";
import { ImpLogoutProvider } from "./imp_logout_provider"; 
import { ImpLogoutController } from "./imp_logout_controller";

export async function executeLogout() {
    const database = await serverSupa();

    const logoutProvider = new ImpLogoutProvider(database);
    
    const logoutController = new ImpLogoutController(logoutProvider);

    return await logoutController.invokeLogout(); 
}