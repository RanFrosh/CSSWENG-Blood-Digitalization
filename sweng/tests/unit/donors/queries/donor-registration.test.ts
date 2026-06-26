import { registerDonor } from "@/db/queries/donor-registration";
import { orm } from "@/db/drizzle";
import { donor } from "@/db/models/donor";

jest.mock("@/db/models/donor", () => ({
  donor: {},
}));

jest.mock("@/db/drizzle", () => ({
  orm: {
    insert: jest.fn(),
  },
}));

describe("registerDonor", () => {
  const mockReturning = jest.fn();
  const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
  const mockInsert = jest.fn().mockReturnValue({ values: mockValues });

  beforeEach(() => {
    jest.clearAllMocks();
    (orm.insert as jest.Mock) = mockInsert;
  });

  const sampleRequest = {
    firstName: "Juan",
    middleName: "Santos",
    lastName: "dela Cruz",
    email: "juan@example.com",
    mobileNumber: "09171234567",
    addressLine1: "123 Rizal St",
    addressLine2: "Brgy. Poblacion",
    zipCode: "1200",
    sex: "Male",
    bloodType: "O+",
    city: "1",
  };

  it("inserts a donor and returns the created record", async () => {
    const createdDonor = {
      id: BigInt(1),
      first_name: "Juan",
      last_name: "dela Cruz",
      email: "juan@example.com",
      active: true,
    };

    mockReturning.mockResolvedValue([createdDonor]);

    const result = await registerDonor(sampleRequest);

    expect(orm.insert).toHaveBeenCalledWith(donor);

    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "Juan",
        last_name: "dela Cruz",
        email: "juan@example.com",
        mobile_no: "09171234567",
        zip_code: "1200",
        sex: "Male",
        blood: "O+",
        photo_path: "placeholder.jpg", 
        city_id: BigInt(1),
      })
    );

    expect(result).toEqual(createdDonor);
  });

  it("combines addressLine1 and addressLine2 into the street field", async () => {
    mockReturning.mockResolvedValue([{ id: BigInt(2) }]);

    await registerDonor(sampleRequest);

    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        street: "123 Rizal St Brgy. Poblacion",
      })
    );
  });

  it("handles missing addressLine2 gracefully", async () => {
    mockReturning.mockResolvedValue([{ id: BigInt(3) }]);

    await registerDonor({ ...sampleRequest, addressLine2: undefined });

    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        street: "123 Rizal St",
      })
    );
  });

  it("returns null when the insert returns nothing", async () => {
    mockReturning.mockResolvedValue([]);

    const result = await registerDonor(sampleRequest);

    expect(result).toBeNull();
  });
});
