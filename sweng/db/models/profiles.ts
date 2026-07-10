import { pgTable, text, uuid, timestamp, pgSchema } from "drizzle-orm/pg-core";
import { access_level } from "../enums/access_level";

const authSchema = pgSchema('auth');
export const authUsers = authSchema.table('users', {
	id: uuid('id').primaryKey().notNull(),
});

export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'no action', onUpdate: 'no action'}),
    name: text('name').notNull(),
    role: access_level('role').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});