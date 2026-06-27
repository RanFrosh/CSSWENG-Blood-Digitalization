import { ImpLogoutProvider } from "@/app/logout/imp_logout_provider";
import { SupabaseClient } from "@supabase/supabase-js";

describe("ImpLogoutProvider Unit Tests", () => {
    let mockSupabaseClient: jest.Mocked<SupabaseClient>;
    let logoutProvider: ImpLogoutProvider;

    beforeEach(() => {
        // Create a deep mock for the Supabase Client
        mockSupabaseClient = {
            auth: {
                signOut: jest.fn(),
            }
        } as unknown as jest.Mocked<SupabaseClient>;

        // Inject the mocked client into the provider
        logoutProvider = new ImpLogoutProvider(mockSupabaseClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success: true when Supabase sign-out is successful", async () => {
        // Mock Supabase returning no error (Happy Path)
        (mockSupabaseClient.auth.signOut as jest.Mock).mockResolvedValue({
            error: null,
        });

        const result = await logoutProvider.provideLogout();

        // Verify Supabase was called exactly once with no parameters
        expect(mockSupabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
        expect(mockSupabaseClient.auth.signOut).toHaveBeenCalledWith();
        
        // Verify the provider mapped the successful response correctly
        expect(result.success).toBe(true);
        expect(result.message).toBe("Logged out successfully");
    });

    it("should return success: false and gracefully catch the error when Supabase sign-out fails", async () => {
        // Mock Supabase returning a network/auth error (Error Path)
        const fakeErrorMessage = "Supabase connection lost during logout";
        
        (mockSupabaseClient.auth.signOut as jest.Mock).mockResolvedValue({
            error: { message: fakeErrorMessage },
        });

        const result = await logoutProvider.provideLogout();

        // Verify Supabase was still called
        expect(mockSupabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
        
        // Verify the provider caught the error and unpacked the message
        expect(result.success).toBe(false);
        expect(result.message).toBe(fakeErrorMessage);
    });
});