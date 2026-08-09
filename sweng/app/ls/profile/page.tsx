import HeaderLS from "@/components/HeaderLS";
import StaffProfile from "@/components/StaffProfile";

// 🏀 Eventually, this will be your real database fetch
const fetchProfileData = async () => {
    return {
        id: "LS-001",
        name: "John Doe",
        email: "john.doe@redbank.com",
        role: "Lab Staff",
        profileImage: "/images/user.png",
    };
};

export default async function LabStaffProfilePage() {
    const profileData = await fetchProfileData();

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            {/* The Specific Header for this specific role */}
            <HeaderLS />
            
            {/* The Universal Profile Component */}
            <StaffProfile initialProfile={profileData} />
        </main>
    );
}