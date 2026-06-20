import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const province = pgTable('province', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});