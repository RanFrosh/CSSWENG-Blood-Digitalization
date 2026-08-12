import {
  pgTable,
  bigserial,
  bigint,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { donor } from "./donor";
import { event_log } from "./event_log";

export const donor_to_event = pgTable("donor_to_event", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),

  donor_id: bigint("donor_id", { mode: "bigint" })
    .references(() => donor.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .notNull(),

  event_id: bigint("event_id", { mode: "bigint" })
    .references(() => event_log.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .notNull(),

  is_success: boolean("is_success").default(false).notNull(),

  blood_amount: integer("blood_amount"),

  perk_claimed: boolean("perk_claimed").default(false).notNull(),

  created_at: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow().notNull(),

  updated_at: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow().notNull(),
});