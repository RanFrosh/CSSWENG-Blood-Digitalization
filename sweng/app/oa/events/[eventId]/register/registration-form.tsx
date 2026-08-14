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

    const selectedCityName = cities.find(c => c.id.toString() === selectedCity)?.name || "";
    const isPristine = citySearch === selectedCityName;

    const filteredCityOptions = isPristine 
        ? cities 
        : cities.filter((city) =>
            (city.name ?? "")
                .toLowerCase()
                .includes(citySearch.trim().toLowerCase())
        );

        const Label = ({ htmlFor, text, required = false }: { htmlFor?: string, text: string, required?: boolean }) => (
        <label htmlFor={htmlFor} className="text-[14px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
            {text} {required && <span className="text-[#fd5448] text-lg leading-none align-top">*</span>}
        </label>
    );

    return (
        <form action={formAction} className="mt-[0.35in] flex flex-col gap-[0.35in]">
            <input type="hidden" name="eventId" value={eventId} />

            {/* Basic Information Fields */}
            <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">

                <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                    Basic Donor Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="fname" text="First Name" required />
                        <input
                            id="fname"
                            name="firstName"
                            type="text"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="mname" text="Middle Name" />
                        <input
                            id="mname"
                            name="middleName"
                            type="text"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="lname" text="Last Name" required />
                        <input
                            id="lname"
                            name="lastName"
                            type="text"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="age" text="Age" required />
                        <input
                            id="age"
                            name="age"
                            type="number"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="sex" text="Sex" required />
                        <select
                            name="sex"
                            id="sex"
                            required
                            defaultValue=""
                            className="w-full h-[46px] border-2 border-[#c0cad0] rounded-[10px] px-[12px] text-[18px] text-[#002940] outline-none focus:border-[#002940] transition-colors bg-white cursor-pointer appearance-none"
                        >
                            <option value="" disabled>Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="bloodType" text="Blood Type" required />
                        <select
                            name="bloodType"
                            id="bloodType"
                            required
                            defaultValue=""
                            className="w-full h-[46px] border-2 border-[#c0cad0] rounded-[10px] px-[12px] text-[18px] text-[#002940] outline-none focus:border-[#002940] transition-colors bg-white cursor-pointer appearance-none"
                        >
                            <option value="" disabled>Select Blood Type</option>
                            {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((bt) => (
                                <option key={bt} value={bt}>
                                    {bt}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                </div>

                {/* Contact Information Fields */}
                <h3 className="mt-10 text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                    Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="email" text="Email Address" required />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="mobile" text="Mobile Number" required />
                        <input
                            id="mobile"
                            name="mobileNumber"
                            type="tel"
                            inputMode="numeric"
                            pattern="09\d{9}"
                            placeholder="09XXXXXXXXX"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Address Fields */}
                <h3 className="mt-10 text-[24px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                    Address
                </h3>

                <div className="grid grid-cols-1 gap-[0.25in]">
                    <div className="flex flex-col gap-[5px]">
                        <Label htmlFor="address" text="Street Address"/>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="House No., Building, Street No., Subdivision, Barangay"
                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                        <div className="flex flex-col gap-[5px] relative">
                            <Label htmlFor="citySearch" text="City" required />
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
                                            (city) => (city.name ?? "").toLowerCase() === value.trim().toLowerCase()
                                        );
                                        setSelectedCity(matchedCity ? matchedCity.id.toString() : "");
                                    }}
                                    onFocus={(e) => {
                                        e.target.select();
                                        setIsCityDropdownOpen(true);
                                    }}
                                    placeholder="Select or type city"
                                    className="w-full h-[46px] border-2 border-[#c0cad0] rounded-[10px] px-[12px] pr-[42px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                                />

                                <button
                                    type="button"
                                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#002940] text-[18px] font-bold cursor-pointer"
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
                                                className="w-full px-4 py-3 text-left text-[18px] font-medium text-[#002940] hover:bg-[#f2f6f8] border-b border-slate-100 last:border-0"
                                            >
                                                {city.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-[18px] text-gray-500 italic text-center">
                                            No matching city found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[5px]">
                            <Label htmlFor="zip" text="Zip Code" />
                            <input
                                id="zip"
                                name="zipCode"
                                type="text"
                                inputMode="numeric"
                                pattern="\d{4}"
                                maxLength={4}
                                placeholder="XXXX"
                                className="w-full h-[46px] border-2 border-[#c0cad0] rounded-[10px] px-[12px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-3 flex flex-row justify-end pt-[0.15in]">
                    <button
                        type="submit"
                        className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#001f30] transition-colors shadow-sm active:scale-[0.98]"
                    >
                        Register Donor
                    </button>
                </div>
            </section>
                
            {/* Error Message */}
            {state?.error && (
                <div className="bg-[#fef2f2] border-2 border-[#fd5448] text-[#fd5448] px-[0.25in] py-[0.15in] rounded-[12px] flex items-center gap-[10px]">
                    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[18px] font-semibold">{state.error}</p>
                </div>
            )}
 
        </form>
    );
}