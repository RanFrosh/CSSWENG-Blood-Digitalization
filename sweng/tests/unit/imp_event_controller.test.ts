import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { EventData } from "@/abstract/events/event_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { CreateEvents, CreateCorrections, ViewEventFilters, ViewCorrectionFilters } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";


// mock the entire event_records controller module so helpGateKeep is intercepted
jest.mock("@/app/event_records/imp_event_controller", () => {
  return {
    ImpEventManager: jest.fn().mockImplementation((eventModel, profileReader) => ({
      invokeQueryEvent: jest.fn(),
      invokeCreateEvent: jest.fn(),
      invokeQueryCorrection: jest.fn(),
      invokeCreateCorrection: jest.fn(),
    })),
  };
});

const mockEventModel: jest.Mocked<EventData> = {
  queryEvent: jest.fn(),
  createEvent: jest.fn(),
  queryCorrection: jest.fn(),
  createCorrection: jest.fn(),
};

const mockProfileReader: jest.Mocked<ProfileSessionProvider> = {
  getCurrentUser: jest.fn(),
};

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

const noSort: Sorter<any> = [];

// tests

describe("ImpEventManager", () => {
  let controller: any;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new (ImpEventManager as any)(mockEventModel, mockProfileReader);
  });

  // invokeQueryEvent

  describe("invokeQueryEvent", () => {
    it("returns events when user has permission", async () => {
      controller.invokeQueryEvent.mockResolvedValue({ success: true, message: "Events retrieved", data: [fakeEvent] });

      const result = await controller.invokeQueryEvent({ name: "Blood Drive" }, noSort);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Events retrieved");
      expect(result.data).toEqual([fakeEvent]);
    });

    it("returns failure when user lacks permission", async () => {
      controller.invokeQueryEvent.mockResolvedValue({ success: false, message: "Unauthorized", data: undefined });

      const result = await controller.invokeQueryEvent({ name: "Blood Drive" }, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Unauthorized");
    });

    it("returns failure when model fails", async () => {
      controller.invokeQueryEvent.mockResolvedValue({ success: false, message: "DB error", data: undefined });

      const result = await controller.invokeQueryEvent({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("DB error");
    });
  });

  // invokeCreateEvent 

  describe("invokeCreateEvent", () => {
    it("creates event when user has permission", async () => {
      controller.invokeCreateEvent.mockResolvedValue({ success: true, message: "Event created" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Event created");
    });

    it("returns failure when user lacks permission", async () => {
      controller.invokeCreateEvent.mockResolvedValue({ success: false, message: "Forbidden" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Forbidden");
    });

    it("returns failure when model fails", async () => {
      controller.invokeCreateEvent.mockResolvedValue({ success: false, message: "Insert failed" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Insert failed");
    });
  });

  // invokeQueryCorrection 

  describe("invokeQueryCorrection", () => {
    it("returns corrections when user has permission", async () => {
      controller.invokeQueryCorrection.mockResolvedValue({ success: true, message: "Corrections retrieved", data: [fakeCorrection] });

      const result = await controller.invokeQueryCorrection({ name: "Blood Drive Fix" }, noSort);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Corrections retrieved");
      expect(result.data).toEqual([fakeCorrection]);
    });

    it("returns failure when user lacks permission", async () => {
      controller.invokeQueryCorrection.mockResolvedValue({ success: false, message: "Unauthorized", data: undefined });

      const result = await controller.invokeQueryCorrection({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Unauthorized");
    });

    it("returns failure when model fails", async () => {
      controller.invokeQueryCorrection.mockResolvedValue({ success: false, message: "Query failed", data: undefined });

      const result = await controller.invokeQueryCorrection({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Query failed");
    });
  });

  // invokeCreateCorrection 

  describe("invokeCreateCorrection", () => {
    it("creates correction when user has permission", async () => {
      controller.invokeCreateCorrection.mockResolvedValue({ success: true, message: "Correction created" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Correction created");
    });

    it("returns failure when user lacks permission", async () => {
      controller.invokeCreateCorrection.mockResolvedValue({ success: false, message: "Forbidden" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Forbidden");
    });

    it("returns failure when model fails", async () => {
      controller.invokeCreateCorrection.mockResolvedValue({ success: false, message: "Correction insert failed" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Correction insert failed");
    });
  });
});