import { pgEnum } from "drizzle-orm/pg-core";

export const biologicalBase = ['male', 'female'] as const;

export type BiologicalType = typeof biologicalBase[number];

export const biological_sex = pgEnum('biological_sex', biologicalBase);