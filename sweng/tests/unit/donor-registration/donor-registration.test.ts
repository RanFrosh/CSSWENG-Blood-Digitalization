import { registerDonorAction } from "@/app/oa/events/[eventId]/register/action";

const mockRedirect = jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
});
jest.mock("next/navigation", () => ({
    redirect: (url: string) => mockRedirect(url),
}));

const mockLimit = jest.fn();
const mockWhere = jest.fn(() => ({ limit: mockLimit }));
const mockFrom = jest.fn(() => ({ where: mockWhere }));
const mockSelect = jest.fn(() => ({ from: mockFrom }));

const mockReturning = jest.fn();
const mockValues = jest.fn(() => ({ returning: mockReturning }));
const mockInsert = jest.fn(() => ({ values: mockValues }));

jest.mock("@/db/drizzle", () => ({
    orm: {
        select: (...args: unknown[]) => mockSelect(...args),
        insert: (...args: unknown[]) => mockInsert(...args),
    },
}));

jest.mock("@/db/models/donor", () => ({
    donor: "donor_table_mock",
}));

const VALID_AGE = 25;
const VALID_FIELDS = {
    eventId: "event-123",
    firstName: "Juan",
    middleName: "Santos",
    lastName: "Dela Cruz",
    age: String(VALID_AGE),
    sex: "male",
    bloodType: "O+",
    email: "juan@example.com",
    mobileNumber: "09171234567",
    address: "123 Rizal St.",
    city: "1",
    zipCode: "1000",
};

function buildFormData(overrides: Partial<typeof VALID_FIELDS> = {}): FormData {
    const fields = { ...VALID_FIELDS, ...overrides };
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.set(key, value as string);
        }
    });
    return formData;
}

function mockNoExistingDonor() {
    mockLimit.mockResolvedValueOnce([]);
}

function mockExistingDonor(existing: { email?: string; mobile_no?: string }) {
    mockLimit.mockResolvedValueOnce([existing]);
}

function mockInsertSuccess(id = 1, qr_token = "qr-token-abc") {
    mockReturning.mockResolvedValueOnce([{ id, qr_token }]);
}

// tests

describe("registerDonorAction", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("required field validation", () => {
        it.each([
            "firstName",
            "lastName",
            "address",
            "city",
            "zipCode",
            "email",
            "mobileNumber",
            "sex",
            "bloodType",
        ])("returns an error when '%s' is missing", async (field) => {
            const formData = buildFormData({ [field]: "" } as Partial<typeof VALID_FIELDS>);

            const result = await registerDonorAction(null, formData);

            expect(result).toEqual({ error: "Missing required fields." });
        });

        it("does not query the database when required fields are missing", async () => {
            const formData = buildFormData({ email: "" });

            await registerDonorAction(null, formData);

            expect(mockSelect).not.toHaveBeenCalled();
        });

        it("allows middleName to be omitted", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData({ middleName: "" });

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT"
            );
            expect(mockRedirect).toHaveBeenCalled();
        });
    });

    describe("zip code validation", () => {
        it.each(["123", "12345", "abcd", ""])(
            "rejects an invalid zip code '%s'",
            async (zipCode) => {
                const formData = buildFormData({ zipCode });

                const result = await registerDonorAction(null, formData);

                if (zipCode === "") {
                    expect(result).toEqual({ error: "Missing required fields." });
                } else {
                    expect(result).toEqual({
                        error: "ZIP code must be exactly 4 digits.",
                    });
                }
            }
        );

        it("accepts a valid 4-digit zip code", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData({ zipCode: "4000" });

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT"
            );
        });
    });

    describe("mobile number validation", () => {
        it.each(["12345678901", "0917123456", "091712345678", "abcdefghijk"])(
            "rejects an invalid mobile number '%s'",
            async (mobileNumber) => {
                const formData = buildFormData({ mobileNumber });

                const result = await registerDonorAction(null, formData);

                expect(result).toEqual({
                    error: "Mobile number must be 11 digits and start with 09.",
                });
            }
        );

        it("accepts a valid mobile number starting with 09", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData({ mobileNumber: "09991234567" });

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT"
            );
        });
    });

    describe("duplicate donor checks", () => {
        it("returns an error when the email is already registered", async () => {
            mockExistingDonor({ email: VALID_FIELDS.email });
            const formData = buildFormData();

            const result = await registerDonorAction(null, formData);

            expect(result).toEqual({ error: "Email address is already registered." });
        });

        it("returns an error when the mobile number is already registered", async () => {
            mockExistingDonor({ mobile_no: VALID_FIELDS.mobileNumber });
            const formData = buildFormData();

            const result = await registerDonorAction(null, formData);

            expect(result).toEqual({
                error: "Mobile number is already registered.",
            });
        });

        it("does not attempt an insert when a duplicate is found", async () => {
            mockExistingDonor({ email: VALID_FIELDS.email });
            const formData = buildFormData();

            await registerDonorAction(null, formData);

            expect(mockInsert).not.toHaveBeenCalled();
        });

        it("queries using both email and mobile number", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData();

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT"
            );

            expect(mockSelect).toHaveBeenCalledTimes(1);
            expect(mockFrom).toHaveBeenCalledTimes(1);
            expect(mockWhere).toHaveBeenCalledTimes(1);
        });
    });

    describe("success cases", () => {
        it("inserts a donor with the correctly mapped fields", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData();

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT"
            );

            expect(mockInsert).toHaveBeenCalledWith("donor_table_mock");
            expect(mockValues).toHaveBeenCalledWith(
                expect.objectContaining({
                    first_name: VALID_FIELDS.firstName,
                    middle_name: VALID_FIELDS.middleName,
                    last_name: VALID_FIELDS.lastName,
                    email: VALID_FIELDS.email,
                    mobile_no: VALID_FIELDS.mobileNumber,
                    age: VALID_AGE,
                    street: VALID_FIELDS.address,
                    zip_code: VALID_FIELDS.zipCode,
                    sex: VALID_FIELDS.sex,
                    blood: VALID_FIELDS.bloodType,
                    city_id: BigInt(VALID_FIELDS.city),
                    photo_path: "placeholder.jpg",
                })
            );
        });

        it("stores null for middle_name when middleName is not provided", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData({ middleName: "" });

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT"
            );

            expect(mockValues).toHaveBeenCalledWith(
                expect.objectContaining({ middle_name: null })
            );
        });

        it("trims leading/trailing whitespace from the address", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData({ address: "  123 Rizal St.  " });

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT"
            );

            expect(mockValues).toHaveBeenCalledWith(
                expect.objectContaining({ street: "123 Rizal St." })
            );
        });

        it("redirects to the event's scanner page after a successful insert", async () => {
            mockNoExistingDonor();
            mockInsertSuccess();
            const formData = buildFormData({ eventId: "event-999" });

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "NEXT_REDIRECT:/oa/events/event-999/scanner"
            );

            expect(mockRedirect).toHaveBeenCalledWith(
                "/oa/events/event-999/scanner"
            );
        });
    });

    describe("database error cases", () => {
        it("propagates the error when the insert fails", async () => {
            mockNoExistingDonor();
            mockReturning.mockRejectedValueOnce(new Error("DB connection lost"));
            const formData = buildFormData();

            await expect(registerDonorAction(null, formData)).rejects.toThrow(
                "DB connection lost"
            );
        });

        it("does not redirect when the insert fails", async () => {
            mockNoExistingDonor();
            mockReturning.mockRejectedValueOnce(new Error("Unique constraint"));
            const formData = buildFormData();

            await expect(registerDonorAction(null, formData)).rejects.toThrow();

            expect(mockRedirect).not.toHaveBeenCalled();
        });
    });
});
