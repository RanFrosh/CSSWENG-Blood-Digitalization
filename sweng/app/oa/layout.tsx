import RoleChecker from "@/components/utils/RoleChecker";

export default async function OALayout({
    children,
}: {
    children: React.ReactNode;
}) {
     return (
        <RoleChecker requiredRole="onsite_admin" displayRoleName="Onsite Admin">
            {children}
        </RoleChecker>
    );
}