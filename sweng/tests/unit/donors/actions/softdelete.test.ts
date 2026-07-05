import { softDeleteDonorAction } from "@/app/actions/donor-deletion";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

jest.mock("@/db/models/donor", () => ({
  donor: { id: "id" },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn((col, val) => ({ eq: { col, val } })),
}));

describe("softDeleteDonorAction", () => {
  const mockWhere = jest.fn();
  const mockSet = jest.fn().mockReturnValue({
    where: mockWhere,
  });
  const mockUpdate = jest.fn().mockReturnValue({
    set: mockSet,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (orm.update as jest.Mock) = mockUpdate;
  });

  it("soft deletes a donor when valid data is provided", async () => {
    const formData = new FormData();
    formData.append("donorId", "1");
    formData.append("reason", "Duplicate donor");

    await softDeleteDonorAction(formData);

    expect(orm.update).toHaveBeenCalledWith(donor);

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        active: false,
        delete_reason: "Duplicate donor",
        deleted_by: null,
        delete_datetime: expect.any(Date),
      })
    );
  });

  it("throws an error when donorId is missing", async () => {
    const formData = new FormData();
    formData.append("reason", "Duplicate donor");

    await expect(
      softDeleteDonorAction(formData)
    ).rejects.toThrow("Missing donor ID or reason");
  });

  it("throws an error when reason is missing", async () => {
    const formData = new FormData();
    formData.append("donorId", "1");

    await expect(
      softDeleteDonorAction(formData)
    ).rejects.toThrow("Missing donor ID or reason");
  });

  it("throws an error when both donorId and reason are missing", async () => {
    const formData = new FormData();

    await expect(
      softDeleteDonorAction(formData)
    ).rejects.toThrow("Missing donor ID or reason");
  });
});
