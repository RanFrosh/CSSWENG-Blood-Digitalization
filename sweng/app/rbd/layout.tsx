import RoleChecker from "@/components/utils/RoleChecker";

export default async function DirectorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleChecker requiredRole="director" displayRoleName="Director">
            {children}
        </RoleChecker>
    );
}