"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderRBD";

type StaffProfile = {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage: string;
};

const sampleStaffProfile: StaffProfile = {
    id: "RBD-001",
    name: "John Doe",
    email: "john.doe@redbank.com",
    role: "Red Bank Director",
    profileImage: "/images/user.png",
};

export default function StaffProfilePage() {
    const router = useRouter();

    const [isEditOpen, setEditModal] = useState(false);

    const openEditModal = () => {
        setEditModal(true);
    };

    const closeEditModal = () => {
        setEditModal(false);
    };

    const saveAccount = () => {
        setEditModal(false);
        alert("Account details updated successfully!");
    };

    const goBack = () => {
        router.back();
    };

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
                                    src={sampleStaffProfile.profileImage}
                                    alt="Staff profile"
                                    className="w-full h-full object-cover"
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
                                            value={sampleStaffProfile.id}
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
                                            value={sampleStaffProfile.name}
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
                                            value={sampleStaffProfile.email}
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
                                            value={sampleStaffProfile.role}
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
                                    Profile Picture
                                </label>

                                <div className="flex flex-col items-center bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.25in]">
                                    <img
                                        src={sampleStaffProfile.profileImage}
                                        className="w-[2in] h-[2in] object-cover"
                                    />

                                    <label className="mt-4 w-full bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer text-center hover:underline">
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
                                    placeholder={sampleStaffProfile.name}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div>
                                <label className="block text-[18px] font-semibold text-[#002940] mb-1">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder={sampleStaffProfile.email}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>
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
                                className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-[#002940] text-white cursor-pointer hover:underline"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}