import { DELETE } from "@/app/api/super-admin/donors/[id]/route";
import { softDeleteDonor } from "@/db/queries/donor-deletion";

jest.mock("@/db/queries/donor-deletion", () => ({
  softDeleteDonor: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      status: init?.status ?? 200,
    })),
  },
}));

function makeRequest(body: object): Request {
  return {
    json: async () => body,
  } as unknown as Request;
}

function makeContext(id: string) {
  return { params: { id } };
}

describe("DELETE /api/super-admin/donors/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fakeDonor = {
    id: BigInt(1),
    first_name: "Juan",
    last_name: "dela Cruz",
    email: "juan@example.com",
    active: false,
    delete_reason: "Duplicate",
    delete_datetime: new Date(),
    deleted_by: null,
    city_id: BigInt(5),
  };

  it("returns 200 with the deleted donor on success", async () => {
    (softDeleteDonor as jest.Mock).mockResolvedValue(fakeDonor);

    const request = makeRequest({ reason: "Duplicate" });
    const response = await DELETE(request, makeContext("1"));

    expect(softDeleteDonor).toHaveBeenCalledWith({
      donorId: "1",
      reason: "Duplicate",
      deletedBy: null,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Donor deleted successfully");

    expect(response.body.donor.id).toBe("1");
    expect(response.body.donor.city_id).toBe("5");
  });

  it("returns 404 when the donor does not exist", async () => {
    (softDeleteDonor as jest.Mock).mockResolvedValue(null);

    const request = makeRequest({ reason: "Not found reason" });
    const response = await DELETE(request, makeContext("999"));

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Donor not found");
  });

  it("returns 400 when reason is missing", async () => {
    const request = makeRequest({}); 
    const response = await DELETE(request, makeContext("1"));

    expect(softDeleteDonor).not.toHaveBeenCalled();

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Deletion reason is required");
  });

  it("returns 500 when softDeleteDonor throws an error", async () => {
    (softDeleteDonor as jest.Mock).mockRejectedValue(new Error("DB crash"));

    const request = makeRequest({ reason: "Test" });
    const response = await DELETE(request, makeContext("1"));

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Failed to delete donor");
  });
});
