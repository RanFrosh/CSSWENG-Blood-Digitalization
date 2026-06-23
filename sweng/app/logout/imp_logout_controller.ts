import { LogoutControl, LogoutProvider } from "@/auth/abstract/logout_abstract";
import { ApiResponse } from "@/types/api_res_type";

export class ImpLogoutController implements LogoutControl {
    private provider: LogoutProvider;

    constructor(injectProvider: LogoutProvider) {
        this.provider = injectProvider;
    }

    public async invokeLogout(): Promise<ApiResponse> {
        const res = await this.provider.provideLogout();
        return res;
    }
}