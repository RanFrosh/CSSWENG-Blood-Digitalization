import { pgTable, text, bigint, serial } from "drizzle-orm/pg-core";
import { province } from "./province";

export const city = pgTable('city', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    province_id: bigint('province_id', { mode: 'bigint' }).references(() => province.id, {onDelete: 'no action', onUpdate: 'no action'}).notNull()
});