import RoleChecker from "@/components/RoleChecker";

export default async function MedProfLayout({
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