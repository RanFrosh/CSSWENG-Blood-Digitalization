import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { event_queue } from "@/db/models/event_queue";

export type ViewQueue = InferSelectModel<typeof event_queue>;
export type ViewQueueFilters = Partial<ViewQueue>;

export type CreateQueue = InferInsertModel<typeof event_queue>;