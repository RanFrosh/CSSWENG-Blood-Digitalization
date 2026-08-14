import { redirect } from "next/navigation";
import AccessDenied from "@/components/utils/AccessDenied";
import { getProfileAction } from "@/actions/profile_action";

export default async function RoleChecker({
    requiredRole,
    displayRoleName,
    children,
}: {
    requiredRole: string;
    displayRoleName: string;
    children: React.ReactNode;
}) {

    const res = await getProfileAction();

    if (!res.success || !res.data) {
        redirect("/landing");
    }

    const currentRole = res.data.role;

    if (currentRole !== requiredRole) {
        return (
            <AccessDenied 
                requiredRole={displayRoleName} 
                currentRole={currentRole} 
            />
        );
    }

    return <>{children}</>;
}