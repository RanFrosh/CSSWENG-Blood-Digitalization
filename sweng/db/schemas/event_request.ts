import { 
    pgTable, 
    pgEnum,
    bigserial, 
    bigint, 
    varchar, 
    uuid, 
    text,
    timestamp, 
    jsonb 
} from "drizzle-orm/pg-core";

import { profiles } from "./profiles";
import { donor } from "./donor";
import { event_log } from "./event_log";
import { blood_bag } from "./blood_bag";

export const requestStatusEnum = pgEnum('request_status', ['pending', 'approved', 'rejected']);

export const edit_requests = pgTable('edit_requests', {

    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    
    blood_bag_serial: varchar('blood_bag_serial', { length: 255 })
        .notNull()
        .references(() => blood_bag.serial_number),
    
    donor_id: bigint('donor_id', { mode: 'bigint' }).references(() => donor.id),
    event_id: bigint('event_id', { mode: 'bigint' }).references(() => event_log.id),
    
    staff_id: uuid('staff_id').references(() => profiles.id).notNull(),
    admin_id: uuid('admin_id').references(() => profiles.id),

    payload: jsonb('payload').notNull(),
    
    status: requestStatusEnum('status').default('pending').notNull(),
    
    admin_remarks: text('admin_remarks'),
    
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});