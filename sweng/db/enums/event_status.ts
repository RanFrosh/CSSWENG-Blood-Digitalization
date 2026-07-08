import { pgEnum } from "drizzle-orm/pg-core";

export const eventStatusBase = [
    'Ongoing',
    'Upcoming',
    'Completed'
] as const;

export type EvenStatusType = typeof eventStatusBase[number];

export const event_status = pgEnum('event_status', eventStatusBase);