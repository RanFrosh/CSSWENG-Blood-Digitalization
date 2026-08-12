"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderSA";
import { fetchSACurrentUser, editSACurrentUser } from "@/actions/sa_action";
import { ReadProfile } from "@/types/profile_type";

const roleNames: Record<string, string> = {
    super_admin: "Super Admin",
};

export default function StaffProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<ReadProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [isEditOpen, setEditModal] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [profileImageInput, setProfileImageInput] = useState("");
    const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setErrorMessage("");
            const result = await fetchSACurrentUser();
            if (result.success && result.data) {
                setProfile(result.data);
            } else {
                setErrorMessage(result.message);
            }
            setIsLoading(false);
        };
        loadProfile();
    }, []);

    const openEditModal = () => {
        if (!profile) return;
        setNameInput(profile.name);
        setEmailInput(profile.email);
        setProfileImageInput(profile.profile_image_url ?? "");
        setFeedback(null);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setEditModal(false);
        setFeedback(null);
    };

    const saveAccount = async () => {
        if (!profile) return;
        const name = nameInput.trim();
        const email = emailInput.trim();
        const profile_image_url = profileImageInput.trim();

        if (!name && !email && !profile_image_url) {
            setFeedback({ success: false, message: "Please input at least one of the fields" });
            return;
        }

        setIsSaving(true);
        setFeedback(null);

        const result = await editSACurrentUser({
            name: name || undefined,
            email: email || undefined,
            profile_image_url,
        });

        if (result.success) {
            setProfile({
                ...profile,
                name: name || profile.name,
                email: email || profile.email,
                profile_image_url: profile_image_url || null,
            });
            setFeedback({ success: true, message: "Account details updated successfully!" });
        } else {
            setFeedback({ success: false, message: result.message });
        }

        setIsSaving(false);
    };

    const goBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading profile...</p>
                </div>
            </main>
        );
    }

    if (errorMessage || !profile) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">{errorMessage || "Profile not found"}</p>
                </div>
            </main>
        );
    }

    const staffId = `${profile.role.toUpperCase()}-${profile.id.substring(0, 4).toUpperCase()}`;
    const displayRole = roleNames[profile.role] || profile.role;

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Page Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        My Profile
                    </h1>
                </section>

                {/* Profile Display */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div className="mt-[0.35in] grid grid-cols-1 lg:grid-cols-[2.8in_1fr] gap-[0.35in]">
                        {/* Profile Image */}
                        <aside className="flex flex-col gap-[0.15in]">
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] flex flex-col items-center">
                                <img
                                    src={profile.profile_image_url ?? "/images/user.png"}
                                    alt="Staff profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/user.png"; }}
                                />
                            </div>
                        </aside>

                        {/* Staff Details */}
                        <div className="flex flex-col gap-[0.35in]">
                            <div>
                                <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                    Basic Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">
                                            ID
                                        </label>

                                        <input
                                            type="text"
                                            value={staffId}
                                            readOnly
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none bg-[#f9fdff] text-[#5c6b73]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            value={profile.name}
                                            readOnly
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none bg-[#f9fdff] text-[#5c6b73]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={profile.email}
                                            readOnly
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none bg-[#f9fdff] text-[#5c6b73]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">
                                            Role
                                        </label>

                                        <input
                                            type="text"
                                            value={displayRole}
                                            readOnly
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none bg-[#f9fdff] text-[#5c6b73]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row justify-end gap-[10px] pt-[0.15in]">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="min-w-[1.4in] bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#002940] hover:text-white"
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    onClick={openEditModal}
                                    className="min-w-[1.8in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:underline"
                                >
                                    Edit Account Details
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Edit Popup */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Edit Account
                        </h2>

                        <div className="mt-[0.25in] flex flex-col gap-5">
                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    Profile Picture URL
                                </label>

                                <div className="flex flex-col items-center gap-3 bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.25in]">
                                    {profileImageInput ? (
                                        <img
                                            src={profileImageInput}
                                            className="w-[2in] h-[2in] object-cover rounded-full shadow-sm border-2 border-[#002940]"
                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/user.png"; }}
                                        />
                                    ) : (
                                        <div className="w-[2in] h-[2in] rounded-full bg-gray-100 border-2 border-[#c0cad0] flex items-center justify-center text-gray-400 text-sm">
                                            No Image
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="https://example.com/photo.jpg"
                                        value={profileImageInput}
                                        onChange={(e) => setProfileImageInput(e.target.value)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            {feedback && (
                                <p
                                    className={`text-[16px] font-semibold ${
                                        feedback.success ? "text-green-600" : "text-red-500"
                                    }`}
                                >
                                    {feedback.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={saveAccount}
                                disabled={isSaving}
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-[#002940] text-white cursor-pointer hover:underline disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
