import { pgTable, text, bigserial } from "drizzle-orm/pg-core";

export const province = pgTable('province', {
    id: bigserial('id', { mode: "bigint" }).primaryKey(),
    name: text('name').notNull(),
});