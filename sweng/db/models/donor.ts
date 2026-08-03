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
  uuid,
} from "drizzle-orm/pg-core";
import { city } from "./city";
import { biological_sex } from "../enums/biological_sex";
import { blood_type } from "../enums/blood_type";
import { assessment_status } from "../enums/assessment_status";

export const donor = pgTable("donor", {
  
  // Primary key
  id: bigserial("id", { mode: "bigint" }).primaryKey(),

  // Personal information
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  middle_name: text("middle_name"),

  // QR Token
  qr_token: uuid("qr_token").defaultRandom().unique().notNull(),

  // Age and birthdate
  birthdate: date("birthdate"),
  age: integer("age"),
  
  // Contact information
  email: text("email").notNull(),
  mobile_no: text("mobile_no").notNull(),

  // Address
  street: text("street"),
  zip_code: text("zip_code"),

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

  // Physical attributes
  height: doublePrecision("height"),
  weight: doublePrecision("weight"),

  // Status
  active: boolean("active").default(true).notNull(),

  // Additional fields from dev
  verifiedBlood: boolean("verifiedBlood").default(false).notNull(),
  medicalNote: text("medicalNote"),
  assessment_status: assessment_status("assessment_status"),

  next_eligibility: date("next_eligibility"),

  // Creation timestamp
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  // Soft delete
  delete_datetime: timestamp("delete_datetime", { withTimezone: true }),
  delete_reason: text("delete_reason"),
  deleted_by: bigint("deleted_by", { mode: "bigint" }),
});