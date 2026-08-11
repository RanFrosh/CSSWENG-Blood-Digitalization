import { pgEnum } from "drizzle-orm/pg-core";

export const eventActionBase = [
    'register',
    'check_in',
    'deferral',
    'perk_claim',
    'donate_success',
    'donate_fail'
] as const;

export type EventRecordAction = typeof eventActionBase[number];

export const event_record_action = pgEnum('event_action', eventActionBase);