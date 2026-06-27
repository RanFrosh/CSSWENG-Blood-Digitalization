import { ImpLogoutController } from "@/app/logout/imp_logout_controller";
import { LogoutProvider } from "@/abstract/auth/logout_abstract";
import { ApiResponse } from "@/types/api_res_type";

describe("ImpLogoutController Unit Tests", () => {
    let mockLogoutProvider: jest.Mocked<LogoutProvider>;
    let logoutController: ImpLogoutController;

    beforeEach(() => {
        // Create the mock provider
        mockLogoutProvider = {
            provideLogout: jest.fn(),
        };

        // Inject the mock into the controller
        logoutController = new ImpLogoutController(mockLogoutProvider);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return success: true when the provider successfully logs out", async () => {
        // Setup the mock response
        const mockSuccessResponse: ApiResponse = {
            success: true,
            message: "Successfully logged out"
        };
        mockLogoutProvider.provideLogout.mockResolvedValue(mockSuccessResponse);

        // Execute the logout
        const result = await logoutController.invokeLogout();

        // Assertions
        expect(mockLogoutProvider.provideLogout).toHaveBeenCalledTimes(1);
        
        expect(result).toEqual(mockSuccessResponse);
        expect(result.success).toBe(true);
    });

    it("should return success: false and pass the error message when the provider fails", async () => {
        // Setup the mock failure response
        const mockFailureResponse: ApiResponse = {
            success: false,
            message: "Network error during logout"
        };
        mockLogoutProvider.provideLogout.mockResolvedValue(mockFailureResponse);

        // Execute the logout
        const result = await logoutController.invokeLogout();

        // Assertions
        expect(mockLogoutProvider.provideLogout).toHaveBeenCalledTimes(1);
        
        // Verify the controller didn't drop or change the error message
        expect(result).toEqual(mockFailureResponse);
        expect(result.success).toBe(false);
        expect(result.message).toBe("Network error during logout");
    });
});