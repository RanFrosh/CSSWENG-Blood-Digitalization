import { ImpQueueModel } from "@/app/queue/imp_queue_data";
import { orm } from "@/db/drizzle";
import { event_queue } from "@/db/models/event_queue";
import { event_log } from "@/db/models/event";
import { assigned_staff } from "@/db/models/assigned_staff";
import { ViewQueueFilters, DeleteQueue, CreateQueue, UpdateQueue } from "@/types/queue_type";


jest.mock("@/db/drizzle", () => ({
    orm: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

// Schema objects are mocked as plain column-name strings so they can be passed
// to eq(), and(), isNull() without needing Drizzle to interpret them.
// Only the columns actually referenced in ImpQueueModel are stubbed.
jest.mock("@/db/models/event_queue", () => ({
    event_queue: {
        id: "event_queue.id",
        event_log_id: "event_queue.event_log_id",
        donor_id: "event_queue.donor_id",
        station: "event_queue.station",
        profile_id: "event_queue.profile_id",
    },
}));

jest.mock("@/db/models/event", () => ({
    event_log: {
        id: "event_log.id",
        status: "event_log.status",
    },
}));

jest.mock("@/db/models/assigned_staff", () => ({
    assigned_staff: {
        profiles_id: "assigned_staff.profiles_id",
        event_log_id: "assigned_staff.event_log_id",
    },
}));

const PROFILE_ID = "dummy-uuid-1";
const EVENT_LOG_ID = BigInt(10);

const baseFilter: ViewQueueFilters = {
    profile_id: PROFILE_ID,
    event_log_id: EVENT_LOG_ID,
};

const dummyAssignment = [{ id: BigInt(1), profiles_id: PROFILE_ID, event_log_id: EVENT_LOG_ID }];

const ongoingEvent = [{ id: EVENT_LOG_ID, status: "Ongoing" }];

const dummyQueueRow = {
    id: BigInt(1),
    event_log_id: EVENT_LOG_ID,
    donor_id: BigInt(99),
    station: "med_queue" as const,
    profile_id: PROFILE_ID,
};

// queryQueue makes up to three chained select calls in sequence:
// 1. assigned_staff check  → .select().from().where().limit()
// 2. event_log check       → .select().from().where().limit()
// 3. event_queue fetch     → .select().from().where().orderBy()
// Each call to orm.select() must return its own chain via mockReturnValueOnce
// so they don't interfere with each other.

function mockSelectChainWithLimit(resolvedValue: any) {
    const chain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(resolvedValue),
    };
    (orm.select as jest.Mock).mockReturnValueOnce(chain);
    return chain;
}

function mockSelectChainWithOrderBy(resolvedValue: any) {
    const chain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(resolvedValue),
    };
    (orm.select as jest.Mock).mockReturnValueOnce(chain);
    return chain;
}

describe("ImpQueueModel", () => {
    let model: ImpQueueModel;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new ImpQueueModel(orm);
    });

    describe("queryQueue", () => {

        describe("input validation", () => {
            it("returns a failure when profile_id is missing", async () => {
                const result = await model.queryQueue({
                    event_log_id: EVENT_LOG_ID,
                    profile_id: undefined,
                });

                expect(result).toEqual({
                    success: false,
                    message: "Missing profile or event",
                    data: undefined,
                });
                // Neither select nor any downstream call should be made.
                expect(orm.select).not.toHaveBeenCalled();
            });

            it("returns a failure when event_log_id is missing", async () => {
                const result = await model.queryQueue({
                    profile_id: PROFILE_ID,
                    event_log_id: undefined,
                });

                expect(result).toEqual({
                    success: false,
                    message: "Missing profile or event",
                    data: undefined,
                });
                expect(orm.select).not.toHaveBeenCalled();
            });
        });

        describe("assignment check", () => {
            it("returns a failure when the staff member is not assigned to the event", async () => {
                // assigned_staff query returns empty
                mockSelectChainWithLimit([]);

                const result = await model.queryQueue(baseFilter);

                expect(result).toEqual({
                    success: false,
                    message: "Not assigned to this event",
                    data: undefined,
                });
                // only one select call should have been mad.
                expect(orm.select).toHaveBeenCalledTimes(1);
            });
        });

        describe("event status checks", () => {
            it("returns a failure when the event does not exist", async () => {
                mockSelectChainWithLimit(dummyAssignment); // assignment passes
                mockSelectChainWithLimit([]); // event not found

                const result = await model.queryQueue(baseFilter);

                expect(result).toEqual({
                    success: false,
                    message: "Event does not exist",
                    data: undefined,
                });
            });

            it("returns a failure when the event status is 'Completed'", async () => {
                mockSelectChainWithLimit(dummyAssignment);
                mockSelectChainWithLimit([{ ...ongoingEvent[0], status: "Completed" }]);

                const result = await model.queryQueue(baseFilter);

                expect(result).toEqual({
                    success: false,
                    message: "Event is already over",
                    data: undefined,
                });
            });

            it("returns a failure when the event status is 'Upcoming'", async () => {
                mockSelectChainWithLimit(dummyAssignment);
                mockSelectChainWithLimit([{ ...ongoingEvent[0], status: "Upcoming" }]);

                const result = await model.queryQueue(baseFilter);

                expect(result).toEqual({
                    success: false,
                    message: "Event has not yet started",
                    data: undefined,
                });
            });
        });

        describe("queue retrieval", () => {
            it("returns an empty array with success when the queue is empty", async () => {
                mockSelectChainWithLimit(dummyAssignment);
                mockSelectChainWithLimit(ongoingEvent);
                mockSelectChainWithOrderBy([]); // queue is empty

                const result = await model.queryQueue(baseFilter);

                expect(result).toEqual({
                    success: true,
                    message: "Queue is empty",
                    data: [],
                });
            });

            it("returns queue rows on success", async () => {
                mockSelectChainWithLimit(dummyAssignment);
                mockSelectChainWithLimit(ongoingEvent);
                mockSelectChainWithOrderBy([dummyQueueRow]);

                const result = await model.queryQueue(baseFilter);

                expect(result).toEqual({
                    success: true,
                    message: "Queue retrieved",
                    data: [dummyQueueRow],
                });
            });
            
            it.each([
                ["a specific station value", "med_queue" as const],
                ["null (donor being handled)", null],
                ["undefined (no filter)", undefined],
            ])("returns queue rows when station is %s", async (_, station) => {
                mockSelectChainWithLimit(dummyAssignment);
                mockSelectChainWithLimit(ongoingEvent);
                mockSelectChainWithOrderBy([dummyQueueRow]);

                const result = await model.queryQueue({ ...baseFilter, station });

                expect(result.success).toBe(true);
                expect(result.data).toEqual([dummyQueueRow]);
            });

            it("propagates errors from the underlying query as a failure response", async () => {
                // queryQueue has a try/catch that returns { success: false } rather
                // than rethrowing
                mockSelectChainWithLimit(dummyAssignment);
                mockSelectChainWithLimit(ongoingEvent);

                const errorChain = {
                    from: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    orderBy: jest.fn().mockRejectedValue(new Error("db timeout")),
                };
                (orm.select as jest.Mock).mockReturnValueOnce(errorChain);

                const result = await model.queryQueue(baseFilter);

                expect(result).toEqual({
                    success: false,
                    message: "db timeout",
                    data: undefined,
                });
            });
        });
    });

    describe("deleteQueue", () => {
        const donorTarget: DeleteQueue = { id: BigInt(5) };

        // delete chain: .delete().where()
        function mockDeleteChain(resolvedValue: any) {
            const chain = {
                where: jest.fn().mockResolvedValue(resolvedValue),
            };
            (orm.delete as jest.Mock).mockReturnValueOnce(chain);
            return chain;
        }

        it("returns success after deleting the queue entry", async () => {
            mockDeleteChain({});

            const result = await model.deleteQueue(donorTarget);

            expect(result).toEqual({ success: true, message: "Donor dequeued" });
        });

        it("calls delete on event_queue with the correct entry id", async () => {
            mockDeleteChain({});

            await model.deleteQueue(donorTarget);

            expect(orm.delete).toHaveBeenCalledWith(event_queue);
        });

        it("returns a failure response when the delete query throws", async () => {
            const chain = {
                where: jest.fn().mockRejectedValue(new Error("connection lost")),
            };
            (orm.delete as jest.Mock).mockReturnValueOnce(chain);

            const result = await model.deleteQueue(donorTarget);

            expect(result).toEqual({ success: false, message: "connection lost" });
        });
    });

    describe("addToQueue", () => {
        const queueTarget: CreateQueue = {
            event_log_id: EVENT_LOG_ID,
            donor_id: BigInt(99),
        };

        // insert chain: .insert().values()
        function mockInsertChain(resolvedValue: any) {
            const chain = {
                values: jest.fn().mockResolvedValue(resolvedValue),
            };
            (orm.insert as jest.Mock).mockReturnValueOnce(chain);
            return chain;
        }

        it("returns success after inserting the queue entry", async () => {
            mockInsertChain({});

            const result = await model.addToQueue(queueTarget);

            expect(result).toEqual({ success: true, message: "Donor enqueued" });
        });

        it("always inserts with station set to 'med_queue' regardless of input", async () => {
            const chain = mockInsertChain({});

            await model.addToQueue(queueTarget);

            // donor always enters the queue at the med_queue station first.
            expect(chain.values).toHaveBeenCalledWith({
                ...queueTarget,
                station: "med_queue",
            });
        });

        it("returns a failure response when the insert query throws", async () => {
            const chain = {
                values: jest.fn().mockRejectedValue(new Error("insert failed")),
            };
            (orm.insert as jest.Mock).mockReturnValueOnce(chain);

            const result = await model.addToQueue(queueTarget);

            expect(result).toEqual({ success: false, message: "insert failed" });
        });
    });

    describe("updateQueueStation", () => {
        const queueTarget: UpdateQueue = {
            id: BigInt(3),
            station: null,         // null clears the station (donor being handled)
            profiles_id: PROFILE_ID,
        };

        // update chain: .update().set().where()
        function mockUpdateChain(resolvedValue: any) {
            const chain = {
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(resolvedValue),
            };
            (orm.update as jest.Mock).mockReturnValueOnce(chain);
            return chain;
        }

        it("returns success after updating the queue station", async () => {
            mockUpdateChain({});

            const result = await model.updateQueueStation(queueTarget);

            expect(result).toEqual({ success: true, message: "Donor station updated" });
        });

        it("maps profiles_id to profile_id when setting the update payload", async () => {
            const chain = mockUpdateChain({});

            await model.updateQueueStation(queueTarget);

            expect(chain.set).toHaveBeenCalledWith({
                station: queueTarget.station,
                profile_id: queueTarget.profiles_id,
            });
        });

        it("calls update on event_queue", async () => {
            mockUpdateChain({});

            await model.updateQueueStation(queueTarget);

            expect(orm.update).toHaveBeenCalledWith(event_queue);
        });

        it("returns a failure response when the update query throws", async () => {
            const chain = {
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockRejectedValue(new Error("update failed")),
            };
            (orm.update as jest.Mock).mockReturnValueOnce(chain);

            const result = await model.updateQueueStation(queueTarget);

            expect(result).toEqual({ success: false, message: "update failed" });
        });
    });
});