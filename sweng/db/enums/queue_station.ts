import { pgEnum } from "drizzle-orm/pg-core";

export const queueStationBase = [
    'med_queue',
    'lab_queue'
] as const;

export type QueueStationType = typeof queueStationBase[number];

export const queue_station = pgEnum('queue_station', queueStationBase);