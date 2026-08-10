"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/actions/profile_action";

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    role: string;
    profile_image_url: string;
};

interface SharedProfileProps {
    initialProfile: UserProfile;
}

export default function SharedProfile({ initialProfile }: SharedProfileProps) {
    const router = useRouter();

    // UI State
    const [isEditOpen, setEditModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [editForm, setEditForm] = useState({
        name: initialProfile.name,
        email: initialProfile.email,
        profile_image_url: initialProfile.profile_image_url,
    });
    const [isSaving, setIsSaving] = useState(false);

    const openEditModal = () => setEditModal(true);
    
    const closeEditModal = () => {
        // Reset form on cancel
        setEditForm({ 
            name: initialProfile.name, 
            email: initialProfile.email,
            profile_image_url: initialProfile.profile_image_url
        });
        setErrorMsg("");
        setEditModal(false);
    };

    const handleSave = async () => {
        setErrorMsg("");
        setIsSaving(true);
        
        const result = await updateProfileAction({
            name: editForm.name,
            email: editForm.email,
            profile_image_url: editForm.profile_image_url || null,
        });

        setIsSaving(false);
        
        if (result.success) {
            setEditModal(false);
        } else {
            setErrorMsg(result.message);
        }
    };

    const goBack = () => router.back();

    return (
        <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
            <section className="bg-[#f9fdff] p-[0.25in]">
                <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                    My Profile
                </h1>
            </section>

            <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                <div className="mt-[0.35in] grid grid-cols-1 lg:grid-cols-[2.8in_1fr] gap-[0.35in]">
                    
                    {/* Profile Image */}
                    <aside className="flex flex-col gap-[0.15in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] flex flex-col items-center">
                            <img
                                src={initialProfile.profile_image_url}
                                alt="Staff profile"
                                className="w-[2in] h-[2in] object-cover rounded-full shadow-sm border-2 border-[#002940]"
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
                                    <label className="text-[18px] font-semibold text-[#002940]">ID</label>
                                    <input
                                        type="text"
                                        value={initialProfile.id}
                                        readOnly
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none bg-[#f9fdff] text-[#5c6b73]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[18px] font-semibold text-[#002940]">Full Name</label>
                                    <input
                                        type="text"
                                        value={initialProfile.name}
                                        readOnly
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none bg-[#f9fdff] text-[#5c6b73]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[18px] font-semibold text-[#002940]">Email Address</label>
                                    <input
                                        type="email"
                                        value={initialProfile.email}
                                        readOnly
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none bg-[#f9fdff] text-[#5c6b73]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[5px]">
                                    <label className="text-[18px] font-semibold text-[#002940]">Role</label>
                                    <input
                                        type="text"
                                        value={initialProfile.role.replace('_', ' ').toUpperCase()}
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
                                className="min-w-[1.4in] bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#002940] hover:text-white transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={openEditModal}
                                className="min-w-[1.8in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#013a5a] transition-colors"
                            >
                                Edit Account Details
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {isEditOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Edit Account
                        </h2>

                        {errorMsg && (
                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-300">
                                {errorMsg}
                            </div>
                        )}

                        <div className="mt-[0.25in] flex flex-col gap-5">
                            
                            {/* URL Image Input Section */}
                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    Profile Picture URL
                                </label>
                                <div className="flex flex-col gap-3">
                                    {editForm.profile_image_url ? (
                                        <img
                                            src={editForm.profile_image_url}
                                            className="w-[1.5in] h-[1.5in] object-cover rounded-full shadow-sm mx-auto border-2 border-[#c0cad0]"
                                            alt="Profile preview"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/images/user.png"; 
                                            }}
                                        />
                                    ) : (
                                        <div className="w-[1.5in] h-[1.5in] rounded-full shadow-sm mx-auto border-2 border-[#c0cad0] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                            No Image
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="https://example.com/photo.jpg"
                                        value={editForm.profile_image_url}
                                        onChange={(e) => setEditForm({ ...editForm, profile_image_url: e.target.value })}
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
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>
                        </div>

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={isSaving}
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-[#002940] text-white cursor-pointer hover:bg-[#013a5a] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}