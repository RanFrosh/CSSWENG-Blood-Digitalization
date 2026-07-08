import { InferSelectModel } from "drizzle-orm";
import { assigned_staff } from "@/db/models/assigned_staff";

export type ViewAssignedStaff = InferSelectModel<typeof assigned_staff>;

export type ViewAssignedStaffFilter = Partial<ViewAssignedStaff>;