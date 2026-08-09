import { pgTable, text, bigint, bigserial } from "drizzle-orm/pg-core";
import { province } from "./province";

export const city = pgTable('city', {
    id: bigserial('id', { mode: "bigint" }).primaryKey(),
    name: text('name').notNull(),
    province_id: bigint('province_id', { mode: 'bigint' }).references(() => province.id, {onDelete: 'no action', onUpdate: 'no action'}).notNull()
});