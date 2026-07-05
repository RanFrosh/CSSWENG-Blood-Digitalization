import { softDeleteDonor } from "@/db/queries/donor-deletion";

import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

jest.mock("@/db/models/donor", () => ({
  donor: { id: "id" },
}));

jest.mock("@/db/drizzle", () => ({
  orm: {
    update: jest.fn(),
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn((col, val) => ({ col, val })),
}));


describe("softDeleteDonor", () => {
  const mockReturning = jest.fn();
  const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
  const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
  const mockUpdate = jest.fn().mockReturnValue({ set: mockSet });

  beforeEach(() => {
    jest.clearAllMocks();
    (orm.update as jest.Mock) = mockUpdate;
  });

  it("soft deletes a donor and returns the updated donor", async () => {
    const deletedDonor = {
      id: BigInt(1),
      active: false,
      delete_reason: "Duplicate donor",
      deleted_by: BigInt(10),
    };

    mockReturning.mockResolvedValue([deletedDonor]);

    const result = await softDeleteDonor({
      donorId: "1",
      reason: "Duplicate donor",
      deletedBy: BigInt(10),
    });

    expect(orm.update).toHaveBeenCalledWith(donor);

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        active: false,
        delete_reason: "Duplicate donor",
        deleted_by: BigInt(10),
        delete_datetime: expect.any(Date), 
      })
    );

    expect(result).toEqual(deletedDonor);
  });

  it("returns null when the donor does not exist", async () => {
    
    mockReturning.mockResolvedValue([]);

    const result = await softDeleteDonor({
      donorId: "999",
      reason: "Not Found",
    });
    
    expect(result).toBeNull();
  });

  it("defaults deletedBy to null when not provided", async () => {
    const deletedDonor = {
      id: BigInt(2),
      active: false,
      delete_reason: "Requested",
      deleted_by: null,
    };

    mockReturning.mockResolvedValue([deletedDonor]);

    const result = await softDeleteDonor({
      donorId: "2",
      reason: "Requested",
    });

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        deleted_by: null,
      })
    );

    expect(result).toEqual(deletedDonor);
  });
});
