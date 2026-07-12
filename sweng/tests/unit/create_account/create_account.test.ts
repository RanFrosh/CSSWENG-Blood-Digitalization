import { create_account, AppRole } from "@/app/back/create_account/create_account";

// Mock serverSupa
const mockSignUp = jest.fn();
jest.mock("@/db/supaserver", () => ({
    serverSupa: jest.fn(() =>
        Promise.resolve({
            auth: {
                signUp: mockSignUp,
            },
        })
    ),
}));

// Mock drizzle orm
const mockInsert = jest.fn();
const mockValues = jest.fn();
jest.mock("@/db/drizzle", () => ({
    orm: {
        insert: jest.fn(() => ({
            values: mockValues,
        })),
    },
}));

// Mock the profiles table
jest.mock("@/db/models/profiles", () => ({
    profiles: "profiles_table_mock",
}));

// --- Helpers ---

const VALID_NAME = "Jane Doe";
const VALID_EMAIL = "jane@example.com";
const VALID_ROLE: AppRole = "med_prof";
const VALID_PASSWORD = "S3cur3P@ss!";
const MOCK_USER_ID = "user-uuid-1234";

function mockSignUpSuccess(userId = MOCK_USER_ID) {
    mockSignUp.mockResolvedValueOnce({
        data: { user: { id: userId } },
        error: null,
    });
}

function mockSignUpAuthError(message = "Email already in use") {
    mockSignUp.mockResolvedValueOnce({
        data: { user: null },
        error: { message },
    });
}

function mockSignUpNoUser() {
    mockSignUp.mockResolvedValueOnce({
        data: { user: null },
        error: null,
    });
}

// --- Tests ---

describe("create_account", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default: db insert succeeds
        mockValues.mockResolvedValue(undefined);
    });

    // ------------------------------------------------------------------ //
    //  Happy path
    // ------------------------------------------------------------------ //

    describe("success cases", () => {
        it("returns success when auth signup and profile insertion both succeed", async () => {
            mockSignUpSuccess();

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                VALID_ROLE,
                VALID_PASSWORD
            );

            expect(result).toEqual({
                success: true,
                message: "Account created successfully",
            });
        });

        it("calls supabase.auth.signUp with the correct email and password", async () => {
            mockSignUpSuccess();

            await create_account(VALID_NAME, VALID_EMAIL, VALID_ROLE, VALID_PASSWORD);

            expect(mockSignUp).toHaveBeenCalledTimes(1);
            expect(mockSignUp).toHaveBeenCalledWith({
                email: VALID_EMAIL,
                password: VALID_PASSWORD,
            });
        });

        it("inserts a profile with the correct id, name, and role", async () => {
            mockSignUpSuccess(MOCK_USER_ID);

            await create_account(VALID_NAME, VALID_EMAIL, VALID_ROLE, VALID_PASSWORD);

            expect(mockValues).toHaveBeenCalledTimes(1);
            expect(mockValues).toHaveBeenCalledWith({
                id: MOCK_USER_ID,
                name: VALID_NAME,
                role: VALID_ROLE,
            });
        });

        it.each<AppRole>([
            "onsite_admin",
            "med_prof",
            "director",
            "super_admin",
        ])("accepts role '%s' and succeeds", async (role) => {
            mockSignUpSuccess();

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                role,
                VALID_PASSWORD
            );

            expect(result.success).toBe(true);
            expect(mockValues).toHaveBeenCalledWith(
                expect.objectContaining({ role })
            );
        });
    });

    // ------------------------------------------------------------------ //
    //  Auth / Supabase failures
    // ------------------------------------------------------------------ //

    describe("auth error cases", () => {
        it("returns failure with the error message when supabase signUp returns an error", async () => {
            const errorMessage = "Email already in use";
            mockSignUpAuthError(errorMessage);

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                VALID_ROLE,
                VALID_PASSWORD
            );

            expect(result).toEqual({
                success: false,
                message: errorMessage,
            });
        });

        it("does NOT insert a profile when auth fails", async () => {
            mockSignUpAuthError("Invalid email");

            await create_account(VALID_NAME, VALID_EMAIL, VALID_ROLE, VALID_PASSWORD);

            expect(mockValues).not.toHaveBeenCalled();
        });

        it("returns failure when supabase returns no user and no error", async () => {
            mockSignUpNoUser();

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                VALID_ROLE,
                VALID_PASSWORD
            );

            expect(result).toEqual({
                success: false,
                message: "User creation failed",
            });
        });

        it("does NOT insert a profile when data.user is null", async () => {
            mockSignUpNoUser();

            await create_account(VALID_NAME, VALID_EMAIL, VALID_ROLE, VALID_PASSWORD);

            expect(mockValues).not.toHaveBeenCalled();
        });

        it("passes different auth error messages through unchanged", async () => {
            const customMessage = "Password is too weak";
            mockSignUpAuthError(customMessage);

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                VALID_ROLE,
                VALID_PASSWORD
            );

            expect(result.message).toBe(customMessage);
        });
    });

    // ------------------------------------------------------------------ //
    //  Database failures
    // ------------------------------------------------------------------ //

    describe("database error cases", () => {
        it("returns failure when profile insertion throws", async () => {
            mockSignUpSuccess();
            mockValues.mockRejectedValueOnce(new Error("DB connection lost"));

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                VALID_ROLE,
                VALID_PASSWORD
            );

            expect(result).toEqual({
                success: false,
                message: "Auth succeeded, but profile creation failed.",
            });
        });

        it("returns failure when profile insertion rejects with a non-Error object", async () => {
            mockSignUpSuccess();
            mockValues.mockRejectedValueOnce({ code: "23505", detail: "Duplicate key" });

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                VALID_ROLE,
                VALID_PASSWORD
            );

            expect(result).toEqual({
                success: false,
                message: "Auth succeeded, but profile creation failed.",
            });
        });

        it("still returns a profile-failure message even when auth passes with a different userId", async () => {
            const altUserId = "alt-user-uuid-9999";
            mockSignUpSuccess(altUserId);
            mockValues.mockRejectedValueOnce(new Error("Unique constraint"));

            const result = await create_account(
                VALID_NAME,
                VALID_EMAIL,
                VALID_ROLE,
                VALID_PASSWORD
            );

            expect(result.success).toBe(false);
            expect(result.message).toBe("Auth succeeded, but profile creation failed.");
        });
    });

    // ------------------------------------------------------------------ //
    //  Call-order / integration guarantees
    // ------------------------------------------------------------------ //

    describe("execution order", () => {
        it("calls signUp before inserting the profile", async () => {
            const callOrder: string[] = [];

            mockSignUp.mockImplementationOnce(async () => {
                callOrder.push("signUp");
                return { data: { user: { id: MOCK_USER_ID } }, error: null };
            });

            mockValues.mockImplementationOnce(async () => {
                callOrder.push("insertValues");
            });

            await create_account(VALID_NAME, VALID_EMAIL, VALID_ROLE, VALID_PASSWORD);

            expect(callOrder).toEqual(["signUp", "insertValues"]);
        });

        it("calls signUp exactly once per invocation", async () => {
            mockSignUpSuccess();

            await create_account(VALID_NAME, VALID_EMAIL, VALID_ROLE, VALID_PASSWORD);

            expect(mockSignUp).toHaveBeenCalledTimes(1);
        });
    });
});