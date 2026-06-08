import { pgEnum } from "drizzle-orm/pg-core";

export const access_level = pgEnum('access_level',
    ['donor',
        'onsite_admin',
        'med_prof',
        'director',
        'super_admin',
        'staff_admin'
    ]);