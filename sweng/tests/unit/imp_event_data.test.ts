import { ImpEventModel } from "@/app/event_records/imp_event_data";
import { CreateEvents, CreateCorrections, ViewEventFilters, ViewCorrectionFilters, ViewEvents, ViewCorrections } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";

// mock ORM 

const mockOrm = {
  select: jest.fn(),
  insert: jest.fn(),
} as any;

function setupSelectChain(returnValue: any[]) {
  mockOrm.select.mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockResolvedValue(returnValue),
      }),
    }),
  });
}

function setupInsertChain() {
  mockOrm.insert.mockReturnValue({
    values: jest.fn().mockResolvedValue([]),
  });
}

// fake data

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
  ref_event_id: BigInt(1),
};

const noSort: Sorter<any> = [];

// tests

describe("ImpEventModel", () => {
  let model: ImpEventModel;

  beforeEach(() => {
    jest.clearAllMocks();
    model = new ImpEventModel(mockOrm);
  });

  // queryEvent 

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
      setupSelectChain([fakeEvent]);

      const result = await model.queryEvent({}, noSort);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([fakeEvent]);
    });

    it("sorts events ascending", async () => {
      setupSelectChain([fakeEvent]);
      const sort: Sorter<ViewEvents> = [{ col: "name", direction: "up" }];

      const result = await model.queryEvent({}, sort);

      expect(result.success).toBe(true);
    });

    it("sorts events descending", async () => {
      setupSelectChain([fakeEvent]);
      const sort: Sorter<ViewEvents> = [{ col: "name", direction: "down" }];

      const result = await model.queryEvent({}, sort);

      expect(result.success).toBe(true);
    });

    it("returns failure on db error", async () => {
      mockOrm.select.mockImplementation(() => { throw new Error("DB connection lost"); });

      const result = await model.queryEvent({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("DB connection lost");
      expect(result.data).toBeUndefined();
    });
  });

  // createEvent 

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
      mockOrm.insert.mockImplementation(() => { throw new Error("Insert failed"); });

      const result = await model.createEvent(newEvent);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Insert failed");
    });
  });

  // queryCorrection 

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

  // createCorrection 

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
      ref_event_id: BigInt(1),
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