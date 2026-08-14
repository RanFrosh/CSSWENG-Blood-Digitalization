import Header from "@/components/headers/HeaderRBD";
import StaffProfile from "@/components/utils/StaffProfile";
import { getProfileAction } from "@/actions/profile_action";

export default async function DirectorProfilePage() {
    
    const result = await getProfileAction();

    if (!result.success || !result.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            Error Loading Events
                        </p>
                        <p className="mt-2 text-[18px] font-semibold text-[#002940]">
                            {result.message || "Access Denied"}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const dbProfile = result.data;

    const profileData = {
        id: dbProfile?.id.toString(), 
        name: `${dbProfile?.name || "Unknown User"}`,
        email: dbProfile?.email || "No email provided",
        role: dbProfile?.role || "Director",
        profile_image_url: dbProfile?.profile_image_url || "/images/user.png",
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">

            <Header />
            
            <StaffProfile initialProfile={profileData} />
        </main>
    );
}