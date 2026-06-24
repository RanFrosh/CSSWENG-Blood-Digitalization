import { AccessType } from "@/db/enums/access_level";

const permissions: Record<string, AccessType[]> = {
    'retrieve_donors': ['super_admin', 'med_prof'],
    'edit_donor': ['super_admin', 'med_prof'],
    'delete_donor': ['super_admin']
}

export type Actions = keyof typeof permissions;

export function hasPermission(userRole: AccessType, action: Actions): boolean {
    if (userRole === 'super_admin') return true;
    return permissions[action]?.includes(userRole) ?? false;
}