import { ImpLoginController } from "@/app/login/imp_login_controller"; 
import { LoginProvider } from "@/abstract/auth/login_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";

describe("ImpLoginController", () => {
    let mockProvider: jest.Mocked<LoginProvider>;
    let mockProfileReader: jest.Mocked<ProfileSessionProvider>;
    let loginController: ImpLoginController;

    beforeEach(() => {
        mockProvider = {
            provideLogin: jest.fn(),
        };
        mockProfileReader = {
            getCurrentUser: jest.fn(),
        };
        loginController = new ImpLoginController(mockProvider, mockProfileReader);
    });

    it("returns the fetched profile when login succeeds", async () => {
        mockProvider.provideLogin.mockResolvedValue({ success: true, message: "OK" });
        const mockProfile = { success: true, message: "OK", data: { role: "onsite_admin" } };
        mockProfileReader.getCurrentUser.mockResolvedValue(mockProfile as any);

        // execute the login
        const result = await loginController.invokeLogin("user@example.com", "correctPassword");

        expect(mockProvider.provideLogin).toHaveBeenCalledWith("user@example.com", "correctPassword");
        expect(mockProfileReader.getCurrentUser).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProfile);
    });

    it("returns failure and skips profile fetch when login fails", async () => {
        mockProvider.provideLogin.mockResolvedValue({ success: false, message: "Invalid credentials" });

        // execute the login
        const result = await loginController.invokeLogin("user@example.com", "wrongPassword");

        expect(mockProfileReader.getCurrentUser).not.toHaveBeenCalled();
        expect(result).toEqual({ success: false, message: "Invalid credentials", data: undefined });
    });

    it("returns failure when login succeeds but profile fetch fails", async () => {
        mockProvider.provideLogin.mockResolvedValue({ success: true, message: "OK" });
        mockProfileReader.getCurrentUser.mockResolvedValue({ success: false, message: "Session expired" } as any);

        // execute the login
        const result = await loginController.invokeLogin("user@example.com", "correctPassword");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Session expired");
    });

    it("passes the exact email and password through to the provider", async () => {
        mockProvider.provideLogin.mockResolvedValue({ success: false, message: "Invalid credentials" });

        // execute the login
        await loginController.invokeLogin("test@domain.com", "hunter2");

        expect(mockProvider.provideLogin).toHaveBeenCalledWith("test@domain.com", "hunter2");
    });
});