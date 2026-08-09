import { pgTable, text, uuid, timestamp, pgSchema, boolean } from "drizzle-orm/pg-core";
import { access_level } from "../enums/access_level";

const authSchema = pgSchema('auth');
export const authUsers = authSchema.table('users', {
	id: uuid('id').primaryKey().notNull(),
    email: text('email'),
});

export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'no action', onUpdate: 'no action'}),
    name: text('name').notNull(),
    //email: text('email').notNull().unique(),
    //profile_image_url: text('profile_image_url'),
    role: access_level('role').notNull(),
    active: boolean('active'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});