import { ImpQueueManager } from "@/app/queue/imp_queue_controller";
import { helpGateKeep } from "@/utils/access/bouncer";
import { getQueueStation } from "@/utils/access/permissions";
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
            getNullStations: jest.fn(),
        };

        // profileReader is passed through to helpGateKeep
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

                // Confirms the controller passes profileReader and the correct action
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

                // The controller should spread the original filter and append
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

            it("checks authorization against the 'dequeue' permission", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                await manager.invokeDeleteQueue(donorTarget);

                expect(helpGateKeep).toHaveBeenCalledWith(profileReader, "dequeue");
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

                // The controller passes donorTarget through unchanged
                expect(queueModel.deleteQueue).toHaveBeenCalledWith(donorTarget);
            });

            it("returns the success response from deleteQueue", async () => {
                queueModel.deleteQueue.mockResolvedValue({
                    success: true,
                    message: "Donor dequeued",
                });

                const result = await manager.invokeDeleteQueue(donorTarget);

                expect(result.success).toBe(true);
                expect(result.message).toBe("Donor dequeued");
            });

            it("returns the failure response from deleteQueue when it fails", async () => {
                queueModel.deleteQueue.mockResolvedValue({
                    success: false,
                    message: "Donor not found",
                });

                const result = await manager.invokeDeleteQueue(donorTarget);

                expect(result.success).toBe(false);
                expect(result.message).toBe("Donor not found");
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

            it("checks authorization against the 'dequeue' permission", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                await manager.invokeAddToQueue(queueTarget);

                expect(helpGateKeep).toHaveBeenCalledWith(profileReader, "dequeue");
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

            it("returns the success response from addToQueue", async () => {
                queueModel.addToQueue.mockResolvedValue({
                    success: true,
                    message: "Donor enqueued",
                });

                const result = await manager.invokeAddToQueue(queueTarget);

                expect(result.success).toBe(true);
                expect(result.message).toBe("Donor enqueued");
            });

            it("returns the failure response from addToQueue when it fails", async () => {
                queueModel.addToQueue.mockResolvedValue({
                    success: false,
                    message: "Insert failed",
                });

                const result = await manager.invokeAddToQueue(queueTarget);

                expect(result.success).toBe(false);
                expect(result.message).toBe("Insert failed");
            });
        });
    });

    describe("invokeUpdateQueueStation", () => {
        const queueTarget: UpdateQueue = {
            id: BigInt(3),
            station: "med_queue",
            profiles_id: "old-uuid", // will be overwritten by the controller
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

            it("checks authorization against the 'updatequeue' permission", async () => {
                (helpGateKeep as jest.Mock).mockResolvedValue({
                    success: false,
                    message: "Not authorized",
                });

                await manager.invokeUpdateQueueStation(queueTarget);

                expect(helpGateKeep).toHaveBeenCalledWith(profileReader, "updatequeue");
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

                // The controller spreads queueTarget but replaces profiles_id with
                // res.data.id 
                expect(queueModel.updateQueueStation).toHaveBeenCalledWith({
                    ...queueTarget,
                    profiles_id: dummyProfile.id,
                });
            });

            it("returns the success response from updateQueueStation", async () => {
                queueModel.updateQueueStation.mockResolvedValue({
                    success: true,
                    message: "Donor station updated",
                });

                const result = await manager.invokeUpdateQueueStation(queueTarget);

                expect(result.success).toBe(true);
                expect(result.message).toBe("Donor station updated");
            });

            it("returns the failure response from updateQueueStation when it fails", async () => {
                queueModel.updateQueueStation.mockResolvedValue({
                    success: false,
                    message: "Update failed",
                });

                const result = await manager.invokeUpdateQueueStation(queueTarget);

                expect(result.success).toBe(false);
                expect(result.message).toBe("Update failed");
            });
        });
    });
});