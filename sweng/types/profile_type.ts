import { profiles } from "@/db/schemas/profiles";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type ReadProfile = InferSelectModel<typeof profiles>;

export type CreateProfile = InferInsertModel<typeof profiles>