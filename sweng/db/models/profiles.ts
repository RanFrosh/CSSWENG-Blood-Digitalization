import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { access_level } from "../enums/access_level";
import { authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'no action', onUpdate: 'no action'}),
    name: text('name').notNull(),
    role: access_level('role').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull()
});