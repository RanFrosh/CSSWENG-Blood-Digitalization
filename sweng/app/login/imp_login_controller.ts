import { LoginControl, LoginProvider } from "@/abstract/auth/login_abstract";
import { ProfileSessionProvider } from "@/abstract/auth/query_abstract";
import { ApiResponse } from "@/types/api_res_type";
import { ReadProfile } from "@/types/profile_type";

export class ImpLoginController implements LoginControl {
    private provider: LoginProvider;
    private profileReader: ProfileSessionProvider;

    constructor(injectProvider: LoginProvider, injectProfileReader: ProfileSessionProvider) {
        this.provider = injectProvider;
        this.profileReader = injectProfileReader;
    }

    public async invokeLogin(email: string, password: string): Promise<ApiResponse<ReadProfile>> {
        const res = await this.provider.provideLogin(email, password);
        if (res.success) {
            const user = await this.profileReader.getCurrentUser();
            return user;
        }
        return {success: false, message: res.message, data: undefined};
    }
}