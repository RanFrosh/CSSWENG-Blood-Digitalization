import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { hasPermission } from "./permissions";
import { Actions } from "./permissions";

export async function helpGateKeep(checker: ProfileSessionProvider, action: Actions) {

    const res = await checker.getCurrentUser();

    if (!res.success) 
        return { success: false, message: res.message};

    if (!res.data?.role) 
        return { success: false, message: "Failed to identify role"};

    if (!hasPermission(res.data.role, action)) 
        return { success: false, message: "Not authorized"};

    return { success: true, message: "Authorized", data: res.data }
}