import RoleChecker from "@/components/utils/RoleChecker";

export default async function LabStaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
     return (
        <RoleChecker requiredRole="lab_staff" displayRoleName="Lab Staff">
            {children}
        </RoleChecker>
    );
}