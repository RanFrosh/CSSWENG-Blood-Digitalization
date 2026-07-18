import { claimPerkAction } from "@/app/actions/claim-perk";

const mockLimit = jest.fn();
const mockWhereSelect = jest.fn(() => ({ limit: mockLimit }));
const mockFrom = jest.fn(() => ({ where: mockWhereSelect }));
const mockSelect = jest.fn(() => ({ from: mockFrom }));

const mockWhereUpdate = jest.fn();
const mockSet = jest.fn(() => ({ where: mockWhereUpdate }));
const mockUpdate = jest.fn(() => ({ set: mockSet }));

jest.mock("@/db/drizzle", () => ({
    orm: {
        select: (...args: unknown[]) => mockSelect(...args),
        update: (...args: unknown[]) => mockUpdate(...args),
    },
}));

jest.mock("@/db/models/donor", () => ({
    donor: {
        id: "id",
        first_name: "first_name",
        last_name: "last_name",
        qr_token: "qr_token",
    },
}));

jest.mock("@/db/models/event_log", () => ({
    event_log: {
        id: "id",
        perk_claims: "perk_claims",
    },
}));


const VALID_EVENT_ID = "42";
const VALID_QR_TOKEN = "qr-token-1234";
const MOCK_DONOR = {
    id: BigInt(7),
    first_name: "Jane",
    last_name: "Doe",
};

function mockDonorFound(donorRow = MOCK_DONOR) {
    mockLimit.mockResolvedValueOnce([donorRow]);
}

function mockDonorNotFound() {
    mockLimit.mockResolvedValueOnce([]);
}

function mockUpdateSuccess() {
    mockWhereUpdate.mockResolvedValueOnce(undefined);
}

//tests

describe("claimPerkAction", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockWhereUpdate.mockResolvedValue(undefined);
    });

    describe("validation errors", () => {
        it("returns failure when eventId is missing", async () => {
            const result = await claimPerkAction("", VALID_QR_TOKEN);

            expect(result).toEqual({
                success: false,
                message: "Missing eventId or qrToken.",
            });
        });

        it("returns failure when qrToken is missing", async () => {
            const result = await claimPerkAction(VALID_EVENT_ID, "");

            expect(result).toEqual({
                success: false,
                message: "Missing eventId or qrToken.",
            });
        });

        it("returns failure when both eventId and qrToken are missing", async () => {
            const result = await claimPerkAction("", "");

            expect(result).toEqual({
                success: false,
                message: "Missing eventId or qrToken.",
            });
        });

        it("does NOT query the donor table when input is missing", async () => {
            await claimPerkAction("", "");

            expect(mockSelect).not.toHaveBeenCalled();
        });
    });

    describe("success cases", () => {
        it("returns success with the donor when the QR code is valid", async () => {
            mockDonorFound();
            mockUpdateSuccess();

            const result = await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(result).toEqual({
                success: true,
                donor: MOCK_DONOR,
            });
        });

        it("queries the donor table filtering by qr_token", async () => {
            mockDonorFound();
            mockUpdateSuccess();

            await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(mockSelect).toHaveBeenCalledTimes(1);
            expect(mockFrom).toHaveBeenCalledTimes(1);
            expect(mockWhereSelect).toHaveBeenCalledTimes(1);
            expect(mockLimit).toHaveBeenCalledWith(1);
        });

        it("increments perk_claims on the correct event_log row", async () => {
            mockDonorFound();
            mockUpdateSuccess();

            await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockSet).toHaveBeenCalledTimes(1);
            expect(mockWhereUpdate).toHaveBeenCalledTimes(1);
        });

        it("converts eventId string to BigInt when updating event_log", async () => {
            mockDonorFound();
            mockUpdateSuccess();

            await claimPerkAction("99", VALID_QR_TOKEN);

            expect(mockWhereUpdate).toHaveBeenCalledTimes(1);
        });
    });

    describe("invalid QR code cases", () => {
        it("returns failure when no donor matches the QR token", async () => {
            mockDonorNotFound();

            const result = await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(result).toEqual({
                success: false,
                message: "Invalid QR code.",
            });
        });

        it("does NOT attempt to update event_log when the QR code is invalid", async () => {
            mockDonorNotFound();

            await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(mockUpdate).not.toHaveBeenCalled();
        });
    });

    describe("database error cases", () => {
        it("returns a generic failure message when the donor lookup throws", async () => {
            mockLimit.mockRejectedValueOnce(new Error("DB connection lost"));

            const result = await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(result).toEqual({
                success: false,
                message: "Internal server error.",
            });
        });

        it("returns a generic failure message when the perk_claims update throws", async () => {
            mockDonorFound();
            mockWhereUpdate.mockRejectedValueOnce(new Error("Constraint violation"));

            const result = await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(result).toEqual({
                success: false,
                message: "Internal server error.",
            });
        });

        it("returns a generic failure message when the lookup rejects with a non-Error object", async () => {
            mockLimit.mockRejectedValueOnce({ code: "500", detail: "Unknown" });

            const result = await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(result).toEqual({
                success: false,
                message: "Internal server error.",
            });
        });
    });

    describe("execution order", () => {
        it("looks up the donor before updating event_log", async () => {
            const callOrder: string[] = [];

            mockLimit.mockImplementationOnce(async () => {
                callOrder.push("select");
                return [MOCK_DONOR];
            });

            mockWhereUpdate.mockImplementationOnce(async () => {
                callOrder.push("update");
            });

            await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(callOrder).toEqual(["select", "update"]);
        });

        it("performs exactly one donor lookup per invocation", async () => {
            mockDonorFound();
            mockUpdateSuccess();

            await claimPerkAction(VALID_EVENT_ID, VALID_QR_TOKEN);

            expect(mockSelect).toHaveBeenCalledTimes(1);
        });
    });
});
