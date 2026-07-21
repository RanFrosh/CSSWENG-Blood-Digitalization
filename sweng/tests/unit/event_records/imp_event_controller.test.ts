// tests for ImpEventManager class in the controller layer
// the controller checks permissions via helpGateKeep before calling the data model.
// the tests mock helpGateKeep and the data model to verify that the controller behaves correctly.

import { ImpEventManager } from "@/app/event_records/imp_event_controller";
import { EventData } from "@/abstract/events/event_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { CreateEvents, CreateCorrections, ViewEventFilters, ViewCorrectionFilters, ViewEvents, ViewCorrections } from "@/types/event_type";
import { Sorter } from "@/types/sort_type";

// mocks

// mock helpGateKeep to simulate authorized and unauthorized users per test
jest.mock("@/app/global/helper_bouncer/bouncer", () => ({
  helpGateKeep: jest.fn(),
}));

import { helpGateKeep } from "@/app/global/helper_bouncer/bouncer";

// mock the data model so we don't hit a real database
const mockEventModel: jest.Mocked<EventData> = {
  queryEvent: jest.fn(),
  createEvent: jest.fn(),
  queryCorrection: jest.fn(),
  createCorrection: jest.fn(),
};

// mock the profile reader to simulate getting the current user
const mockProfileReader: jest.Mocked<ProfileSessionProvider> = {
  getCurrentUser: jest.fn(),
};

// fake data

// matches the event_log table structure in the database
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

// matches the correction_event table schema
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
  ref_profile_id: "550e8400-e29b-41d4-a716-446655440000",
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

// the controller fetches and appends ref_profile_id automatically
const newCorrection: Omit<CreateCorrections, "ref_profile_id"> = {
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

const fakeProfileId = "550e8400-e29b-41d4-a716-446655440000";

// helpGateKeep returns data on success (the authenticated user's profile),
// and the controller checks !res.data as part of its guard clause —
// so every "authorized" mock needs this, not just success: true
const fakeAuthorizedProfile = { id: fakeProfileId, role: "director" };

const noSort: Sorter<any> = [];

// tests

describe("ImpEventManager", () => {
  let controller: ImpEventManager;

  // reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ImpEventManager(mockEventModel, mockProfileReader);
  });

  // invokeQueryEvent (requires "view_event" permission)

  describe("invokeQueryEvent", () => {
    it("returns events when user has permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
      mockEventModel.queryEvent.mockResolvedValue({ success: true, message: "Events retrieved", data: [fakeEvent] });

      const result = await controller.invokeQueryEvent({ name: "Blood Drive" }, noSort);

      // verify the correct permission was checked
      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "view_event");
      expect(mockEventModel.queryEvent).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual([fakeEvent]);
    });

    it("blocks and does not query when user lacks permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Not authorized" });

      const result = await controller.invokeQueryEvent({}, noSort);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "view_event");
      expect(mockEventModel.queryEvent).not.toHaveBeenCalled(); // model must not be called if user is unauthorized
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not authorized");
    });

    it("blocks when user has no role", async () => {
      // this specifically tests the case where helpGateKeep returns a failure due to the user having no role
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: false, message: "Somehow there is no role" });

      const result = await controller.invokeQueryEvent({}, noSort);

      expect(mockEventModel.queryEvent).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Somehow there is no role");
    });

    it("returns failure when model fails", async () => {
      // needs data here too, since the guard clause must be passed before the model is even reached
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
      mockEventModel.queryEvent.mockResolvedValue({ success: false, message: "DB error", data: undefined });

      const result = await controller.invokeQueryEvent({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("DB error");
    });
  });

  // invokeCreateEvent (requires "create_event" permission)

  describe("invokeCreateEvent", () => {
    it("creates event when user has permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
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
      expect(mockEventModel.createEvent).not.toHaveBeenCalled(); // no insert should be attempted if user is unauthorized
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
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
      mockEventModel.createEvent.mockResolvedValue({ success: false, message: "Insert failed" });

      const result = await controller.invokeCreateEvent(newEvent);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Insert failed");
    });
  });

  // invokeQueryCorrection (requires "view_correct_event" permission)

  describe("invokeQueryCorrection", () => {
    it("returns corrections when user has permission", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
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
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
      mockEventModel.queryCorrection.mockResolvedValue({ success: false, message: "Query failed", data: undefined });

      const result = await controller.invokeQueryCorrection({}, noSort);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Query failed");
    });
  });

  // invokeCreateCorrection (requires "create_correct_event" permission)

  describe("invokeCreateCorrection", () => {
    it("creates correction and appends ref_profile_id automatically", async () => {
      // ref_profile_id comes from helpGateKeep's res.data.id — the controller
      // does NOT call mockProfileReader.getCurrentUser directly for this
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
      mockEventModel.createCorrection.mockResolvedValue({ success: true, message: "Correction created" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(helpGateKeep).toHaveBeenCalledWith(mockProfileReader, "create_correct_event");
      expect(mockEventModel.createCorrection).toHaveBeenCalledWith({ ...newCorrection, ref_profile_id: fakeProfileId });
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

    it("blocks when profile is missing (no data returned)", async () => {
      // success: true but data is missing, the controller's guard clause
      // (!res.success || !res.data) should still block this
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Profile not found", data: undefined });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(mockEventModel.createCorrection).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Profile not found");
    });

    it("returns failure when model fails", async () => {
      (helpGateKeep as jest.Mock).mockResolvedValue({ success: true, message: "Authorized", data: fakeAuthorizedProfile });
      mockEventModel.createCorrection.mockResolvedValue({ success: false, message: "Correction insert failed" });

      const result = await controller.invokeCreateCorrection(newCorrection);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Correction insert failed");
    });
  });
});