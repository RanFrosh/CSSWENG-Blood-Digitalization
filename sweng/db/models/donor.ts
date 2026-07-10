import {
  pgTable,
  text,
  timestamp,
  bigserial,
  bigint,
  doublePrecision,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";

import { city } from "./city";
import { biological_sex } from "../enums/biological_sex";
import { blood_type } from "../enums/blood_type";

export const donor = pgTable("donor", {
  // Primary key
  id: bigserial("id", { mode: "bigint" }).primaryKey(),

  // Creation timestamp
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  // Personal information
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  middle_name: text("middle_name"),

  // Age and birthdate
  age: integer("age"),
  birthdate: date("birthdate"),

  // Contact information
  email: text("email").notNull(),
  mobile_no: text("mobile_no").notNull(),

  // Address
  street: text("street").notNull(),
  zip_code: text("zip_code").notNull(),

  // Personal attributes
  sex: biological_sex("sex").notNull(),
  blood: blood_type("blood").notNull(),

  // City reference
  city_id: bigint("city_id", { mode: "bigint" })
    .references(() => city.id, {
      onDelete: "no action",
      onUpdate: "no action",
    })
    .notNull(),

  // Donor photo
  photo_path: text("photo_path").notNull(),

  // Physical attributes
  height: doublePrecision("height"),
  weight: doublePrecision("weight"),

  // Status
  active: boolean("active").default(true).notNull(),

  // Soft delete
  delete_datetime: timestamp("delete_datetime", { withTimezone: true }),
  delete_reason: text("delete_reason"),
  deleted_by: bigint("deleted_by", { mode: "bigint" }),

  // Additional fields from dev
  verifiedBlood: boolean("verifiedBlood").default(false).notNull(),
  medicalNote: text("medicalNote"),
});