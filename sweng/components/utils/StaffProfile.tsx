"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/actions/profile_action";
import { changeOwnPassword } from "@/actions/register_action";

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

    const [isPasswordOpen, setPasswordOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFeedback, setPasswordFeedback] = useState<{ success: boolean; message: string } | null>(null);
    const [isPasswordSaving, setIsPasswordSaving] = useState(false);

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

        const name = editForm.name.trim();
        const email = editForm.email.trim();

        if (!name || !email) {
            setErrorMsg("Name and Email are required. Leave a field as-is to keep its current value.");
            return;
        }

        setIsSaving(true);

        const result = await updateProfileAction({
            name,
            email,
            profile_image_url: editForm.profile_image_url || null,
        });

        setIsSaving(false);
        
        if (result.success) {
            setEditModal(false);
        } else {
            setErrorMsg(result.message);
        }
    };

    const savePassword = async () => {
        if (passwordInput.length < 6) {
            setPasswordFeedback({ success: false, message: "Password must be at least 6 characters" });
            return;
        }
        if (passwordInput !== confirmPasswordInput) {
            setPasswordFeedback({ success: false, message: "Passwords do not match" });
            return;
        }

        setIsPasswordSaving(true);
        setPasswordFeedback(null);

        const result = await changeOwnPassword(passwordInput);

        if (result.success) {
            setPasswordFeedback({ success: true, message: "Password updated successfully. Redirecting to login..." });
            setTimeout(() => router.push("/landing"), 1200);
        } else {
            setPasswordFeedback({ success: false, message: result.message });
        }

        setIsPasswordSaving(false);
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
                            <button
                                type="button"
                                onClick={() => {
                                    setPasswordInput("");
                                    setConfirmPasswordInput("");
                                    setPasswordFeedback(null);
                                    setPasswordOpen(true);
                                }}
                                className="min-w-[1.8in] bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#002940] hover:text-white transition-colors"
                            >
                                Change Password
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

            {isPasswordOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Change Password
                        </h2>

                        {passwordFeedback && (
                            <p className={`mt-[0.15in] text-[16px] font-semibold ${passwordFeedback.success ? "text-green-600" : "text-red-500"}`}>
                                {passwordFeedback.message}
                            </p>
                        )}

                        <div className="mt-[0.25in] flex flex-col gap-5">
                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    New Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        minLength={6}
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] pr-[44px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-[14px] top-1/2 -translate-y-1/2 cursor-pointer text-[#002940] hover:text-[#fd5448] transition"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        minLength={6}
                                        value={confirmPasswordInput}
                                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] pr-[44px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-[14px] top-1/2 -translate-y-1/2 cursor-pointer text-[#002940] hover:text-[#fd5448] transition"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                type="button"
                                onClick={() => setPasswordOpen(false)}
                                disabled={isPasswordSaving}
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={savePassword}
                                disabled={isPasswordSaving}
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-[#002940] text-white cursor-pointer hover:bg-[#013a5a] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                            >
                                {isPasswordSaving ? "Saving..." : "Change Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}