// tests for ImpEventModel class in the data layer
// the model builds and runs DB queries using the injected ORM. The tests mock the ORM to verify that the model behaves correctly.
// we mock the ORM so no real database connection is needed.

import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { CreateEvents, CreateCorrections, ViewEventFilters, ViewCorrectionFilters, ViewEvents, ViewCorrections } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";

// mock ORM 

// replace the real Drizzle ORM with a mock
const mockOrm = {
  select: jest.fn(),
  insert: jest.fn(),
} as any;

// Drizzle uses method chaining: .select().from().where().orderBy() 
// helper function that sets up the chain to resolve to a given return value. 
function setupSelectChain(returnValue: any[]) {
  mockOrm.select.mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockResolvedValue(returnValue),
      }),
    }),
  });
}

// Drizzle insert chain: .insert().values() (resolves with empty array on success)
function setupInsertChain() {
  mockOrm.insert.mockReturnValue({
    values: jest.fn().mockResolvedValue([]),
  });
}

// fake data

// matches the event_log table structure
const fakeEvent = {
  id: BigInt(1),
  created_at: new Date(),
  visitors: BigInt(100),
  extractions: BigInt(80),
  produced_bags: BigInt(75),
  target_blood: BigInt(90),
  perk_claims: BigInt(50),
  name: "Blood Drive",
  city_id: BigInt(5),
  zip_code: "1000",
  street: "123 Main St",
};

// matches the correction_log table structure
const fakeCorrection = {
  id: BigInt(2),
  created_at: new Date(),
  visitors: BigInt(110),
  extractions: BigInt(85),
  produced_bags: BigInt(80),
  target_blood: BigInt(95),
  perk_claims: BigInt(55),
  name: "Blood Drive Fix",
  city_id: BigInt(5),
  zip_code: "1001",
  street: "456 Elm St",
  ref_event_id: BigInt(1), // references the original event that this correction is for
};

// empty sorter for tests that don't require sorting
const noSort: Sorter<any> = [];

// tests

describe("ImpEventModel", () => {
  let model: ImpEventModel;

  // reset mocks and create a new model instance before each test
  beforeEach(() => {
    jest.clearAllMocks();
    model = new ImpEventModel(mockOrm);
  });

  // queryEvent fetches events from the event_log table based on filters and sorting

  describe("queryEvent", () => {
    it("returns events on success with filters", async () => {
      setupSelectChain([fakeEvent]);
      const filters: ViewEventFilters = { name: "Blood Drive" };

      const result = await model.queryEvent(filters, noSort);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Events retrieved");
      expect(result.data).toEqual([fakeEvent]);
    });

    it("returns events with no filters", async () => {
      // no filters means all events are returned
      setupSelectChain([fakeEvent]);

      const result = await model.queryEvent({}, noSort);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([fakeEvent]);
    });

    it("sorts events ascending", async () => {
      // test that the model can sort events in ascending order by a given column
      setupSelectChain([fakeEvent]);
      const sort: Sorter<ViewEvents> = [{ col: "name", direction: "up" }];

      const result = await model.queryEvent({}, sort);

      expect(result.success).toBe(true);
    });

    it("sorts events descending", async () => {
      // test that the model can sort events in descending order by a given column
      setupSelectChain([fakeEvent]);
      const sort: Sorter<ViewEvents> = [{ col: "name", direction: "down" }];

      const result = await model.queryEvent({}, sort);

      expect(result.success).toBe(true);
    });

    it("returns failure on db error", async () => {
      // simulate a database error by making the mock ORM throw an error when select is called
      mockOrm.select.mockImplementation(() => { throw new Error("DB connection lost"); });

      const result = await model.queryEvent({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("DB connection lost");
      expect(result.data).toBeUndefined();
    });
  });

  // createEvent that inserts a new event into the event_log table

  describe("createEvent", () => {
    const newEvent: CreateEvents = {
      visitors: BigInt(100),
      extractions: BigInt(80),
      produced_bags: BigInt(75),
      target_blood: BigInt(90),
      perk_claims: BigInt(50),
      name: "New Blood Drive",
      city_id: BigInt(5),
      zip_code: "1002",
      street: "789 Oak Ave",
    };

    it("returns success when event is created", async () => {
      setupInsertChain();

      const result = await model.createEvent(newEvent);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Event created");
    });

    it("returns failure on db error", async () => {
      // simulate insert failure
      mockOrm.insert.mockImplementation(() => { throw new Error("Insert failed"); });

      const result = await model.createEvent(newEvent);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Insert failed");
    });
  });

  // queryCorrection that fetches corrections from the correction_log table based on filters and sorting

  describe("queryCorrection", () => {
    it("returns corrections on success with filters", async () => {
      setupSelectChain([fakeCorrection]);
      const filters: ViewCorrectionFilters = { name: "Blood Drive Fix" };

      const result = await model.queryCorrection(filters, noSort);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Corrections retrieved");
      expect(result.data).toEqual([fakeCorrection]);
    });

    it("returns corrections with no filters", async () => {
      setupSelectChain([fakeCorrection]);

      const result = await model.queryCorrection({}, noSort);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([fakeCorrection]);
    });

    it("sorts corrections ascending", async () => {
      setupSelectChain([fakeCorrection]);
      const sort: Sorter<ViewCorrections> = [{ col: "name", direction: "up" }];

      const result = await model.queryCorrection({}, sort);

      expect(result.success).toBe(true);
    });

    it("sorts corrections descending", async () => {
      setupSelectChain([fakeCorrection]);
      const sort: Sorter<ViewCorrections> = [{ col: "name", direction: "down" }];

      const result = await model.queryCorrection({}, sort);

      expect(result.success).toBe(true);
    });

    it("returns failure on db error", async () => {
      mockOrm.select.mockImplementation(() => { throw new Error("Correction query failed"); });

      const result = await model.queryCorrection({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Correction query failed");
      expect(result.data).toBeUndefined();
    });
  });

  // createCorrection that inserts a new correction into corrected_event
  // ref_event_id is required to link the correction to the original event

  describe("createCorrection", () => {
    const newCorrection: CreateCorrections = {
      visitors: BigInt(110),
      extractions: BigInt(85),
      produced_bags: BigInt(80),
      target_blood: BigInt(95),
      perk_claims: BigInt(55),
      name: "Corrected Blood Drive",
      city_id: BigInt(5),
      zip_code: "1003",
      street: "321 Pine Rd",
      ref_event_id: BigInt(1), // required foreign key that links to the event being corrected
    };

    it("returns success when correction is created", async () => {
      setupInsertChain();

      const result = await model.createCorrection(newCorrection);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Correction created");
    });

    it("returns failure on db error", async () => {
      mockOrm.insert.mockImplementation(() => { throw new Error("Correction insert failed"); });

      const result = await model.createCorrection(newCorrection);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Correction insert failed");
    });
  });
});