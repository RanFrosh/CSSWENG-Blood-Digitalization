import { corrected_event } from "@/db/schemas/corrected_event";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { event_log } from "@/db/schemas/event_log";

export type ViewCorrections = InferSelectModel<typeof corrected_event>;
export type ViewCorrectionFilters = Partial<ViewCorrections>;

export type CreateCorrections = InferInsertModel<typeof corrected_event>;

export type ViewEvents = InferSelectModel<typeof event_log> & {
    city: string;
};
export type ViewEventsWithProvince = ViewEvents & {
    province: string;
};
export type ViewEventFilters = Partial<ViewEvents>;

export type CreateEvents = InferInsertModel<typeof event_log>;