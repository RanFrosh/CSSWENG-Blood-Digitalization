import { retrieveDonor, viewQueueWithDonors, pickNextDonor, peekNextDonor, viewStaffStatus } from "@/app/queue/queue_action";

jest.mock("@/db/supaserver", () => ({
    serverSupa: jest.fn(),
}));

jest.mock("@/app/global/query_session.ts/query_user", () => ({
    ImpProfileGetter: jest.fn(),
}));

jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
    helpGateKeep: jest.fn(),
}));

jest.mock("@/app/queue/imp_queue_data", () => ({
    ImpQueueModel: jest.fn(),
}));

jest.mock("@/app/queue/imp_queue_controller", () => ({
    ImpQueueManager: jest.fn(),
}));

// retrieveDonor and viewQueueWithDonors delegate to ImpDonorManager
jest.mock("@/app/donoring/imp_donor_data", () => ({
    ImpDonorModel: jest.fn(),
}));

jest.mock("@/app/donoring/imp_donor_controller", () => ({
    ImpDonorManager: jest.fn(),
}));

// viewStaffStatus uses ImpProfilesManager for profile lookups
jest.mock("@/app/profiles/imp_profiles_data", () => ({
    ImpProfilesModel: jest.fn(),
}));

jest.mock("@/app/profiles/imp_profiles_controller", () => ({
    ImpProfilesManager: jest.fn(),
}));

// viewStaffStatus uses ImpAssignedStaffManager for staff assignment lookups
jest.mock("@/app/assigned_staff/imp_assigned_staff_data", () => ({
    ImpAssignedStaffModel: jest.fn(),
}));

jest.mock("@/app/assigned_staff/imp_assigned_staff_controller", () => ({
    ImpAssignedStaffManager: jest.fn(),
}));

// orm is still used directly in viewStaffStatus for event_queue busy checks
// and donor name lookups
jest.mock("@/db/drizzle", () => ({
    orm: {
        select: jest.fn(),
    },
}));

jest.mock("@/app/global/serializer/serial", () => ({
    bigintToStr: jest.fn((val) => val),
}));

jest.mock("@/db/models/donor", () => ({
    donor: {
        id: "donor.id",
        first_name: "donor.first_name",
        last_name: "donor.last_name",
    },
}));

jest.mock("@/db/models/profiles", () => ({
    profiles: {
        id: "profiles.id",
        role: "profiles.role",
    },
}));

jest.mock("@/db/models/assigned_staff", () => ({
    assigned_staff: {
        profiles_id: "assigned_staff.profiles_id",
        event_log_id: "assigned_staff.event_log_id",
    },
}));

jest.mock("@/db/models/event_queue", () => ({
    event_queue: {
        id: "event_queue.id",
        event_log_id: "event_queue.event_log_id",
        station: "event_queue.station",
        profile_id: "event_queue.profile_id",
        donor_id: "event_queue.donor_id",
    },
}));

import { serverSupa } from "@/db/supaserver";
import { ImpProfileGetter } from "@/queries/profile_query";
import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { ImpDonorModel } from "@/app/donoring/imp_donor_data";
import { ImpDonorManager } from "@/app/donoring/imp_donor_controller";
import { ImpProfilesModel } from "@/app/profiles/imp_profiles_data";
import { ImpProfilesManager } from "@/app/profiles/imp_profiles_controller";
import { ImpAssignedStaffModel } from "@/app/assigned_staff/imp_assigned_staff_data";
import { ImpAssignedStaffManager } from "@/app/assigned_staff/imp_assigned_staff_controller";

const DONOR_ID = BigInt(99);
const EVENT_LOG_ID = BigInt(10);
const PROFILE_ID = "dummy-uuid-1";

const dummyProfile = {
    id: PROFILE_ID,
    name: "Test User",
    role: "med_prof" as const,
    created_at: new Date(),
};

const dummyDonor = {
    id: DONOR_ID,
    created_at: new Date(),
    first_name: "John",
    last_name: "Doe",
    middle_name: null,
    birthdate: null,
    age: null,
    email: "john@example.com",
    mobile_no: "09123456789",
    street: null,
    zip_code: null,
    sex: "Male" as const,
    blood: "A+" as const,
    city_id: BigInt(1),
    photo_path: "/photos/john.jpg",
    height: null,
    weight: null,
    active: true,
    delete_datetime: null,
    delete_reason: null,
    deleted_by: null,
    verifiedBlood: false,
    medicalNote: null,
    assessment_status: null,
    qr_token: "dummy-qr-uuid",
};

const dummyQueueRow = {
    id: BigInt(1),
    event_log_id: EVENT_LOG_ID,
    donor_id: DONOR_ID,
    station: "med_queue" as const,
    profile_id: PROFILE_ID,
};

const dummyAssignedStaff = [
    { id: BigInt(1), profiles_id: PROFILE_ID, event_log_id: EVENT_LOG_ID },
];

function setupMocks() {
    const mockSupaClient = {};
    (serverSupa as jest.Mock).mockResolvedValue(mockSupaClient);

    const mockProfilerInstance = { getCurrentUser: jest.fn() };
    (ImpProfileGetter as jest.Mock).mockImplementation(() => mockProfilerInstance);

    // Queue model and controller
    const mockQueueModelInstance = {
        queryQueue: jest.fn(),
        deleteQueue: jest.fn(),
        addToQueue: jest.fn(),
        updateQueueStation: jest.fn(),
        getNullStations: jest.fn(),
    };
    (ImpQueueModel as jest.Mock).mockImplementation(() => mockQueueModelInstance);

    const mockQueueControllerInstance = {
        invokeQueryQueue: jest.fn(),
        invokePickNextQueue: jest.fn(),
        invokePeekNextQueue: jest.fn(),
        invokeDeleteQueue: jest.fn(),
        invokeAddToQueue: jest.fn(),
        invokeUpdateQueueStation: jest.fn(),
        invokeGetNullStations: jest.fn(),
    };
    (ImpQueueManager as jest.Mock).mockImplementation(() => mockQueueControllerInstance);

    // Donor model and controller; used by retrieveDonor and viewQueueWithDonors
    const mockDonorModelInstance = {
        getSingleDonor: jest.fn(),
    };
    (ImpDonorModel as jest.Mock).mockImplementation(() => mockDonorModelInstance);

    const mockDonorControllerInstance = {
        invokeGetSingleDonor: jest.fn(),
        invokeGetDonorsByIds: jest.fn(),
    };
    (ImpDonorManager as jest.Mock).mockImplementation(() => mockDonorControllerInstance);

    // Profiles model and controller; used by viewStaffStatus
    const mockProfilesModelInstance = {
        getProfiles: jest.fn(),
    };
    (ImpProfilesModel as jest.Mock).mockImplementation(() => mockProfilesModelInstance);

    const mockProfilesControllerInstance = {
        invokeGetProfiles: jest.fn(),
    };
    (ImpProfilesManager as jest.Mock).mockImplementation(() => mockProfilesControllerInstance);

    // Assigned staff model and controller; used by viewStaffStatus
    const mockAssignedStaffModelInstance = {
        getStaff: jest.fn(),
    };
    (ImpAssignedStaffModel as jest.Mock).mockImplementation(() => mockAssignedStaffModelInstance);

    const mockAssignedStaffControllerInstance = {
        invokeGetStaff: jest.fn(),
    };
    (ImpAssignedStaffManager as jest.Mock).mockImplementation(() => mockAssignedStaffControllerInstance);

    return {
        mockProfilerInstance,
        mockQueueModelInstance,
        mockQueueControllerInstance,
        mockDonorModelInstance,
        mockDonorControllerInstance,
        mockProfilesModelInstance,
        mockProfilesControllerInstance,
        mockAssignedStaffModelInstance,
        mockAssignedStaffControllerInstance,
    };
}

describe("queue_action", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("retrieveDonor", () => {
        it("calls invokeGetSingleDonor with the donor id", async () => {
            const { mockDonorControllerInstance } = setupMocks();
            mockDonorControllerInstance.invokeGetSingleDonor.mockResolvedValue({
                success: true,
                message: "Donor retrieved",
                data: dummyDonor,
            });

            await retrieveDonor(DONOR_ID);

            expect(mockDonorControllerInstance.invokeGetSingleDonor).toHaveBeenCalledWith({
                id: DONOR_ID,
            });
        });

        it("returns the donor data when found", async () => {
            const { mockDonorControllerInstance } = setupMocks();
            mockDonorControllerInstance.invokeGetSingleDonor.mockResolvedValue({
                success: true,
                message: "Donor retrieved",
                data: dummyDonor,
            });

            const result = await retrieveDonor(DONOR_ID);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(dummyDonor);
        });

        it("returns a failure when the donor is not found", async () => {
            const { mockDonorControllerInstance } = setupMocks();
            mockDonorControllerInstance.invokeGetSingleDonor.mockResolvedValue({
                success: false,
                message: "Donor not found",
            });

            const result = await retrieveDonor(DONOR_ID);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Donor not found");
        });

        it("returns a failure when the user is not authorized", async () => {
            const { mockDonorControllerInstance } = setupMocks();
            mockDonorControllerInstance.invokeGetSingleDonor.mockResolvedValue({
                success: false,
                message: "Not authorized",
            });

            const result = await retrieveDonor(DONOR_ID);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Not authorized");
        });
    });

    describe("viewQueueWithDonors", () => {
        const EVENT_ID_STR = EVENT_LOG_ID.toString();

        it("calls invokeQueryQueue with the event_id converted to bigint", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokeQueryQueue.mockResolvedValue({
                success: false,
                message: "Not assigned to this event",
                data: undefined,
            });

            await viewQueueWithDonors(EVENT_ID_STR);

            expect(mockQueueControllerInstance.invokeQueryQueue).toHaveBeenCalledWith({
                event_log_id: EVENT_LOG_ID,
            });
        });

        it("propagates the failure response when invokeQueryQueue fails", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokeQueryQueue.mockResolvedValue({
                success: false,
                message: "Not assigned to this event",
                data: undefined,
            });

            const result = await viewQueueWithDonors(EVENT_ID_STR);

            expect(result).toEqual({
                success: false,
                message: "Not assigned to this event",
                data: undefined,
            });
        });

        it("returns an empty array when the queue is empty", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokeQueryQueue.mockResolvedValue({
                success: true,
                message: "Queue is empty",
                data: [],
            });

            const result = await viewQueueWithDonors(EVENT_ID_STR);

            expect(result).toEqual({
                success: true,
                message: "Queue is empty",
                data: [],
            });
        });

        it("returns combined queue entries with donor profiles on success", async () => {
            const { mockQueueControllerInstance, mockDonorControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokeQueryQueue.mockResolvedValue({
                success: true,
                message: "Queue retrieved",
                data: [dummyQueueRow],
            });

            // viewQueueWithDonors now uses invokeGetDonorsByIds instead of orm.select
            mockDonorControllerInstance.invokeGetDonorsByIds.mockResolvedValue({
                success: true,
                message: "Donors retrieved",
                data: [dummyDonor],
            });

            const result = await viewQueueWithDonors(EVENT_ID_STR);

            expect(result.success).toBe(true);
            expect(result.data).toEqual([
                {
                    ...dummyQueueRow,
                    donor_profile: dummyDonor,
                },
            ]);
        });

        it("returns a failure when invokeGetDonorsByIds fails", async () => {
            const { mockQueueControllerInstance, mockDonorControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokeQueryQueue.mockResolvedValue({
                success: true,
                message: "Queue retrieved",
                data: [dummyQueueRow],
            });

            mockDonorControllerInstance.invokeGetDonorsByIds.mockResolvedValue({
                success: false,
                message: "Failed to fetch donors",
                data: undefined,
            });

            const result = await viewQueueWithDonors(EVENT_ID_STR);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Failed to fetch donors");
        });

        it("sets donor_profile to null when donor_id is null in a queue entry", async () => {
            const { mockQueueControllerInstance, mockDonorControllerInstance } = setupMocks();
            const queueRowWithNullDonor = { ...dummyQueueRow, donor_id: null };

            mockQueueControllerInstance.invokeQueryQueue.mockResolvedValue({
                success: true,
                message: "Queue retrieved",
                data: [queueRowWithNullDonor],
            });

            mockDonorControllerInstance.invokeGetDonorsByIds.mockResolvedValue({
                success: true,
                message: "Donors retrieved",
                data: [],
            });

            const result = await viewQueueWithDonors(EVENT_ID_STR);

            expect(result.success).toBe(true);
            expect(result.data?.[0].donor_profile).toBeNull();
        });

        it("returns a failure response when an unexpected error is thrown", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokeQueryQueue.mockRejectedValue(
                new Error("unexpected error")
            );

            const result = await viewQueueWithDonors(EVENT_ID_STR);

            expect(result).toEqual({
                success: false,
                message: "unexpected error",
            });
        });
    });

    describe("pickNextDonor", () => {
        it("calls invokePickNextQueue with the event_log_id", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokePickNextQueue.mockResolvedValue({
                success: true,
                message: "Donor assigned and Donor station updated",
                data: { ...dummyQueueRow, station: null },
            });

            await pickNextDonor(EVENT_LOG_ID);

            expect(mockQueueControllerInstance.invokePickNextQueue).toHaveBeenCalledWith(
                EVENT_LOG_ID
            );
        });

        it("returns the result from invokePickNextQueue on success", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            const nextDonor = { ...dummyQueueRow, station: null };
            mockQueueControllerInstance.invokePickNextQueue.mockResolvedValue({
                success: true,
                message: "Donor assigned and Donor station updated",
                data: nextDonor,
            });

            const result = await pickNextDonor(EVENT_LOG_ID);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(nextDonor);
        });

        it("propagates the failure response from invokePickNextQueue", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokePickNextQueue.mockResolvedValue({
                success: false,
                message: "You are already handling a donor, cannot handle for now",
            });

            const result = await pickNextDonor(EVENT_LOG_ID);

            expect(result).toEqual({
                success: false,
                message: "You are already handling a donor, cannot handle for now",
            });
        });
    });

    describe("peekNextDonor", () => {
        it("calls invokePeekNextQueue with the event_log_id", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokePeekNextQueue.mockResolvedValue({
                success: true,
                message: "Donor peeked and Queue retrieved",
                data: dummyQueueRow,
            });

            await peekNextDonor(EVENT_LOG_ID);

            expect(mockQueueControllerInstance.invokePeekNextQueue).toHaveBeenCalledWith(
                EVENT_LOG_ID
            );
        });

        it("returns the next donor without claiming them", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokePeekNextQueue.mockResolvedValue({
                success: true,
                message: "Donor peeked and Queue retrieved",
                data: dummyQueueRow,
            });

            const result = await peekNextDonor(EVENT_LOG_ID);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(dummyQueueRow);
            // station is NOT null; donor hasn't been claimed
            expect(result.data?.station).toBe("med_queue");
        });

        it("propagates the failure response from invokePeekNextQueue", async () => {
            const { mockQueueControllerInstance } = setupMocks();
            mockQueueControllerInstance.invokePeekNextQueue.mockResolvedValue({
                success: false,
                message: "You are already handling a donor, cannot peek",
            });

            const result = await peekNextDonor(EVENT_LOG_ID);

            expect(result).toEqual({
                success: false,
                message: "You are already handling a donor, cannot peek",
            });
        });
    });

    describe("viewStaffStatus", () => {
        it("returns a failure when getCurrentUser fails", async () => {
            const { mockProfilerInstance } = setupMocks();
            mockProfilerInstance.getCurrentUser.mockResolvedValue({
                success: false,
                message: "Not authenticated",
            });

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result).toEqual({
                success: false,
                message: "Not authenticated",
            });
        });

        it("returns an empty array when no staff are assigned to the event", async () => {
            const { mockProfilerInstance, mockAssignedStaffControllerInstance } = setupMocks();
            mockProfilerInstance.getCurrentUser.mockResolvedValue({
                success: true,
                data: dummyProfile,
            });

            // invokeGetStaff returns empty; no staff assigned
            mockAssignedStaffControllerInstance.invokeGetStaff.mockResolvedValue({
                success: true,
                message: "No staff assigned",
                data: [],
            });

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result).toEqual({
                success: true,
                message: "No staff assigned",
                data: [],
            });
        });

        it("returns a failure when invokeGetStaff fails", async () => {
            const { mockProfilerInstance, mockAssignedStaffControllerInstance } = setupMocks();
            mockProfilerInstance.getCurrentUser.mockResolvedValue({
                success: true,
                data: dummyProfile,
            });

            mockAssignedStaffControllerInstance.invokeGetStaff.mockResolvedValue({
                success: false,
                message: "Not authorized",
                data: undefined,
            });

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Not authorized");
        });

        it("returns a failure when the current user is not assigned to the event", async () => {
            const { mockProfilerInstance, mockAssignedStaffControllerInstance } = setupMocks();
            mockProfilerInstance.getCurrentUser.mockResolvedValue({
                success: true,
                data: dummyProfile,
            });

            // Staff returned but current user not among them
            mockAssignedStaffControllerInstance.invokeGetStaff.mockResolvedValue({
                success: true,
                message: "Returning list of staff for event",
                data: [{ id: BigInt(1), profiles_id: "other-uuid", event_log_id: EVENT_LOG_ID }],
            });

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result).toEqual({
                success: false,
                message: "Not assigned to this event",
                data: [],
            });
        });

        it("returns an empty array when no same-role staff are assigned", async () => {
            const { mockProfilerInstance, mockAssignedStaffControllerInstance, mockProfilesControllerInstance } = setupMocks();
            mockProfilerInstance.getCurrentUser.mockResolvedValue({
                success: true,
                data: dummyProfile, // role: med_prof
            });

            // Current user is assigned
            mockAssignedStaffControllerInstance.invokeGetStaff.mockResolvedValue({
                success: true,
                message: "Returning list of staff for event",
                data: dummyAssignedStaff,
            });

            // Profiles returns staff with different role
            mockProfilesControllerInstance.invokeGetProfiles.mockResolvedValue({
                success: true,
                message: "Staff retrieved",
                data: [{ id: PROFILE_ID, name: "Test User", role: "lab_staff" }],
            });

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result).toEqual({
                success: true,
                message: "No same-role staff assigned",
                data: [],
            });
        });

        it("returns staff status with busy state when a donor is being handled", async () => {
            const {
                mockProfilerInstance,
                mockAssignedStaffControllerInstance,
                mockProfilesControllerInstance,
                mockQueueControllerInstance,
                mockDonorControllerInstance,
            } = setupMocks();

            mockProfilerInstance.getCurrentUser.mockResolvedValue({
                success: true,
                data: dummyProfile,
            });

            // Current user is assigned
            mockAssignedStaffControllerInstance.invokeGetStaff.mockResolvedValue({
                success: true,
                message: "Returning list of staff for event",
                data: dummyAssignedStaff,
            });

            // Same role staff
            mockProfilesControllerInstance.invokeGetProfiles.mockResolvedValue({
                success: true,
                message: "Staff retrieved",
                data: [{ id: PROFILE_ID, name: "Test User", role: "med_prof" }],
            });

            // Staff is handling a donor (station: null)
            mockQueueControllerInstance.invokeGetNullStations.mockResolvedValue({
                success: true,
                message: "Returning list of donors being handled by a staff",
                data: [{ id: BigInt(5), profile_id: PROFILE_ID, donor_id: DONOR_ID, station: null }],
            });

            // Donor name lookup
            mockDonorControllerInstance.invokeGetDonorsByIds.mockResolvedValue({
                success: true,
                message: "Donors retrieved",
                data: [{ id: DONOR_ID, first_name: "John", last_name: "Doe" }],
            });

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result.success).toBe(true);
            expect(result.data?.[0]).toEqual(
                expect.objectContaining({
                    profiles_id: PROFILE_ID,
                    isBusy: true,
                    currentDonorId: DONOR_ID,
                    currentDonorName: "John Doe",
                })
            );
        });

        it("returns staff status with not busy state when no donor is being handled", async () => {
            const {
                mockProfilerInstance,
                mockAssignedStaffControllerInstance,
                mockProfilesControllerInstance,
                mockQueueControllerInstance,
                mockDonorControllerInstance,
            } = setupMocks();

            mockProfilerInstance.getCurrentUser.mockResolvedValue({
                success: true,
                data: dummyProfile,
            });

            mockAssignedStaffControllerInstance.invokeGetStaff.mockResolvedValue({
                success: true,
                message: "Returning list of staff for event",
                data: dummyAssignedStaff,
            });

            mockProfilesControllerInstance.invokeGetProfiles.mockResolvedValue({
                success: true,
                message: "Staff retrieved",
                data: [{ id: PROFILE_ID, name: "Test User", role: "med_prof" }],
            });

            // No active donors
            mockQueueControllerInstance.invokeGetNullStations.mockResolvedValue({
                success: true,
                message: "No donors with null stations",
                data: [],
            });

            // No busy donors to look up
            mockDonorControllerInstance.invokeGetDonorsByIds.mockResolvedValue({
                success: true,
                message: "Donors retrieved",
                data: [],
            });

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result.success).toBe(true);
            expect(result.data?.[0]).toEqual(
                expect.objectContaining({
                    profiles_id: PROFILE_ID,
                    isBusy: false,
                    currentDonorId: null,
                    currentDonorName: null,
                })
            );
        });

        it("returns a failure response when an unexpected error is thrown", async () => {
            const { mockProfilerInstance } = setupMocks();
            mockProfilerInstance.getCurrentUser.mockRejectedValue(
                new Error("unexpected error")
            );

            const result = await viewStaffStatus(EVENT_LOG_ID);

            expect(result).toEqual({
                success: false,
                message: "unexpected error",
            });
        });
    });
});