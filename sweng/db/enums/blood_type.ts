import { pgEnum } from "drizzle-orm/pg-core";

export const blood_type = pgEnum('blood_type',
    ['A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-'
    ]);