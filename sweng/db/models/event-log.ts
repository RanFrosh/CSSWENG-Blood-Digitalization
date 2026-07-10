import {
  pgTable,
  pgEnum,
  bigserial,
  bigint,
  text,
  timestamp,
  date,
  time,
} from "drizzle-orm/pg-core";
import { city } from "./city";

export const eventStatusEnum = pgEnum("event_status", [
  "Upcoming",
  "Ongoing",
  "Completed",
]);

export const event_log = pgTable("event_log", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),

  created_at: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  // Event Information
  name: text("name").notNull(),
  partner: text("partner").notNull(),

  // Location
  street: text("street").notNull(),
  zip_code: text("zip_code").notNull(),
  city_id: bigint("city_id", { mode: "bigint" })
    .references(() => city.id)
    .notNull(),

  // Schedule
  event_date: date("event_date").notNull(),
  start_time: time("start_time").notNull(),
  end_time: time("end_time"),

  // Status
  status: eventStatusEnum("status")
    .notNull()
    .default("Upcoming"),

  // Statistics
  visitors: bigint("visitors", { mode: "bigint" })
    .notNull()
    .default(BigInt(0)),

  extractions: bigint("extractions", { mode: "bigint" })
    .notNull()
    .default(BigInt(0)),

  produced_bags: bigint("produced_bags", { mode: "bigint" })
    .notNull()
    .default(BigInt(0)),

  target_blood: bigint("target_blood", { mode: "bigint" })
    .notNull()
    .default(BigInt(0)),

  perk_claims: bigint("perk_claims", { mode: "bigint" })
    .notNull()
    .default(BigInt(0)),
});