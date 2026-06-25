import { pgTable, text, timestamp, bigserial, bigint} from "drizzle-orm/pg-core";
import { city } from "./city";

export const event_log = pgTable("event_log", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  visitors: bigint("visitors", { mode: "bigint" }).notNull(),
  extractions: bigint("extractions", { mode: "bigint" }).notNull(),
  produced_bags: bigint("produced_bags", { mode: "bigint" }).notNull(),
  target_blood: bigint("target_blood", { mode: "bigint" }).notNull(),
  perk_claims: bigint("perk_claims", { mode: "bigint" }).notNull(),

  name: text("name").notNull(),

  city_id: bigint("city_id", { mode: "bigint" }).references(() => city.id, { onDelete: 'no action', onUpdate: 'no action'}).notNull(),

  zip_code: text("zip_code").notNull(),
  street: text("street").notNull()
});