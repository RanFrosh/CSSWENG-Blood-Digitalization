import RoleChecker from "@/components/utils/RoleChecker";

export default async function RSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
     return (
        <RoleChecker requiredRole="recov_staff" displayRoleName="Recov Staff">
            {children}
        </RoleChecker>
    );
}