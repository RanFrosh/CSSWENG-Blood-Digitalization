import { AccessType } from "@/db/enums/access_level";
import { QueueStationType } from "@/db/enums/queue_station";

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
    'view_event': ['onsite_admin', 'med_prof', 'director', 'lab_staff', 'super_admin'] as AccessType[],
    'create_event': ['onsite_admin', 'med_prof', 'director', 'super_admin'] as AccessType[],
    'view_correct_event': ['onsite_admin', 'med_prof', 'director', 'super_admin'] as AccessType[],
    'create_correct_event': ['onsite_admin', 'med_prof', 'director', 'super_admin'] as AccessType[],
    'view_analytics': ['director'] as AccessType[],
    'enqueue': ['onsite_admin'] as AccessType[],
    'dequeue': ['onsite_admin', 'med_prof', 'recov_staff', 'lab_staff'] as AccessType[],
    'updatequeue': ['med_prof', 'lab_staff'] as AccessType[],
    'viewqueue': ['med_prof', 'lab_staff'] as AccessType[],
    'viewdonor': ['med_prof', 'lab_staff'] as AccessType[],
    'viewprofiles': ['med_prof', 'lab_staff'] as AccessType[],
    'view_assigned_staff': ['med_prof', 'lab_staff'] as AccessType[],
    'extraction': ['lab_staff'] as AccessType[],
    'register_user': [] as AccessType[],
    'finish_registration': ['director', 'lab_staff', 'med_prof', 'onsite_admin', 'recov_staff'] as AccessType[]
} satisfies Record<string, AccessType[]>;

const queueMapping = {
    'med_prof': 'med_queue' as QueueStationType,
    'lab_staff': 'lab_queue' as QueueStationType
} satisfies Partial<Record<AccessType, QueueStationType>>;

export type Actions = keyof typeof permissions;

export function hasPermission(userRole: AccessType, action: Actions): boolean {
    if (userRole === 'super_admin') return true;
    return permissions[action]?.includes(userRole) ?? false;
}

export function getQueueStation(role: AccessType): QueueStationType | undefined {
    return queueMapping[role as keyof typeof queueMapping];
}