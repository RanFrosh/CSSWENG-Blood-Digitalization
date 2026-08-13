import { corrected_event } from "@/db/schemas/corrected_event";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { event_log } from "@/db/schemas/event_log";
import { event_record } from "@/db/schemas/event_record";
import { city } from "@/db/schemas/city";
import { AccessType } from "@/db/enums/access_level";
import { EventRecordAction } from "@/db/enums/event_action";

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

export type UpdateEvents = Partial<Pick<CreateEvents, "name" | "partner" | "city_id" | "event_date" | "status" | "target_blood" | "img_url">>;

export type CreateEventRecords = InferInsertModel<typeof event_record>;

export type ViewCities = InferSelectModel<typeof city>;

export type ViewEventRecords = {
    event_log_id: bigint;
    event_name: string;
    staff_name: string;
    staff_role: AccessType;
    donor_first_name: string;
    donor_last_name: string;
    action: EventRecordAction;
    time: string;
};