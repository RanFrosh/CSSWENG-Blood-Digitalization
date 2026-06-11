import { pgEnum } from "drizzle-orm/pg-core";

export const access_level = pgEnum('access_level',
    ['donor',
        'onsite_admin',
        'med_prof',
        'director',
        'super_admin',
        'staff_admin'
    ]);


export const ALL_ROLES = [
  'donor',
  'onsite_admin',
  'med_prof',
  'director',
  'super_admin',
  'staff_admin',
] as const;

export type Role = typeof ALL_ROLES[number];
export type NonSuperAdminRole = Exclude<Role, 'super_admin'>;

export const NON_SUPER_ADMIN_ROLES = ALL_ROLES.filter(
    role => role !== 'super_admin'
) as Exclude<Role, 'super_admin'>[];