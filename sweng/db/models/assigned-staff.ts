import { pgTable, bigserial, bigint, uuid } from "drizzle-orm/pg-core";
import { event_log } from "./event-log";
import { profiles } from "./profiles";

export const assigned_staff = pgTable("assigned_staff", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),

  profiles_id: uuid("profiles_id")
    .references(() => profiles.id)
    .notNull(),

  event_log_id: bigint("event_log_id", { mode: "bigint" })
    .references(() => event_log.id)
    .notNull(),
});