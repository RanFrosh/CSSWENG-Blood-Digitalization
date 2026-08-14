import RoleChecker from "@/components/utils/RoleChecker";

export default async function SALayout({
    children,
}: {
    children: React.ReactNode;
}) {
     return (
        <RoleChecker requiredRole="super_admin" displayRoleName="Super Admin">
            {children}
        </RoleChecker>
    );
}