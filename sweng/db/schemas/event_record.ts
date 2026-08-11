import { pgTable, bigserial, bigint, time, uuid } from "drizzle-orm/pg-core";
import { event_log } from "./event_log";
import { donor } from "./donor";
import { event_record_action } from "../enums/event_action";
import { profiles } from "./profiles";

export const event_record = pgTable("event_record", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  event_log_id: bigint("event_log_id", { mode: "bigint" }).references(() => event_log.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
  donor_id: bigint("donor_id", { mode: "bigint" }).references(() => donor.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
  action: event_record_action("action").notNull(),
  time: time("time").notNull(),
  staff_id: uuid("staff_id").references(() => profiles.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull()
});

