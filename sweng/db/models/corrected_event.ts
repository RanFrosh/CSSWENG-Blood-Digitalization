import { pgTable, text, timestamp, bigserial, bigint, uuid} from "drizzle-orm/pg-core";
import { city } from "./city";
import { event_log } from "./event";
import { profiles } from "./profiles";

export const corrected_event = pgTable("corrected_event", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }),

  visitors: bigint("visitors", { mode: "bigint" }),
  extractions: bigint("extractions", { mode: "bigint" }),
  produced_bags: bigint("produced_bags", { mode: "bigint" }),
  target_blood: bigint("target_blood", { mode: "bigint" }),
  perk_claims: bigint("perk_claims", { mode: "bigint" }),

  name: text("name"),

  city_id: bigint("city_id", { mode: "bigint" }).references(() => city.id, { onDelete: 'no action', onUpdate: 'no action'}),

  zip_code: text("zip_code"),
  street: text("street"),

  ref_event_id: bigint("ref_event_id", { mode: "bigint" }).references(() => event_log.id, { onDelete: 'no action', onUpdate: 'no action'}).notNull(),
  ref_profile_id: uuid("ref_profile_id").references(() => profiles.id, { onDelete: 'no action', onUpdate: 'no action'}).notNull()
});

