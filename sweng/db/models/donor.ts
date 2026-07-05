// Imports the 'pgTable', 'text', 'timestamp', 'bigserial', 'bigint', 'doublePrecision', and 'boolean' functions from the 'drizzle-orm/pg-core' library, which are used to define the structure of the 'donor' table in the PostgreSQL database.
import { pgTable, text, timestamp, bigserial, bigint, doublePrecision, boolean } from "drizzle-orm/pg-core";

// Imports the 'city' model from the local 'city' module, which represents the structure of the 'city' table in the database. This is used to establish a foreign key relationship between the 'donor' and 'city' tables.
import { city } from "./city";

export const donor = pgTable("donor", {
  // Primary key for the 'donor' table, which is an auto-incrementing big integer. This uniquely identifies each donor record in the database.
  id: bigserial("id", { mode: "bigint" }).primaryKey(),

  // Timestamp indicating when the donor record was created. The 'withTimezone' option ensures that the timestamp is stored with timezone information, and 'defaultNow()' sets the default value to the current timestamp when a new record is inserted.
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),

  // Donor's personal information fields, including first name, last name, middle name (optional), email, mobile number, street address, zip
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  middle_name: text("middle_name"),

  // Donor's contact information fields, including email and mobile number. Both fields are required and cannot be null.
  email: text("email").notNull(),
  mobile_no: text("mobile_no").notNull(),

  // Donor's address information fields, including street address and zip code. Both fields are required and cannot be null.
  street: text("street").notNull(),
  zip_code: text("zip_code").notNull(),

  // Donor's personal attributes, including sex and blood type.
  sex: text("sex").notNull(),
  blood: text("blood").notNull(),

  // Foreign key relationship to the 'city' table, which links the donor to a specific city. The 'references' method establishes the relationship, and the 'onDelete' and 'onUpdate' options specify that no action should be taken on the donor record if the referenced city is deleted or updated.
  city_id: bigint("city_id", { mode: "bigint" }).references(() => city.id, { onDelete: 'no action', onUpdate: 'no action'}).notNull(),

  // Donor's photo path, which is a required field that stores the file path to the donor's photo. This field cannot be null.
  photo_path: text("photo_path").notNull(),

  // Donor's physical attributes, including height and weight. Both fields are optional and can be null.
  height: doublePrecision("height"),
  weight: doublePrecision("weight"),

  // Indicates whether the donor record is active or has been soft-deleted. This field is a boolean that defaults to true (active) and cannot be null.
  active: boolean("active").default(true).notNull(),
  delete_datetime: timestamp("delete_datetime", { withTimezone: true }),
  delete_reason: text("delete_reason"),
  deleted_by: bigint("deleted_by", { mode: "bigint" }),
});