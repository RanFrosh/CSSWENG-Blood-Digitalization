import RoleChecker from "@/components/utils/RoleChecker";

export default async function MedProfLayout({
    children,
}: {
    children: React.ReactNode;
}) {
     return (
        <RoleChecker requiredRole="med_prof" displayRoleName="Med Prof">
            {children}
        </RoleChecker>
    );
}