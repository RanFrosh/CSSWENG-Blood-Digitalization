"use client"

import { useState } from "react";
import Link from "next/link";  
import { registerDonorAction } from "@/app/actions/donor-registration";  
    
export default function RegisterPage() {

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [sex, setSex] = useState("");
    const [bloodType, setBloodType] = useState("");

    return (
        <main className = "flex flex-col min-h-screen bg-[#f9fdff] text-black">

            {/* Header */}
            

            {/* Main Content */}
            <div className = "flex-1 bg-[#c15555] flex flex-row">

                {/* Navigation Panel */}
                <div className = "shrink-0 w-[1in] bg-[#c15555] flex flex-col pt-[0.5in] gap-[0.25] items-center">

                    {/* Buttons */}
                    <div className = "flex flex-col gap-6 mt-8">

                        {/* Scanner Button */}
                        <Link
                            href = "/scanner"
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[80px] mx-auto"
                        >
                            <img src = "/images/scanner.png" className = "w-15 h-15 object-contain group-hover:-translate-y-1 transition-transform"/>

                            <p className = "mt-2 text-xs font-bold text-black font-['Montserrat']">Scan QR</p>

                        </Link>

                        {/* Register Button */}
                        <Link 
                            href = "/register" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[80px] mx-auto"
                        >

                            <img src = "/images/registration.png" className = "w-15 h-15 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-xs font-bold text-black font-['Montserrat']">Register</p>

                        </Link>

                        {/* Log Button */}
                        <Link 
                            href = "/log" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[80px] mx-auto"
                        >

                            <img src = "/images/log.png" className = "w-15 h-15 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-xs font-bold text-black font-['Montserrat']">Log</p>

                        </Link>

                    </div>

                </div>

                {/* Main Panel */}
                <div className = "w-[15in] bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in]">

                    <h1 className = "inline bg-[#c15555] text-[#f9fdff] text-[56px] p-[0.25in] font-['Montserrat'] font-semibold">Donor Registration</h1>

                    {/* Registration Field */}
                    <form action={registerDonorAction} className="flex flex-col gap-[0.25in]">

                        {/* Name Fields */}
                        <div className = "flex flex-row justify-between text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "fname">First Name:</label>

                                <input
                                    name="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    placeholder="First Name" 
                                    required
                                />
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "mname">Middle Name:</label>
                                <input
                                    name="middleName"
                                    type="text"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                />
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "lname">Last Name:</label>

                                <input
                                    name="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "al1">Address Line 1:</label>

                                <input
                                    name="addressLine1"
                                    type="text"
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    className="w-[4.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    placeholder="House no., Building, Street no., Street name"
                                    required
                                />
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "al2">Address Line 2:</label>

                                <input
                                    name="addressLine2"
                                    type="text"
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    className="w-[4.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    placeholder="Subdivision/Village, Barangay"
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* City, Province, and Zip Code Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "city">City:</label>

                                <input
                                    name="city"
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    required
                                />
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "prov">Province:</label>

                                <input
                                    name="province"
                                    type="text"
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    className="w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    required
                                />
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "zip">Zip Code:</label>

                                <input
                                    name="zipCode"
                                    type="text"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    required
                                />
                            </div>

                        </div>

                        {/* Email, Mobile Number, and Sex Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "email">Email Address:</label>

                                <input
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    required
                                />
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "num">Mobile Number:</label>

                                <input
                                    name="mobileNumber"
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
                                    required
                                />
                            </div>

                            <div className="flex flex-row gap-[0.125in] text-[28px]">
                                <label>Sex:</label>

                                <div className="flex flex-row gap-[0.25in]">

                                    <div className="flex flex-row gap-[0.125in]">

                                        <input
                                            type="radio"
                                            name="sex"
                                            id="male"
                                            value="Male"
                                            checked={sex === "Male"}
                                            onChange={(e) => setSex(e.target.value)}
                                            className="req-sex"
                                            required
                                        />
                                        <label htmlFor = "male">Male</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input
                                            type="radio"
                                            name="sex"
                                            id="female"
                                            value="Female"
                                            checked={sex === "Female"}
                                            onChange={(e) => setSex(e.target.value)}
                                            className="req-sex"
                                        />
                                        <label htmlFor = "female">Female</label>

                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Blood Type Field */}
                        <div className="flex flex-row items-start gap-[0.125in] text-[28px]">
                            <label className="whitespace-nowrap">Blood Type:</label>

                            <div className="bld-opt flex flex-col gap-2">
                                <div className="flex flex-row gap-[0.25in]">
                                    
                                    <div className="flex flex-row gap-[0.125in]">

                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="O+"
                                            value="O+"
                                            checked={bloodType === "O+"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                            required
                                        />
                                        <label htmlFor = "O+">O+</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">

                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="A+"
                                            value="A+"
                                            checked={bloodType === "A+"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                        />
                                        <label htmlFor="A+">A+</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="B+"
                                            value="B+"
                                            checked={bloodType === "B+"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                        />
                                        <label htmlFor="B+">B+</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="AB+"
                                            value="AB+"
                                            checked={bloodType === "AB+"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                        />
                                        <label htmlFor="AB+">AB+</label>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-[0.25in]">
                                    <div className="flex flex-row gap-[0.125in]">

                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="O-"
                                            value="O-"
                                            checked={bloodType === "O-"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                        />
                                        <label htmlFor="O-">O-</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="A-"
                                            value="A-"
                                            checked={bloodType === "A-"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                        />
                                        <label htmlFor="A-">A-</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="B-"
                                            value="B-"
                                            checked={bloodType === "B-"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                        />
                                        <label htmlFor="B-">B-</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input
                                            type="radio"
                                            name="bloodType"
                                            id="AB-"
                                            value="AB-"
                                            checked={bloodType === "AB-"}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="req-bld"
                                        />
                                        <label htmlFor="AB-">AB-</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                            <button
                                className="w-[2in] bg-[#1b4054] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline ml-auto text-[21px]"
                                type="submit"
                            >
                                Register Donor
                            </button>
                        </div>
                    </form>

                    
                </div>

                <div className = "flex-1 bg-[#c15555]"></div>
            </div>

            <div className = "bg-[#1b4054] h-[0.75in] shrink-0">
                
                <div className = "p-[0.125in] text-center text-[#f9fdff]">

                </div>

            </div>
            
        </main>

    );
}