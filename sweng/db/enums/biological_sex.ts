import { pgEnum } from "drizzle-orm/pg-core";

export const biological_sex = pgEnum('biological_sex', ['Male', 'Female']);