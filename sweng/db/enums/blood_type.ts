import { pgEnum } from "drizzle-orm/pg-core";

export const bloodBase = ['A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-'
    ] as const;

export type BloodType = typeof bloodBase[number];

export const blood_type = pgEnum('blood_type', bloodBase);