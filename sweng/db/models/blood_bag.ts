import { pgTable, bigserial, varchar, bigint, integer, date, timestamp } from "drizzle-orm/pg-core";
import { donor } from "./donor"; 
import { event_log } from "./event_log";

export const blood_bag = pgTable('blood_bag', {

    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    serial_number: varchar('serial_number', { length: 255 }).notNull().unique(), 
    
    donor_id: bigint('donor_id', { mode: 'bigint' }).references(() => donor.id),
    event_id: bigint('event_id', { mode: 'bigint' }).references(() => event_log.id),
    
    blood_type: varchar('blood_type', { length: 5 }).notNull(),
    volume_ml: integer('volume_ml').notNull(),
    collection_date: date('collection_date').notNull(),
    
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});