"use client"
import { supabase } from "@/db/supa";
import { useRouter } from "next/navigation";    
import Link from "next/link";            

import Header from "@/components/Header";

export default function LogPage() {
  
    const router = useRouter();

    const goHome = () => {
        router.push('/'); 
    };


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
                <div className = "shrink-0 w-[15in] bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in]">

                    <h1 className = "inline bg-[#c15555] text-[56px] text-[#f9fdff] p-[0.25in] font-['Montserrat'] font-semibold">Activity Log</h1>

                    <div className = "flex flex-col">

                        <div className = "flex flex-row py-[0.125in] px-[0.25in] text-[30px] font-bold border-t-[7.5px] border-b-[7.5px] border-[#1b4054]">
                            
                            <div className = "w-[4in] font-['Montserrat']">
                                <p>Date and Time &#8593;</p>
                            </div>
                            
                            <div className = "w-[3in] font-['Montserrat']">
                                <p>User</p>
                            </div>

                            <div className="w-[3in] font-['Montserrat']">
                                <p>User Type</p>
                            </div>
                            
                            <div className="flex-1 font-['Montserrat']">
                                <p>Activity</p>
                            </div>
                        </div>

                        <div className = "flex flex-row py-[0.125in] px-[0.25in] text-[24px] border-b-[7.5px] border-[#1b4054]">

                            <div className = "w-[4in]">
                                <p>2026-06-03 | 06:31:12</p>
                            </div>

                            <div className = "w-[3in]">
                                <p>Jason Doe</p>
                            </div>

                            <div className = "w-[3in]">
                                <p>Admin</p>
                            </div>

                            <div className = "flex-1">
                                <p>Register donor (John Doe)</p>
                            </div>
                        </div>
                        
                        <div className = "flex flex-row py-[0.125in] px-[0.25in] text-[24px] border-b-[7.5px] border-[#1b4054]">
                            
                            <div className="w-[4in]">
                                <p>2026-06-03 | 06:32:10</p>
                            </div>

                            <div className="w-[3in]">
                                <p>John Doe</p>
                            </div>

                            <div className="w-[3in]">
                                <p>Donor</p>
                            </div>

                            <div className="flex-1">
                                <p>Check in</p>
                            </div>
                        </div>

                        <div className="flex flex-row py-[0.125in] px-[0.25in] text-[24px] border-b-[7.5px] border-[#1b4054]">
                            <div className="w-[4in]">
                                <p>2026-06-03 | 06:34:27</p>
                            </div>

                            <div className="w-[3in]">
                                <p>John Doe</p>
                            </div>

                            <div className="w-[3in]">
                                <p>Donor</p>
                            </div>

                            <div className="flex-1">
                                <p>Claim sponsor perk (004)</p>
                            </div>
                        </div>

                        <div className="flex flex-row py-[0.125in] px-[0.25in] text-[24px] border-b-[7.5px] border-[#1b4054]">
                            <div className="w-[4in]">
                                <p>2026-06-03 | 07:01:45</p>
                            </div>

                            <div className="w-[3in]">
                                <p>Jane Doe</p>
                            </div>

                            <div className="w-[3in]">
                                <p>Internal Staff</p>
                            </div>

                            <div className="flex-1">
                                <p>Update donor data (John Doe)</p>
                            </div>
                        </div>
                    </div>
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
