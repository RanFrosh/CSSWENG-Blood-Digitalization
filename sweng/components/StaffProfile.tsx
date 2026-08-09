"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage: string;
};

interface SharedProfileProps {
    initialProfile: UserProfile;
    onSave?: (updatedData: { name: string; email: string }) => Promise<void>; 
}

export default function SharedProfile({ initialProfile, onSave }: SharedProfileProps) {
    const router = useRouter();

    // UI State
    const [isEditOpen, setEditModal] = useState(false);
    
    // Form State (to handle user edits)
    const [editForm, setEditForm] = useState({
        name: initialProfile.name,
        email: initialProfile.email,
    });
    const [isSaving, setIsSaving] = useState(false);

    const openEditModal = () => setEditModal(true);
    const closeEditModal = () => {
        setEditForm({ name: initialProfile.name, email: initialProfile.email });
        setEditModal(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        if (onSave) {
            await onSave(editForm);
        } else {
            alert("Account details updated successfully! (Frontend only)");
        }
        setIsSaving(false);
        setEditModal(false);
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
                                src={initialProfile.profileImage}
                                alt="Staff profile"
                                className="w-full h-full object-cover rounded-xl shadow-sm"
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
                                        value={initialProfile.role}
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
                                    Profile Picture
                                </label>
                                <div className="flex flex-col items-center bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.25in]">
                                    <img
                                        src={initialProfile.profileImage}
                                        className="w-[2in] h-[2in] object-cover rounded-full shadow-sm"
                                        alt="Profile preview"
                                    />
                                    <label className="mt-4 w-full bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer text-center hover:bg-[#013a5a] transition-colors">
                                        Upload Photo
                                    </label>
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
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-[#002940] text-white cursor-pointer hover:bg-[#013a5a] transition-colors disabled:opacity-50 flex items-center justify-center"
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