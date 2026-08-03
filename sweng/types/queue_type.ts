import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { event_queue } from "@/db/models/event_queue";
import { QueueStationType } from "@/db/enums/queue_station";
import { ViewDonor } from "./donor_type";

export type ViewQueue = InferSelectModel<typeof event_queue>;
export type ViewQueueFilters = Partial<ViewQueue>;

export type CreateQueue = Omit<InferInsertModel<typeof event_queue>, 'station'>;

export type UpdateQueue = {
    id: bigint,
    station: QueueStationType | null
    profiles_id: string | null
}

export type DeleteQueue = {
    id: bigint;
};

export type QueueEntryWithDonor = ViewQueue & { donor_profile: ViewDonor | null };

export type StaffWithStatus = {
    profiles_id: string
    name: string
    role: string
    isBusy: boolean
    currentDonorId: number | null
    currentDonorName: string | null
    queueEntryId: number | null
}