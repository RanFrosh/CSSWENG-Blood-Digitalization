import { ImpLoginController } from "@/app/login/imp_login_controller";
import { LoginProvider } from "@/abstract/auth/login_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { ReadProfile } from "@/types/profile_type";


describe("ImpLoginController Unit Tests", () => {
    // types as jest.Mocked<T> so TypeScript knows every method on these interfaces
    let mockLoginProvider: jest.Mocked<LoginProvider>;
    let mockProfileProvider: jest.Mocked<ProfileSessionProvider>; // Updated to ProfileSessionProvider
    let loginController: ImpLoginController;

    beforeEach(() => {
        // manually construct mock objects instead of using jest.mock()
        mockLoginProvider = {
            provideLogin: jest.fn(),
        };

        mockProfileProvider = {
            getCurrentUser: jest.fn(),
        };

        // mocks are passed in as dependencies
        loginController = new ImpLoginController(mockLoginProvider, mockProfileProvider);
    });

    afterEach(() => {
        // reset call counts, return values, and instances on all mocks after each test
        jest.clearAllMocks();
    });


    // Test Case 1: Role-based successful login
    it.each([
        ["onsite_admin", "qa_onsite@redbank.com", "TestPass123!"],
        ["med_prof", "qa_medprof@redbank.com", "TestPass123!"],
        ["director", "qa_director@redbank.com", "TestPass123!"],
        ["super_admin", "qa_superadmin@redbank.com", "TestPass123!"],
        ["staff_admin", "qa_staff@redbank.com", "TestPass123!"],
        ["donor", "qa_donor@redbank.com", "TestPass123!"] 
    ])("should successfully log in and return profile data for role: %s", async (role, email, password) => {
        
        // Set up the dummy profile based on the current role
        // The id is role-scoped (dummy-uuid-${role}) so the later assertion can
        // verify the correct profile was returned for each specific role iteration.
        const dummyProfile: ReadProfile = {
            id: `dummy-uuid-${role}`,
            name: "Test User",
            // casting tells TypeScript to trust the test data
            role: role as ReadProfile["role"], 
            created_at: new Date()
        };

        // Arrange: Configure mocks to simulate a fully successful auth flow
        mockLoginProvider.provideLogin.mockResolvedValue({ success: true, message: "Success in logging in" });
        mockProfileProvider.getCurrentUser.mockResolvedValue({ 
            success: true, 
            message: "Profile retrieved", 
            data: dummyProfile 
        });

        // Act: Execute the login
        const result = await loginController.invokeLogin(email, password);

        // Assert
        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith(email, password);
        expect(mockProfileProvider.getCurrentUser).toHaveBeenCalled();

        expect(result.success).toBe(true);

        // expect.objectContaining performs a partial match (only role and id are checked) 
        expect(result.data).toEqual(
            expect.objectContaining({
                role: role, 
                id: `dummy-uuid-${role}`
            })
        );
    });

    // Test Case 2: Empty email
    it("should fail gracefully when the email is empty", async () => {
        // Arrange: Mock Supabase rejecting the empty email
        mockLoginProvider.provideLogin.mockResolvedValue({ success: false, message: "Email is required" });

        // Act: Execute with empty email
        const result = await loginController.invokeLogin("", "TestPass123!");

        // Assert
        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith("", "TestPass123!");
        expect(mockProfileProvider.getCurrentUser).not.toHaveBeenCalled(); 
        expect(result.success).toBe(false);
        expect(result.message).toBe("Email is required");
    });


    // Test Case 3: Empty password
    it("should fail gracefully when the password is empty", async () => {
        // Arrange: Mock Supabase rejecting the empty password
        mockLoginProvider.provideLogin.mockResolvedValue({ success: false, message: "Password is required" });

        // Act: Execute with empty password
        const result = await loginController.invokeLogin("fake@example.com", "");

        // Assert
        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith("fake@example.com", "");
        expect(mockProfileProvider.getCurrentUser).not.toHaveBeenCalled(); 
        expect(result.success).toBe(false);
        expect(result.message).toBe("Password is required");
    });

    // Test Case 4: Wrong password (invalid credentials)
    it("should fail and NOT fetch profile when an invalid password is provided", async () => {
        // Arrange: provider returns the standard Supabase invalid credentials message
        mockLoginProvider.provideLogin.mockResolvedValue({ 
            success: false, 
            message: "Invalid login credentials" 
        });

        // Act: Execute with invalid credentials
        const result = await loginController.invokeLogin("fake@example.com", "WrongPassword!");

        // Assert
        expect(mockLoginProvider.provideLogin).toHaveBeenCalledWith("fake@example.com", "WrongPassword!");
        expect(mockProfileProvider.getCurrentUser).not.toHaveBeenCalled(); 
        expect(result.success).toBe(false);
        expect(result.message).toBe("Invalid login credentials");
        // assert data is undefined to confirm if the controller doesn't
        // accidentally return a profile data on a failed login
        expect(result.data).toBeUndefined();
    });
});