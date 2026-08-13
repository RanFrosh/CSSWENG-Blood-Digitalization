import RoleChecker from "@/components/RoleChecker";

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