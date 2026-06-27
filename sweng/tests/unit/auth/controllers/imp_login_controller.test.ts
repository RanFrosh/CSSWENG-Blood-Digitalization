import { ImpLoginController } from "@/app/login/imp_login_controller";
import { LoginProvider } from "@/abstract/auth/login_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { ReadProfile } from "@/types/profile_type";

describe("ImpLoginController Unit Tests", () => {
    let mockLoginProvider: jest.Mocked<LoginProvider>;
    let mockProfileProvider: jest.Mocked<ProfileSessionProvider>; // Updated to ProfileSessionProvider
    let loginController: ImpLoginController;

    beforeEach(() => {
        // Create mock implementations for the dependencies
        mockLoginProvider = {
            provideLogin: jest.fn(),
        };

        mockProfileProvider = {
            getCurrentUser: jest.fn(),
        };

        // Inject the mocks into the controller
        loginController = new ImpLoginController(mockLoginProvider, mockProfileProvider);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        ["onsite_admin", "qa_onsite@redbank.com", "TestPass123!"],
        ["med_prof", "qa_medprof@redbank.com", "TestPass123!"],
        ["director", "qa_director@redbank.com", "TestPass123!"],
        ["super_admin", "qa_superadmin@redbank.com", "TestPass123!"],
        ["staff_admin", "qa_staff@redbank.com", "TestPass123!"],
        ["donor", "qa_donor@redbank.com", "TestPass123!"] 
    ])("should successfully log in and return profile data for role: %s", async (role, email, password) => {
        
        // Set up the dummy profile based on the current role in the array
        const dummyProfile: ReadProfile = {
            id: `dummy-uuid-${role}`,
            name: "Test User",
            // Cast the string from the array to the strict union type
            role: role as ReadProfile["role"], 
            created_at: new Date()
        };

        // Mock the successful responses
        mockLoginProvider.provideLogin.mockResolvedValue({ success: true, message: "Success in logging in" });
        mockProfileProvider.getCurrentUser.mockResolvedValue({ 
            success: true, 
            message: "Profile retrieved", 
            data: dummyProfile 
        });

        // Execute the login
        const result = await loginController.invokeLogin(email, password);

        // Assertions
        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith(email, password);
        expect(mockProfileProvider.getCurrentUser).toHaveBeenCalled();

        expect(result.success).toBe(true);

        expect(result.data).toEqual(
            expect.objectContaining({
                role: role, 
                id: `dummy-uuid-${role}`
            })
        );
    });

    it("should fail gracefully when the email is empty", async () => {
        // Mock Supabase rejecting the empty email
        mockLoginProvider.provideLogin.mockResolvedValue({ success: false, message: "Email is required" });

        // Execute with empty email
        const result = await loginController.invokeLogin("", "TestPass123!");

        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith("", "TestPass123!");
        expect(mockProfileProvider.getCurrentUser).not.toHaveBeenCalled(); 
        expect(result.success).toBe(false);
        expect(result.message).toBe("Email is required");
    });

    it("should fail gracefully when the password is empty", async () => {
        // Mock Supabase rejecting the empty password
        mockLoginProvider.provideLogin.mockResolvedValue({ success: false, message: "Password is required" });

        // Execute with empty password
        const result = await loginController.invokeLogin("fake@example.com", "");

        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith("fake@example.com", "");
        expect(mockProfileProvider.getCurrentUser).not.toHaveBeenCalled(); 
        expect(result.success).toBe(false);
        expect(result.message).toBe("Password is required");
    });

    it("should fail and NOT fetch profile when an invalid password is provided", async () => {
        
        mockLoginProvider.provideLogin.mockResolvedValue({ 
            success: false, 
            message: "Invalid login credentials" 
        });

        const result = await loginController.invokeLogin("fake@example.com", "WrongPassword!");

        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith("fake@example.com", "WrongPassword!");
        expect(mockProfileProvider.getCurrentUser).not.toHaveBeenCalled(); 
        expect(result.success).toBe(false);
        expect(result.message).toBe("Invalid login credentials");
        expect(result.data).toBeUndefined();
    });
});