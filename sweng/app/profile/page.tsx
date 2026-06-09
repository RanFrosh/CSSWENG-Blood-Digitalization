"use client"
import { supabase } from "@/db/supa";
import { useRouter } from "next/navigation";    
import Link from "next/link";     

import Header from "@/components/Header";

export default function ProfilePage() {
  
    const router = useRouter();

    const goHome = () => {
        router.push('/'); 
    };

    const claimPerks = () => {
        router.push('/perk'); 
    };

    return (

        <main className = "flex flex-col min-h-screen bg-[#f9fdff] text-black">

            {/* Header */}
            <Header/>

            {/* Main Content */}
            <div className = "flex-1 bg-[#c15555] flex flex-row">

                {/* Navigation Panel */}
                <div className = "shrink-0 w-[1in] bg-[#c15555] flex flex-col pt-[0.5in] gap-[0.25in] items-center">

                    {/* Buttons */}
                    <div className = "flex flex-col gap-6 mt-8">

                        {/* Search Button */}
                        <Link
                            href = "/search"
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[80px] mx-auto"
                        >
                            <img src = "/images/search.png" className = "w-15 h-15 object-contain group-hover:-translate-y-1 transition-transform"/>

                            <p className = "mt-2 text-xs font-bold text-black font-['Montserrat']">Search</p>

                        </Link>

                        {/* Events Button */}
                        <Link 
                            href = "/events" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[80px] mx-auto"
                        >

                            <img src = "/images/planner.png" className = "w-15 h-15 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-xs font-bold text-black font-['Montserrat']">Events</p>

                        </Link>

                        {/* Profile Button */}
                        <Link 
                            href = "/profile" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[80px] mx-auto"
                        >

                            <img src = "/images/user.png" className = "w-15 h-15 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-xs font-bold text-black font-['Montserrat']">Donor</p>

                        </Link>

                    </div>

                </div>

                {/* Donor Profile */}
                <div className = "w-[3.25in] shrink-0 bg-[#f9fdff] p-[0.25in] flex flex-col gap-[0.5in]">

                    <h1 className = "text-[36px] mt-[0.25in] font-['Montserrat'] text-[#1b4054]">Donor Profile</h1>

                    <div className = "flex flex-col gap-[0.25in]">
                        
                        <div className = "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Name:</h3>
                            <p>John Sue Doe</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Email address:</h3>
                            <p>john_doe@gmail.com</p>
                        </div>
                        
                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Mobile number:</h3>
                            <p>0912-345-6789</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Sex:</h3>
                            <p>Male</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Blood type:</h3>
                            <p>O+</p>
                        </div>
                    </div>
                </div>

                {/* Main Panel */}
                <div className = "bg-[#c15555] p-[0.5in] pr-[0.25in] flex flex-row gap-[0.5in]">

                    <div className = "flex flex-col mr-[0.25in] gap-[0.25in]">
                        
                        <h1 className = "text-[56px] mt-[-0.25in] mb-[-0.25in] text-[#f9fdff] font-['Montserrat'] font-semibold">Donor Data</h1>

                        {/* Donor Data */}
                        <div className = "flex flex-row justify-between gap-[0.25in]">

                            <div className = "w-[3.5in] flex flex-col gap-[0.125in] bg-[#f9fdff] p-[0.25in]">

                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[24px] font-semibold font-['Montserrat'] text-[#1b4054]">Total visits:</h3>
                                    <p >7</p>
                                </div>
                                
                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[24px] font-semibold font-['Montserrat'] text-[#1b4054]">Latest visit:</h3>
                                    <p>2026-05-23</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col gap-[0.125in] bg-[#f9fdff] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[24px] font-semibold font-['Montserrat'] text-[#1b4054]">Perks claimed:</h3>
                                    <p>6</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col gap-[0.125in] bg-[#f9fdff] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[24px] font-semibold font-['Montserrat'] text-[#1b4054]">Blood donated:</h3>
                                    <p>3.15L</p>
                                </div>

                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[24px] font-semibold font-['Montserrat'] text-[#1b4054]">Blood bags filled:</h3>
                                    <p>9</p>
                                </div>
                            </div>

                        </div>

                        <h1 className = "text-[56px] mb-[-0.25in] text-[#f9fdff] font-['Montserrat'] font-semibold">Donor Actions</h1>

                        <div className = "flex flex-col gap-[0.25in]">

                            <div className = "flex flex-row bg-[#1b4054] rounded-[20px] p-[0.25in] transition-transform duration-200 hover:scale-[1.03125]">
                                <div className = "flex flex-col text-[21px] text-[#f9fdff]">
                                    <h3 className="font-semibold font-['Montserrat'] text-[24px]">Update donor analytics</h3>
                                    <p className="pl-[0.25in]">Record new donor data after onsite procedures</p>
                                </div>
                            </div>

                            <div className = "flex flex-row bg-[#1b4054] rounded-[20px] p-[0.25in] transition-transform duration-200 hover:scale-[1.03125]" onClick={claimPerks}>
                                <div className = "flex flex-col text-[21px] text-[#f9fdff]">
                                    <h3 className="font-semibold font-['Montserrat'] text-[24px]">Claim sponsor perks</h3>
                                    <p className="pl-[0.25in]">Verify donor eligibility and authorize claiming</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div className = "bg-[#1b4054] h-[0.75in] shrink-0">
                
                <div className = "p-[0.125in] text-center text-[#f9fdff]">

                </div>

            </div>

        </main>

    );
}
