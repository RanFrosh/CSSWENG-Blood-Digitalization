<<<<<<< Updated upstream
"use client";
=======
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";   
import Link from "next/link";    
>>>>>>> Stashed changes

import { registerDonorAction } from "@/app/actions/donor-actions";
import Link from "next/link";
import Header from "@/components/Header";

    
export default function RegisterPage() {
<<<<<<< Updated upstream
=======
    const router = useRouter();

    const [submitted, setSubmitted] = useState(false);

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

    const registerDonor = async () => {
        setSubmitted(true);

        const response = await fetch("/api/donors", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            firstName,
            middleName,
            lastName,
            addressLine1,
            addressLine2,
            city,
            province,
            zipCode,
            email,
            mobileNumber,
            sex,
            bloodType,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error ?? "Failed to register donor");
            return;
        }

        alert("Donor registered!");
        router.push("/scanner");
    };

>>>>>>> Stashed changes
    return (
        <main className = "flex flex-col min-h-screen bg-[#f9fdff] text-black">

            {/* Header */}
            <Header/>

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
<<<<<<< Updated upstream
                                <input id="fname"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]" />
                            </div>  

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "mname">Middle Name:</label>
                                <input id = "mname"
                                    name="middleName"
                                    type="text"
                                    className = "w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"/>
=======
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={`w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                    ${
                                        submitted && firstName.trim() === ""
                                            ? "border-2 border-red-500"
                                            : "border-2 border-gray-300"
                                    }`}
                                    placeholder="First Name" 
                                />
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "mname">Middle Name:</label>
                                <input
                                    type="text"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]" />
>>>>>>> Stashed changes
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "lname">Last Name:</label>
<<<<<<< Updated upstream
                                <input id = "lname"
                                    name="lastName"
                                    type="text"
                                    required
                                    className = "w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"/>
                                
=======
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={`w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                    ${
                                        submitted && lastName.trim() === ""
                                            ? "border-2 border-red-500"
                                            : "border-2 border-gray-300"
                                    }`}
                                    placeholder="Last Name"
                                />
>>>>>>> Stashed changes
                            </div>

                        </div>

                        {/* Address Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "al1">Address Line 1:</label>
<<<<<<< Updated upstream
                                <input id = "al1"
                                    name="addressLine1"
                                    type = "text"
                                    className = "w-[4.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
=======
                                <input
                                    type="text"
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    className={`w-[4.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                    ${
                                        submitted && addressLine1.trim() === ""
                                            ? "border-2 border-red-500"
                                            : "border-2 border-gray-300"
                                    }`}
>>>>>>> Stashed changes
                                    placeholder = "House no., Building, Street no., Street name"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "al2">Address Line 2:</label>
<<<<<<< Updated upstream
                                <input id = "al2"
                                    name="addressLine2"
                                    type = "text"
                                    className = "w-[4.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
=======
                                <input
                                    type="text"
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    className="w-[4.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"
>>>>>>> Stashed changes
                                    placeholder = "Subdivision/Village, Barangay"/>
                            </div>

                        </div>
                        
                        {/* City, Province, and Zip Code Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "city">City:</label>
<<<<<<< Updated upstream
                                <input id = "city"
                                    name="city"
                                    type = "text"
                                    className = "w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"/>
=======
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={`w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                    ${
                                        submitted && city.trim() === ""
                                            ? "border-2 border-red-500"
                                            : "border-2 border-gray-300"
                                    }`}
                                />
>>>>>>> Stashed changes
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "prov">Province:</label>
<<<<<<< Updated upstream
                                <input id = "prov"
                                    name="province"
                                    type = "text"
                                    className = "w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"/>
=======
                                <input
                                    type="text"
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    className={`w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                        ${
                                            submitted && province.trim() === ""
                                                ? "border-2 border-red-500"
                                                : "border-2 border-gray-300"
                                        }`}
                                />
>>>>>>> Stashed changes
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "zip">Zip Code:</label>
<<<<<<< Updated upstream
                                <input id = "zip"
                                    name="zipCode"
                                    type="text"
                                    className = "w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"/>
=======
                                <input
                                    type="text"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className={`w-[3in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                        ${
                                            submitted && zipCode.trim() === ""
                                                ? "border-2 border-red-500"
                                                : "border-2 border-gray-300"
                                        }`}
                                />
>>>>>>> Stashed changes
                            </div>

                        </div>

                        {/* Email, Mobile Number, and Sex Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "email">Email Address:</label>
<<<<<<< Updated upstream
                                <input id = "email"
                                    name="email"
                                    type="email"
                                    className = "w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"/>
=======
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                        ${
                                            submitted && email.trim() === ""
                                                ? "border-2 border-red-500"
                                                : "border-2 border-gray-300"
                                        }`}
                                />
>>>>>>> Stashed changes
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "num">Mobile Number:</label>
<<<<<<< Updated upstream
                                <input id = "num"
                                    name="mobileNumber"
                                    type="tel"
                                    className="w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "sex">Sex:</label>
=======
                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className={`w-[2.5in] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] text-[21px]
                                        ${
                                            submitted && mobileNumber.trim() === ""
                                                ? "border-2 border-red-500"
                                                : "border-2 border-gray-300"
                                        }`}
                                />
                            </div>

                            <div
                                className={`flex flex-row gap-[0.125in] text-[28px]
                                ${
                                    submitted && !sex ? "border-2 border-red-500" : ""
                                }`}
                            >
                                <label>Sex:</label>
>>>>>>> Stashed changes

                                <div className="flex flex-row gap-[0.25in]">

                                    <div className="flex flex-row gap-[0.125in]">
<<<<<<< Updated upstream
                                        <input id="male"
                                            name="sex"
                                            type="radio"
                                            value="male" required className="req-sex" />
                                        <label htmlFor = "male">male</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input id = "female"
                                            name="sex"
                                            type="radio"
                                            value="female"
                                            className="req-sex"/>
                                        <label htmlFor = "female">female</label>
=======
                                        <input
                                            type="radio"
                                            name="sex"
                                            id="male"
                                            value="Male"
                                            checked={sex === "Male"}
                                            onChange={(e) => setSex(e.target.value)}
                                            className="req-sex" />
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
>>>>>>> Stashed changes
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Blood Type Field */}
                        <div
                            className={`flex flex-row justify-between gap-[0.5in] text-[28px]
                                ${submitted && !bloodType ? "border-2 border-red-500" : ""
                                }`}
                        >

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "bld">Blood Type:</label>

                                <div className="bld-opt">
                                    <div className="flex flex-row gap-[0.25in]">
                                        <div className="flex flex-row gap-[0.125in]">
<<<<<<< Updated upstream
                                            <input id = "O+" type="radio" name="bloodType" value="O+" className="req-bld"/>
=======
                                            <input
                                                type="radio"
                                                name="blood"
                                                id="O+"
                                                value="O+"
                                                checked={bloodType === "O+"}
                                                onChange={(e) => setBloodType(e.target.value)}
                                                className="req-bld"
                                            />
>>>>>>> Stashed changes
                                            <label htmlFor = "O+">O+</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
<<<<<<< Updated upstream
                                            <input id = "A+" type="radio" name="bloodType" value="A+" className="req-bld"/>
                                            <label htmlFor = "A+">A+</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input id = "B+" type="radio" name="bloodType" value="B+" className="req-bld"/>
                                            <label htmlFor = "B+">B+</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input id = "AB+" type="radio" name="bloodType" value="AB+" className="req-bld"/>
                                            <label htmlFor = "AB+">AB+</label>
=======
                                            <input
                                                type="radio"
                                                name="blood"
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
                                                name="blood"
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
                                                name="blood"
                                                id="AB+"
                                                value="AB+"
                                                checked={bloodType === "AB+"}
                                                onChange={(e) => setBloodType(e.target.value)}
                                                className="req-bld"
                                            />
                                            <label htmlFor="AB+">AB+</label>
>>>>>>> Stashed changes
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-[0.25in]">
                                        <div className="flex flex-row gap-[0.125in]">
<<<<<<< Updated upstream
                                            <input id = "O-" type="radio" name="bloodType" value="O-" className="req-bld"/>
                                            <label htmlFor = "O-">O-</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input id = "A-" type="radio" name="bloodType" value="A-" className="req-bld"/>
                                            <label htmlFor = "A-">A-</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input id = "B-" type="radio" name="bloodType" value="B-" className="req-bld"/>
                                            <label htmlFor = "B-">B-</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input id = "AB-" type="radio" name="bloodType" value="AB-" className="req-bld"/>
                                            <label htmlFor = "AB-">AB-</label>
=======
                                            <input
                                                type="radio"
                                                name="blood"
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
                                                name="blood"
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
                                                name="blood"
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
                                                name="blood"
                                                id="AB-"
                                                value="AB-"
                                                checked={bloodType === "AB-"}
                                                onChange={(e) => setBloodType(e.target.value)}
                                                className="req-bld"
                                            />
                                            <label htmlFor="AB-">AB-</label>
>>>>>>> Stashed changes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-end -mt-[0.6in]">
                            <button className = "w-[2in] bg-[#1b4054] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline ml-auto text-[21px]" type="submit">
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