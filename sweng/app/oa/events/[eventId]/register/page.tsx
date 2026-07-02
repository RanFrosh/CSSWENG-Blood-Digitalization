"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderOA";

export default function RegisterPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    const registerDonor = () => {
        alert("Donor registered!");

        if (eventId) {
            router.push(`/oa/events/${eventId}/scanner`);
        } else {
            router.push("/oa/events");
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff]">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Page Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[16px] font-['Montserrat'] text-[#002940]">
                        Onsite Admin
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Registration
                    </h1>
                </section>

                {/* Registration Form */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div>
                        <div>
                            <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                Donor Information
                            </h2>
                        </div>
                    </div>

                    <form className="mt-[0.35in] flex flex-col gap-[0.35in]">
                        {/* Name Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                Name
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="fname"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        First Name
                                    </label>

                                    <input
                                        id="fname"
                                        type="text"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="mname"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        Middle Name
                                    </label>

                                    <input
                                        id="mname"
                                        type="text"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="lname"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        Last Name
                                    </label>

                                    <input
                                        id="lname"
                                        type="text"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Basic Information Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="age"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        Age
                                    </label>

                                    <input
                                        id="age"
                                        type="number"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="birthdate"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        Birth Date
                                    </label>
                                    <input
                                        id="birthdate"
                                        type="date"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[10px]">
                                    <p className="text-[18px] font-semibold text-[#002940]">
                                        Sex
                                    </p>

                                    <div className="flex flex-row gap-[0.25in] text-[18px]">
                                        <div className="flex flex-row items-center gap-[8px]">
                                            <input
                                                type="radio"
                                                name="sex"
                                                id="male"
                                                value="male"
                                            />

                                            <label htmlFor="male">Male</label>
                                        </div>

                                        <div className="flex flex-row items-center gap-[8px]">
                                            <input
                                                type="radio"
                                                name="sex"
                                                id="female"
                                                value="female"
                                            />

                                            <label htmlFor="female">Female</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blood Type Field */}
                        <div>
                            <h3 className="text-[22px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                Blood Type
                            </h3>

                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in]">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-[0.15in] text-[18px]">
                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="O+"
                                            value="O+"
                                        />

                                        <label htmlFor="O+">O+</label>
                                    </div>

                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="A+"
                                            value="A+"
                                        />

                                        <label htmlFor="A+">A+</label>
                                    </div>

                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="B+"
                                            value="B+"
                                        />

                                        <label htmlFor="B+">B+</label>
                                    </div>

                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="AB+"
                                            value="AB+"
                                        />

                                        <label htmlFor="AB+">AB+</label>
                                    </div>

                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="O-"
                                            value="O-"
                                        />

                                        <label htmlFor="O-">O-</label>
                                    </div>

                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="A-"
                                            value="A-"
                                        />

                                        <label htmlFor="A-">A-</label>
                                    </div>

                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="B-"
                                            value="B-"
                                        />

                                        <label htmlFor="B-">B-</label>
                                    </div>

                                    <div className="flex flex-row items-center gap-[8px]">
                                        <input
                                            type="radio"
                                            name="blood"
                                            id="AB-"
                                            value="AB-"
                                        />

                                        <label htmlFor="AB-">AB-</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                Contact Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="email"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>

                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="mobile"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        Mobile Number
                                    </label>

                                    <input
                                        id="mobile"
                                        type="tel"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div>
                            <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                Address
                            </h3>

                            <div className="grid grid-cols-1 gap-[0.25in]">
                                <div className="flex flex-col gap-[5px]">
                                    <label
                                        htmlFor="address"
                                        className="text-[18px] font-semibold text-[#002940]"
                                    >
                                        Address
                                    </label>

                                    <input
                                        id="address"
                                        type="text"
                                        placeholder="House no., building, street no., street name, subdivision/village, barangay"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                                    <div className="flex flex-col gap-[5px]">
                                        <label
                                            htmlFor="city"
                                            className="text-[18px] font-semibold text-[#002940]"
                                        >
                                            City
                                        </label>

                                        <input
                                            id="city"
                                            type="text"
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[5px]">
                                        <label
                                            htmlFor="province"
                                            className="text-[18px] font-semibold text-[#002940]"
                                        >
                                            Province
                                        </label>

                                        <input
                                            id="province"
                                            type="text"
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[5px]">
                                        <label
                                            htmlFor="zip"
                                            className="text-[18px] font-semibold text-[#002940]"
                                        >
                                            Zip Code
                                        </label>

                                        <input
                                            id="zip"
                                            type="text"
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-row justify-end pt-[0.15in]">
                            <button
                                type="button"
                                onClick={registerDonor}
                                className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:underline"
                            >
                                Register Donor
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}