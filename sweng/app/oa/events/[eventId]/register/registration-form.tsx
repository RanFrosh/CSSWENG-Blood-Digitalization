"use client";

import { useActionState, useState } from "react";
import { registerDonorAction } from "@/app/oa/events/[eventId]/register/action";

type RegisterState = {
    error?: string;
} | null;

type City = {
    id: bigint;
    name: string | null;
};

export default function RegistrationForm({
    eventId,
    cities,
}: {
    eventId: string;
    cities: City[];
}) {
    const [state, formAction] = useActionState<RegisterState, FormData>(
        registerDonorAction,
        null
    );
    
    const [selectedCity, setSelectedCity] = useState("");

    const [citySearch, setCitySearch] = useState("");

    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

    const filteredCityOptions = cities.filter((city) =>
        (city.name ?? "")
            .toLowerCase()
            .includes(citySearch.trim().toLowerCase())
    );

    return (
        <form action={formAction} className="mt-[0.35in] flex flex-col gap-[0.35in]">
            <input type="hidden" name="eventId" value={eventId} />

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
                            name="firstName"
                            type="text"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                            required
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
                            name="middleName"
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
                            name="lastName"
                            type="text"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                            required
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
                            name="age"
                            type="number"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                            required
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
                                    value="Male"
                                    required
                                />

                                <label htmlFor="male">Male</label>
                            </div>

                            <div className="flex flex-row items-center gap-[8px]">
                                <input
                                    type="radio"
                                    name="sex"
                                    id="female"
                                    value="Female"
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
                                name="bloodType"
                                id="O+"
                                value="O+"
                                required
                            />

                            <label htmlFor="O+">O+</label>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <input
                                type="radio"
                                name="bloodType"
                                id="A+"
                                value="A+"
                            />

                            <label htmlFor="A+">A+</label>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <input
                                type="radio"
                                name="bloodType"
                                id="B+"
                                value="B+"
                            />

                            <label htmlFor="B+">B+</label>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <input
                                type="radio"
                                name="bloodType"
                                id="AB+"
                                value="AB+"
                            />

                            <label htmlFor="AB+">AB+</label>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <input
                                type="radio"
                                name="bloodType"
                                id="O-"
                                value="O-"
                            />

                            <label htmlFor="O-">O-</label>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <input
                                type="radio"
                                name="bloodType"
                                id="A-"
                                value="A-"
                            />

                            <label htmlFor="A-">A-</label>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <input
                                type="radio"
                                name="bloodType"
                                id="B-"
                                value="B-"
                            />

                            <label htmlFor="B-">B-</label>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <input
                                type="radio"
                                name="bloodType"
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
                            name="email"
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
                            name="mobileNumber"
                            type="tel"
                            inputMode="numeric"
                            pattern="09\d{9}"
                            placeholder="09XXXXXXXXX"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                            required
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
                            name="address"
                            type="text"
                            placeholder="House No., Building, Street No., Street Name, Subdivision/Village, Barangay"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                        <div className="flex flex-col gap-[5px] relative">
                            <label
                                htmlFor="citySearch"
                                className="text-[18px] font-semibold text-[#002940]"
                            >
                                City
                            </label>

                            <input type="hidden" name="city" value={selectedCity} />

                            <div className="relative">
                                <input
                                    id="citySearch"
                                    type="text"
                                    required
                                    value={citySearch}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setCitySearch(value);
                                        setIsCityDropdownOpen(true);

                                        const matchedCity = cities.find(
                                            (city) =>
                                                (city.name ?? "").toLowerCase() ===
                                                value.trim().toLowerCase()
                                        );

                                        if (matchedCity) {
                                            setSelectedCity(matchedCity.id.toString());
                                        } else {
                                            setSelectedCity("");
                                        }
                                    }}
                                    onFocus={() => setIsCityDropdownOpen(true)}
                                    placeholder="Select or type city"
                                    className="w-full h-[46px] border-2 border-[#c0cad0] rounded-[10px] px-[12px] pr-[42px] text-[18px] outline-none focus:border-[#002940]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#002940] text-[18px] font-bold"
                                >
                                    ▼
                                </button>
                            </div>

                            {isCityDropdownOpen && (
                                <div className="absolute z-50 top-full mt-[6px] w-full max-h-[2.2in] overflow-y-auto bg-white border-2 border-[#c0cad0] rounded-[10px] shadow-lg">
                                    {filteredCityOptions.length > 0 ? (
                                        filteredCityOptions.map((city) => (
                                            <button
                                                key={city.id.toString()}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCity(city.id.toString());
                                                    setCitySearch(city.name ?? "");
                                                    setIsCityDropdownOpen(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-[18px] text-[#002940] hover:bg-[#f2f6f8]"
                                            >
                                                {city.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-[18px] text-gray-500">
                                            No matching city found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[5px]">
                            <label htmlFor="zip" className="text-[18px] font-semibold text-[#002940]">
                                Zip Code
                            </label>

                            <input
                                id="zip"
                                name="zipCode"
                                type="text"
                                inputMode="numeric"
                                pattern="\d{4}"
                                maxLength={4}
                                placeholder="XXXX"
                                className="w-full h-[46px] border-2 border-[#c0cad0] rounded-[10px] px-[12px] text-[18px] outline-none focus:border-[#002940]"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
                
            {/* Error Message */}
            {state?.error && (
            <p className="text-red-600 text-[16px] font-medium">
                {state.error}
            </p>
            )}

            {/* Submit Button */}
            <div className="flex flex-row justify-end pt-[0.15in]">
                <button
                    type="submit"
                    className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:underline"
                >
                    Register Donor
                </button>
            </div>
        </form>
    );
}