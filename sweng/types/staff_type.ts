import { AccessType } from "@/db/enums/access_level";

export type StaffStatus = "Active" | "Inactive"

export type StaffUserRow = {
    id: string,
    name: string,
    email: string | null,
    role: AccessType,
    dateJoined: Date
}

export type StaffUser = StaffUserRow & {
    status: StaffStatus
};