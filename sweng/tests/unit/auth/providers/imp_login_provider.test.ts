import { ImpLoginProvider } from "@/app/login/imp_login_provider";
import { SupabaseClient } from "@supabase/supabase-js";

describe("ImpLoginProvider Unit Tests", () => {
    let mockSupabaseClient: jest.Mocked<SupabaseClient>;
    let loginProvider: ImpLoginProvider;

    beforeEach(() => {
        // Create a deep mock for the Supabase Client
        mockSupabaseClient = {
            auth: {
                signInWithPassword: jest.fn(),
            }
        } as unknown as jest.Mocked<SupabaseClient>;

        // Inject the mocked client into the provider
        loginProvider = new ImpLoginProvider(mockSupabaseClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success: true when Supabase sign-in is successful", async () => {
        // Mock Supabase returning no error
        (mockSupabaseClient.auth.signInWithPassword as jest.Mock).mockResolvedValue({
            data: { user: { id: "123" }, session: {} },
            error: null,
        });

        const result = await loginProvider.provideLogin("qa_donor@redbank.com", "TestPass123!");

        // Verify the exact payload sent to Supabase
        expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
            email: "qa_donor@redbank.com",
            password: "TestPass123!"
        });
        
        // Verify the provider mapped the response correctly
        expect(result.success).toBe(true);
        expect(result.message).toBe("Success in logging in");
    });

    it("should return success: false and gracefully catch the error when Supabase sign-in fails", async () => {
        // Mock Supabase returning an authentication error
        const fakeErrorMessage = "Invalid login credentials";
        
        (mockSupabaseClient.auth.signInWithPassword as jest.Mock).mockResolvedValue({
            data: { user: null, session: null },
            error: { message: fakeErrorMessage },
        });

        const result = await loginProvider.provideLogin("fake@email.com", "WrongPassword!");

        // Verify the exact payload sent to Supabase
        expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
            email: "fake@email.com",
            password: "WrongPassword!"
        });
        
        // Verify the provider caught the error and passed the exact message down the chain
        expect(result.success).toBe(false);
        expect(result.message).toBe(fakeErrorMessage);
    });
});