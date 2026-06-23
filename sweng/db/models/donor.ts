import { pgTable, text, timestamp, bigserial, bigint, doublePrecision, boolean } from "drizzle-orm/pg-core";
import { city } from "./city";

export const donor = pgTable("donor", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),

  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  middle_name: text("middle_name"),

  email: text("email").notNull(),
  mobile_no: text("mobile_no").notNull(),

  street: text("street").notNull(),
  zip_code: text("zip_code").notNull(),

  sex: text("sex").notNull(),
  blood: text("blood").notNull(),

  city_id: bigint("city_id", { mode: "bigint" }).references(() => city.id, { onDelete: 'no action', onUpdate: 'no action'}).notNull(),

  photo_path: text("photo_path").notNull(),

  height: doublePrecision("height"),
  weight: doublePrecision("weight"),

  active: boolean("active").default(true).notNull(),

  deleted_at: timestamp("deleted_at", { withTimezone: true }),
  deleted_by: bigint("deleted_by", { mode: "bigint" }),
  deletion_reason: text("deletion_reason")
});