import { AccessType } from "@/db/enums/access_level";

const permissions: Record<string, AccessType[]> = {
    'retrieve_donors': ['med_prof'],
    'edit_donor': ['med_prof'],
    'delete_donor': [],
    'view_event': ['onsite_admin', 'med_prof', 'director', 'staff_admin'],
    'create_event': ['onsite_admin', 'med_prof', 'director', 'staff_admin'],
    'view_correct_event': ['onsite_admin', 'med_prof', 'director', 'staff_admin'],
    'create_correct_event': ['onsite_admin', 'med_prof', 'director', 'staff_admin']
};

export type Actions = keyof typeof permissions;

export function hasPermission(userRole: AccessType, action: Actions): boolean {
    if (userRole === 'super_admin') return true;
    return permissions[action]?.includes(userRole) ?? false;
}