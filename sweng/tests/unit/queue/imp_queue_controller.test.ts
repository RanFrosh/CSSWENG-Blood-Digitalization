import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { helpGateKeep } from "@/app/global/helper_bouncer/bouncer";
import { getQueueStation } from "@/app/global/access/permissions";
import { QueueData } from "@/abstract/queue/queue_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { ViewQueueFilters, ViewQueue, DeleteQueue, CreateQueue, UpdateQueue } from "@/types/queue_type";

// module mock helpGateKeep and getQueueStation
jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
    helpGateKeep: jest.fn(),
}));

jest.mock("@/app/global/access/permissions", () => ({
    getQueueStation: jest.fn(),
}));

// create reusable dummy profile 
const dummyProfile = {
    id: "dummy-uuid-1",
    name: "Test User",
    role: "med_prof" as const,
    created_at: new Date(),
};

// shared authorized gate response
const authorizedGateResponse = {
    success: true,
    message: "Authorized",
    data: dummyProfile,
};

describe("ImpQueueManager", () => {
    let queueModel: jest.Mocked<QueueData>;
    let profileReader: ProfileSessionProvider;
    let manager: ImpQueueManager;

    beforeEach(() => {
        jest.clearAllMocks();

        // use plain object mock for QueueData interface
        queueModel = {
            queryQueue: jest.fn(),
            deleteQueue: jest.fn(),
            addToQueue: jest.fn(),
            updateQueueStation: jest.fn(),
        };

        // empty case profileReader
        profileReader = {} as ProfileSessionProvider;

        manager = new ImpQueueManager(queueModel, profileReader);
    });

    describe("invokeQueryQueue", () => {
        const baseFilter: ViewQueueFilters = { event_log_id: BigInt(10) };

        describe("when the user is not authorized", () => {
            it("returns the gate failure response without calling queryQueue", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                const result = await manager.invokeQueryQueue(baseFilter);

                expect(result).toEqual({ success: false, message: "Not authorized" });
                expect(queueModel.queryQueue).not.toHaveBeenCalled();
            });

            it("checks authorization against the 'dequeue' permission", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                await manager.invokeQueryQueue(baseFilter);

                // confirms the controller passes profileReader and the correct action string
                expect(helpGateKeep).toHaveBeenCalledWith(profileReader, "dequeue");
            });
        });

        describe("when the user is authorized", () => {
            beforeEach(() => {
                (helpGateKeep as jest.Mock).mockResolvedValue(authorizedGateResponse);
                // med_prof maps to 'med_queue' per queueMapping in permissions.ts
                (getQueueStation as jest.Mock).mockReturnValue("med_queue");
            });

            it("appends profile_id and station to the filter before querying", async () => {
                queueModel.queryQueue.mockResolvedValue({
                    success: true,
                    message: "Queue retrieved",
                    data: [],
                });

                await manager.invokeQueryQueue(baseFilter);

                // the controller should spread the original filter and append
                // profile_id from res.data and station from getQueueStation.
                expect(queueModel.queryQueue).toHaveBeenCalledWith({
                    ...baseFilter,
                    profile_id: dummyProfile.id,
                    station: "med_queue",
                });
            });

            it("passes the user role to getQueueStation", async () => {
                queueModel.queryQueue.mockResolvedValue({
                    success: true,
                    message: "Queue retrieved",
                    data: [],
                });

                await manager.invokeQueryQueue(baseFilter);

                expect(getQueueStation).toHaveBeenCalledWith(dummyProfile.role);
            });

            it("returns the outcome from queryQueue on success", async () => {
                const mockQueue: ViewQueue[] = [
                    { id: BigInt(1), event_log_id: BigInt(10), donor_id: BigInt(99), station: "med_queue", profile_id: dummyProfile.id },
                ];
                queueModel.queryQueue.mockResolvedValue({
                    success: true,
                    message: "Queue retrieved",
                    data: mockQueue,
                });

                const result = await manager.invokeQueryQueue(baseFilter);

                expect(result.success).toBe(true);
                expect(result.data).toEqual(mockQueue);
            });

            it("returns the failure response from queryQueue when it fails", async () => {
                queueModel.queryQueue.mockResolvedValue({
                    success: false,
                    message: "Not assigned to this event",
                    data: undefined,
                });

                const result = await manager.invokeQueryQueue(baseFilter);

                expect(result.success).toBe(false);
                expect(result.message).toBe("Not assigned to this event");
            });
        });
    });

    describe("invokeDeleteQueue", () => {
        const donorTarget: DeleteQueue = { id: BigInt(5) };

        describe("when the user is not authorized", () => {
            it("returns the gate failure response without calling deleteQueue", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                const result = await manager.invokeDeleteQueue(donorTarget);

                expect(result).toEqual({ success: false, message: "Not authorized" });
                expect(queueModel.deleteQueue).not.toHaveBeenCalled();
            });
        });

        describe("when the user is authorized", () => {
            beforeEach(() => {
                (helpGateKeep as jest.Mock).mockResolvedValue(authorizedGateResponse);
            });

            it("calls deleteQueue with the provided donor target", async () => {
                queueModel.deleteQueue.mockResolvedValue({
                    success: true,
                    message: "Donor dequeued",
                });

                await manager.invokeDeleteQueue(donorTarget);

                // the controller passes donorTarget through unchanged
                expect(queueModel.deleteQueue).toHaveBeenCalledWith(donorTarget);
            });

            it("returns the outcome from deleteQueue", async () => {
                queueModel.deleteQueue.mockResolvedValue({
                    success: true,
                    message: "Donor dequeued",
                });

                const result = await manager.invokeDeleteQueue(donorTarget);

                expect(result.success).toBe(true);
                expect(result.message).toBe("Donor dequeued");
            });
        });
    });

    describe("invokeAddToQueue", () => {
        const queueTarget: CreateQueue = {
            event_log_id: BigInt(10),
            donor_id: BigInt(99),
        };

        describe("when the user is not authorized", () => {
            it("returns the gate failure response without calling addToQueue", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                const result = await manager.invokeAddToQueue(queueTarget);

                expect(result).toEqual({ success: false, message: "Not authorized" });
                expect(queueModel.addToQueue).not.toHaveBeenCalled();
            });
        });

        describe("when the user is authorized", () => {
            beforeEach(() => {
                (helpGateKeep as jest.Mock).mockResolvedValue(authorizedGateResponse);
            });

            it("calls addToQueue with the provided queue target", async () => {
                queueModel.addToQueue.mockResolvedValue({
                    success: true,
                    message: "Donor enqueued",
                });

                await manager.invokeAddToQueue(queueTarget);

                expect(queueModel.addToQueue).toHaveBeenCalledWith(queueTarget);
            });

            it("returns the outcome from addToQueue", async () => {
                queueModel.addToQueue.mockResolvedValue({
                    success: true,
                    message: "Donor enqueued",
                });

                const result = await manager.invokeAddToQueue(queueTarget);

                expect(result.success).toBe(true);
                expect(result.message).toBe("Donor enqueued");
            });
        });
    });


    describe("invokeUpdateQueueStation", () => {
        const queueTarget: UpdateQueue = {
            id: BigInt(3),
            station: "med_queue",
            profiles_id: dummyProfile.id,
        };

        describe("when the user is not authorized", () => {
            it("returns the gate failure response without calling updateQueueStation", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                const result = await manager.invokeUpdateQueueStation(queueTarget);

                expect(result).toEqual({ success: false, message: "Not authorized" });
                expect(queueModel.updateQueueStation).not.toHaveBeenCalled();
            });
        });

        describe("when the user is authorized", () => {
            beforeEach(() => {
                (helpGateKeep as jest.Mock).mockResolvedValue(authorizedGateResponse);
            });

            it("overwrites profiles_id with the authenticated user's id", async () => {
                queueModel.updateQueueStation.mockResolvedValue({
                    success: true,
                    message: "Donor station updated",
                });

                await manager.invokeUpdateQueueStation(queueTarget);

                // the controller spreads queueTarget but replaces profiles_id with
                // res.data.id
                expect(queueModel.updateQueueStation).toHaveBeenCalledWith({
                    ...queueTarget,
                    profiles_id: dummyProfile.id,
                });
            });

            it("returns the outcome from updateQueueStation", async () => {
                queueModel.updateQueueStation.mockResolvedValue({
                    success: true,
                    message: "Donor station updated",
                });

                const result = await manager.invokeUpdateQueueStation(queueTarget);

                expect(result.success).toBe(true);
                expect(result.message).toBe("Donor station updated");
            });
        });
    });

    describe("invokePickNextQueue", () => {
        const eventId = BigInt(10);

        describe("when the user is not authorized", () => {
            it("returns the gate failure response without querying", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                const result = await manager.invokePickNextQueue(eventId);

                expect(result).toEqual({ success: false, message: "Not authorized" });
                expect(queueModel.queryQueue).not.toHaveBeenCalled();
            });
        });

        describe("when the user is authorized", () => {
            beforeEach(() => {
                (helpGateKeep as jest.Mock).mockResolvedValue(authorizedGateResponse);
                (getQueueStation as jest.Mock).mockReturnValue("med_queue");
            });

            it("returns a busy message if the user is already handling a donor", async () => {
                // first queryQueue call (busy check) returns an occupied slot
                // station: null means the donor is actively being handled
                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    message: "Queue retrieved",
                    data: [{ id: BigInt(1), event_log_id: eventId, donor_id: BigInt(99), station: null, profile_id: dummyProfile.id }],
                });

                const result = await manager.invokePickNextQueue(eventId);

                expect(result).toEqual({
                    success: false,
                    message: "You are already handling a donor",
                });
                // updateQueueStation should never be called if the user is busy
                expect(queueModel.updateQueueStation).not.toHaveBeenCalled();
            });

            it("returns a failure if getQueueStation returns undefined for the user's role", async () => {
                // busy check passes (empty = not handling anyone).
                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    message: "Queue is empty",
                    data: [],
                });
                // simulate a role that has no station mapping (e.g. onsite_admin).
                (getQueueStation as jest.Mock).mockReturnValue(undefined);

                const result = await manager.invokePickNextQueue(eventId);

                expect(result).toEqual({
                    success: false,
                    message: "Invalid role for queue",
                    data: undefined,
                });
            });

            it("returns a failure when the queue is empty for the user's station", async () => {
                // Busy check passes
                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    message: "Queue is empty",
                    data: [],
                });
                // Station queue check also returns empty — no donor to pick.
                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    message: "Queue is empty",
                    data: [],
                });

                const result = await manager.invokePickNextQueue(eventId);

                expect(result.success).toBe(true);
                expect(result.data).toBeUndefined();
            });

            it("assigns the next donor and updates the queue station on success", async () => {
                const nextDonor: ViewQueue = {
                    id: BigInt(7),
                    event_log_id: eventId,
                    donor_id: BigInt(42),
                    station: "med_queue",
                    profile_id: null,
                };

                // busy check - user is free
                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    message: "Queue retrieved",
                    data: [],
                });
                // station queue - returns the next donor in line
                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    message: "Queue retrieved",
                    data: [nextDonor],
                });
                queueModel.updateQueueStation.mockResolvedValue({
                    success: true,
                    message: "Donor station updated",
                });

                const result = await manager.invokePickNextQueue(eventId);

                // confirms the update was called with station: null and the
                // authenticated user's id as profiles_id
                expect(queueModel.updateQueueStation).toHaveBeenCalledWith({
                    id: nextDonor.id,
                    station: null,
                    profiles_id: dummyProfile.id,
                });

                expect(result.success).toBe(true);
                expect(result.message).toContain("Donor assigned");
                // verifies the returned donor has station cleared and profile_id set
                expect(result.data?.station).toBeNull();
                expect(result.data?.profile_id).toBe(dummyProfile.id);
            });

            it("returns a failure if updateQueueStation fails after picking a donor", async () => {
                const nextDonor: ViewQueue = {
                    id: BigInt(7),
                    event_log_id: eventId,
                    donor_id: BigInt(42),
                    station: "med_queue",
                    profile_id: null,
                };

                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    data: [],
                    message: "Queue is empty",
                });
                queueModel.queryQueue.mockResolvedValueOnce({
                    success: true,
                    message: "Queue retrieved",
                    data: [nextDonor],
                });
                // update fails
                queueModel.updateQueueStation.mockResolvedValue({
                    success: false,
                    message: "Update failed",
                });

                const result = await manager.invokePickNextQueue(eventId);

                expect(result.success).toBe(false);
                expect(result.message).toBe("Update failed");
                expect(result.data).toBeUndefined();
            });
        });
    });
});