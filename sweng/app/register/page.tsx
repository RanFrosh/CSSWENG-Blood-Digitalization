"use client"
import { supabase } from "@/db/supa";
import { useRouter } from "next/navigation";    
import Link from "next/link";            

export default function RegisterPage() {
  
    const router = useRouter();

    const goHome = () => {
        router.push('/'); 
    };

    const registerDonor = () => {
        alert("Donor registered!");
        router.push('/scanner'); 
    };

    return (

        <main className = "flex flex-col min-h-screen bg-[#f9fdff] text-black">

            {/* Header */}
            <div className = "h-[0.75in] border-b-[5px] border-b-[#c15555]">

                <div className = "p-[0.125in] gap-[0.25in] flex flex-row items-center">

                    <img 
                        className = "h-[0.5in]" 
                        src = "/images/logo.png" 
                    />

                    <div className = "text-[30px] text-[#8a2d2d] hover:underline">
                        <h1>Red Bank Foundation</h1>
                    </div>

                </div>

            </div>

            {/* Main Content */}
            <div className = "h-[80%] bg-[#c15555] flex flex-row">

                {/* Left Panel */}
                <div className = "h-full w-[1.3in] bg-[#c15555] flex flex-col pt-[0.5in] gap-[0.25] items-center">

                    {/* Buttons */}
                    <div className = "flex flex-col gap-6 mt-8">

                        {/* Scanner Button */}
                        <Link
                            href = "/scanner"
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[100px] mx-auto"
                        >
                            <img src = "/images/scanner.png" className = "w-20 h-20 object-contain group-hover:-translate-y-1 transition-transform"/>

                            <p className = "mt-2 text-sm font-bold text-black-700">Scan QR</p>

                        </Link>

                        {/* Register Button */}
                        <Link 
                            href = "/register" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[100px] mx-auto"
                        >

                            <img src = "/images/registration.png" className = "w-20 h-20 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-sm font-bold text-black-700">Register</p>

                        </Link>

                        {/* Log Button */}
                        <Link 
                            href = "/log" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[100px] mx-auto"
                        >

                            <img src = "/images/log.png" className = "w-20 h-20 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-sm font-bold text-black-700">Log</p>

                        </Link>

                    </div>

                </div>

                {/* Main Panel */}
                <div className = "h-full w-[15in] bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in]">

                    <h1 className = "inline bg-[#c15555] text-[#f9fdff] text-[56px] p-[0.25in]">Donor Registration</h1>

                    {/* Registration Field */}
                    <div className = "flex flex-col gap-[0.5in]">

                        {/* Name Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "fname">First Name:</label>
                                <input type = "text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "mname">Middle Name:</label>
                                <input type = "text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "lname">Last Name:</label>
                                <input type = "text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                                
                            </div>

                        </div>

                        {/* Address Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "al1">Address Line 1:</label>
                                <input type = "text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]" 
                                    placeholder = "House number, Building, Street number, Street name"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "al2">Address Line 2:</label>
                                <input type = "text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]" 
                                    placeholder = "Subdivision/Village, Barangay"/>
                            </div>

                        </div>
                        
                        {/* City, Province, and Zip Code Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "city">City:</label>
                                <input type = "text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "prov">Province:</label>
                                <input type = "text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "zip">Zip Code:</label>
                                <input type="text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                            </div>

                        </div>

                        {/* Email, Mobile Number, and Sex Fields */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "email">Email Address:</label>
                                <input type="text" className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label htmlFor = "num">Mobile Number:</label>
                                <input type="text" className="w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"/>
                            </div>

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label>Sex:</label>

                                <div className="flex flex-row gap-[0.25in]">

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input type="radio" name="sex" id="male" value="male" className="req-sex"/>
                                        <label htmlFor = "male">male</label>
                                    </div>

                                    <div className="flex flex-row gap-[0.125in]">
                                        <input type="radio" name="sex" id="female" value="female" className="req-sex"/>
                                        <label htmlFor = "female">female</label>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Blood Type Field */}
                        <div className = "flex flex-row justify-between gap-[0.5in] text-[28px]">

                            <div className = "flex flex-row gap-[0.125in] text-[28px]">
                                <label>Blood Type:</label>

                                <div className="bld-opt">
                                    <div className="flex flex-row gap-[0.25in]">
                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="O+" value="O+" className="req-bld"/>
                                            <label htmlFor = "O+">O+</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="A+" value="A+" className="req-bld"/>
                                            <label htmlFor="A+">A+</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="B+" value="B+" className="req-bld"/>
                                            <label htmlFor="B+">B+</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="AB+" value="AB+" className="req-bld"/>
                                            <label htmlFor="AB+">AB+</label>
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-[0.25in]">
                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="O-" value="O-" className="req-bld"/>
                                            <label htmlFor="O-">O-</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="A-" value="A-" className="req-bld"/>
                                            <label htmlFor="A-">A-</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="B-" value="B-" className="req-bld"/>
                                            <label htmlFor="B-">B-</label>
                                        </div>

                                        <div className="flex flex-row gap-[0.125in]">
                                            <input type="radio" name="blood" id="AB-" value="AB-" className="req-bld"/>
                                            <label htmlFor="AB-">AB-</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className = "flex flex-end">
                        <button className = "w-[2in] bg-[#8a2d2d] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline">Register Donor</button>
                    </div>
                </div>

                <div className = "flex-1 bg-[#c15555]"></div>
            </div>

            <div className = "border-t-[5px] border-[#c15555] bg-[#8a2d2d] flex-1">

                <div className = "p-[0.125in] items-center text-[#f9fdff]">
                
                </div>
            </div>
            
        </main>

    );
}
