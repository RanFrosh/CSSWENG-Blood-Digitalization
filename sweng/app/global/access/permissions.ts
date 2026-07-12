import { AccessType } from "@/db/enums/access_level";

const permissions = {
    'access_oa_page': ['onsite_admin'] as AccessType[],
    'access_mp_page': ['med_prof'] as AccessType[],
    'access_rbd_page': ['director'] as AccessType[],
    'access_sa_page': ['super_admin'] as AccessType[],
    'access_ls_page': ['lab_staff'] as AccessType[],
    'access_rs_page': ['recov_staff'] as AccessType[],
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