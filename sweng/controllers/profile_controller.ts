export interface ProfilesData {
    updateProfile(userId: string, data: { name: string; email: string; profile_image_url: string | null }): Promise<{ success: boolean; message: string }>;
}

export interface ProfileSessionProvider {
    getCurrentUser(): Promise<{ success: boolean; message: string; data?: any }>;
}

export class ImpProfilesManager {
    
    private profilesModel: ProfilesData;
    private profileReader: ProfileSessionProvider;

    constructor(injectProfilesModel: ProfilesData, injectProfileReader: ProfileSessionProvider) {
        this.profilesModel = injectProfilesModel;
        this.profileReader = injectProfileReader;
    }

    async invokeUpdateProfile(data: { name: string; email: string; profile_image_url: string | null }) {

        const authRes = await this.profileReader.getCurrentUser();
        
        if (!authRes.success || !authRes.data) {
            return { success: false, message: "Unauthorized request. Please log in." };
        }

        const userId = authRes.data.id;

        if (!data.name || !data.email) {
            return { success: false, message: "Name and Email are required fields." };
        }

        try {
            return await this.profilesModel.updateProfile(userId, data);
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}