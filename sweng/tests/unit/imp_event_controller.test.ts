import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { EventData } from "@/abstract/events/event_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { CreateEvents, CreateCorrections, ViewEventFilters, ViewCorrectionFilters, ViewEvents, ViewCorrections } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";

// mocks

jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
  helpGateKeep: jest.fn(),
}));

import { helpGateKeep } from "@/app/global/helper_bouncer/bouncer";

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
  let controller: ImpEventManager;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ImpEventManager(mockEventModel, mockProfileReader);
  });

  // invokeQueryEvent 

  describe("invokeQueryEvent", () => {
    it("returns events when user has permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.queryEvent.mockResolvedValue({ success: true, message: "Events retrieved", data: [fakeEvent] });

      const result = await controller.invokeQueryEvent({ name: "Blood Drive" }, noSort);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "view_event");
      expect(mockEventModel.queryEvent).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual([fakeEvent]);
    });

    it("blocks and does not query when user lacks permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Not authorized" });

      const result = await controller.invokeQueryEvent({}, noSort);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "view_event");
      expect(mockEventModel.queryEvent).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not authorized");
    });

    it("blocks when user has no role", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Somehow there is no role" });

      const result = await controller.invokeQueryEvent({}, noSort);

      expect(mockEventModel.queryEvent).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Somehow there is no role");
    });

    it("returns failure when model fails", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.queryEvent.mockResolvedValue({ success: false, message: "DB error", data: undefined });

      const result = await controller.invokeQueryEvent({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("DB error");
    });
  });

  // invokeCreateEvent 

  describe("invokeCreateEvent", () => {
    it("creates event when user has permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.createEvent.mockResolvedValue({ success: true, message: "Event created" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "create_event");
      expect(mockEventModel.createEvent).toHaveBeenCalledWith(newEvent);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Event created");
    });

    it("blocks and does not create when user lacks permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Not authorized" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "create_event");
      expect(mockEventModel.createEvent).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not authorized");
    });

    it("blocks when user has no role", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Somehow there is no role" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(mockEventModel.createEvent).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Somehow there is no role");
    });

    it("returns failure when model fails", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.createEvent.mockResolvedValue({ success: false, message: "Insert failed" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Insert failed");
    });
  });

  // invokeQueryCorrection

  describe("invokeQueryCorrection", () => {
    it("returns corrections when user has permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.queryCorrection.mockResolvedValue({ success: true, message: "Corrections retrieved", data: [fakeCorrection] });

      const result = await controller.invokeQueryCorrection({ name: "Blood Drive Fix" }, noSort);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "view_correct_event");
      expect(mockEventModel.queryCorrection).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual([fakeCorrection]);
    });

    it("blocks and does not query when user lacks permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Not authorized" });

      const result = await controller.invokeQueryCorrection({}, noSort);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "view_correct_event");
      expect(mockEventModel.queryCorrection).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not authorized");
    });

    it("blocks when user has no role", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Somehow there is no role" });

      const result = await controller.invokeQueryCorrection({}, noSort);

      expect(mockEventModel.queryCorrection).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Somehow there is no role");
    });

    it("returns failure when model fails", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.queryCorrection.mockResolvedValue({ success: false, message: "Query failed", data: undefined });

      const result = await controller.invokeQueryCorrection({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Query failed");
    });
  });

  // invokeCreateCorrection 

  describe("invokeCreateCorrection", () => {
    it("creates correction when user has permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.createCorrection.mockResolvedValue({ success: true, message: "Correction created" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "create_correct_event");
      expect(mockEventModel.createCorrection).toHaveBeenCalledWith(newCorrection);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Correction created");
    });

    it("blocks and does not create when user lacks permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Not authorized" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "create_correct_event");
      expect(mockEventModel.createCorrection).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not authorized");
    });

    it("blocks when user has no role", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Somehow there is no role" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(mockEventModel.createCorrection).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Somehow there is no role");
    });

    it("returns failure when model fails", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized" });
      mockEventModel.createCorrection.mockResolvedValue({ success: false, message: "Correction insert failed" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Correction insert failed");
    });
  });
});
