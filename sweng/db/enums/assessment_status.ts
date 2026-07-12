import { pgEnum } from "drizzle-orm/pg-core";

export const assessmentStatusBase = [
    'Pending',
    'Passed',
    'Failed',
    'For Review'
] as const;

export type AssessmentStatusType = typeof assessmentStatusBase[number];

export const assessment_status = pgEnum('assessment_status', assessmentStatusBase);