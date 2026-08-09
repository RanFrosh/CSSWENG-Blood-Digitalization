import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { donor } from "@/db/schemas/donor";

export type ViewDonor = InferSelectModel<typeof donor>;
export type ViewDonorPartial = Partial<ViewDonor>;

export type CreateDonor = InferInsertModel<typeof donor>;