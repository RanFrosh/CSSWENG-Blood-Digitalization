import { pgEnum } from "drizzle-orm/pg-core";

export const biologicalBase = ['Male', 'Female'] as const;

export type BiologicalType = typeof biologicalBase[number];

export const biological_sex = pgEnum('biological_sex', biologicalBase);