import { pgEnum } from "drizzle-orm/pg-core";

export const accessBase = [
    'donor',
    'onsite_admin',
    'med_prof',
    'director',
    'super_admin',
    'staff_admin'
] as const;

export type AccessType = typeof accessBase[number];

export const access_level = pgEnum('access_level', accessBase);