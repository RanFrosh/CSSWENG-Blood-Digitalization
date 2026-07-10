import { AccessType } from "@/db/enums/access_level";

const permissions = {
    'retrieve_donors': ['med_prof'] as AccessType[],
    'edit_donor': ['med_prof'] as AccessType[],
    'delete_donor': [] as AccessType[],
    'view_event': ['onsite_admin', 'med_prof', 'director', 'super_admin'] as AccessType[],
    'create_event': ['onsite_admin', 'med_prof', 'director', 'super_admin'] as AccessType[],
    'view_correct_event': ['onsite_admin', 'med_prof', 'director', 'super_admin'] as AccessType[],
    'create_correct_event': ['onsite_admin', 'med_prof', 'director', 'super_admin'] as AccessType[],
    'view_analytics': ['director'] as AccessType[]
} satisfies Record<string, AccessType[]>;

export type Actions = keyof typeof permissions;

export function hasPermission(userRole: AccessType, action: Actions): boolean {
    if (userRole === 'super_admin') return true;
    return permissions[action]?.includes(userRole) ?? false;
}