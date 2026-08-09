"use server";

import { ImpLoginProvider } from "./imp_login_provider";
import { ImpLoginController } from "./imp_login_controller";
import { ImpProfileGetter } from "../../queries/profile_query";
import { serverSupa } from "@/db/supaserver";

export async function executeLogin(email: string, pass: string) {

    const database = await serverSupa();

    const loginProvider = new ImpLoginProvider(database);
    const profileReader = new ImpProfileGetter(database);

    const loginController = new ImpLoginController(loginProvider, profileReader);

    return await loginController.invokeLogin(email, pass); 
}