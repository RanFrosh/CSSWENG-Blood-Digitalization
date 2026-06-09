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
            <div className = "h-[80%] bg-[#c15555] flex flex-row">

                {/* Left Panel */}
                <div className = "h-full w-[1.3in] bg-[#c15555] flex flex-col pt-[0.5in] gap-[0.25] items-center">

                    {/* Buttons */}
                    <div className = "flex flex-col gap-6 mt-8">

                        {/* Search Button */}
                        <Link
                            href = "/search"
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[100px] mx-auto"
                        >
                            <img src = "/images/search.png" className = "w-20 h-20 object-contain group-hover:-translate-y-1 transition-transform"/>

                            <p className = "mt-2 text-sm font-bold text-black">Search</p>

                        </Link>

                        {/* Events Button */}
                        <Link 
                            href = "/events" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[100px] mx-auto"
                        >

                            <img src = "/images/planner.png" className = "w-20 h-20 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-sm font-bold text-black">Events</p>

                        </Link>

                        {/* Profile Button */}
                        <Link 
                            href = "/profile" 
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[100px] mx-auto"
                        >

                            <img src = "/images/user.png" className = "w-20 h-20 object-contain group-hover:-translate-y-1 transition-transform" />
                            
                            <p className = "mt-2 text-sm font-bold text-black">Profile</p>

                        </Link>

                    </div>

                </div>

                {/* Donor Profile */}
                <div className = "w-[3.25in] bg-[#f9fdff] p-[0.25in] flex flex-col gap-[0.5in]">

                    <h1 className = "text-[42px] mt-[0.25in]">Donor Profile</h1>

                    <div className = "flex flex-col">
                        
                        <div className = "h-[0.5in] flex flex-row text-[18px] items-center gap-[0.125in]">
                            <h3 className = "font-bold">Name:</h3>
                            <p>John Sue Doe</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-row text-[18px] items-center gap-[0.125in]">
                            <h3 className = "font-bold">Email address:</h3>
                            <p>john_doe@gmail.com</p>
                        </div>
                        
                        <div className= "h-[0.5in] flex flex-row text-[18px] items-center gap-[0.125in]">
                            <h3 className = "font-bold">Mobile number:</h3>
                            <p>0912-345-6789</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-row text-[18px] items-center gap-[0.125in]">
                            <h3 className = "font-bold">Sex:</h3>
                            <p>Male</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-row text-[18px] items-center gap-[0.125in]">
                            <h3 className = "font-bold">Blood type:</h3>
                            <p>O+</p>
                        </div>
                    </div>
                </div>

                {/* Main Panel */}
                <div className = "flex-1 bg-[#c15555] p-[0.75in] pr-[0.25in] flex flex-row gap-[0.5in]">

                    <div className = "flex-1 flex flex-col mr-[0.25in] gap-[0.75in]">
                        
                        <h1 className = "text-[56px] mb-[-0.5in] text-[#f9fdff]">Donor Data</h1>

                        {/* Donor Data */}
                        <div className = "flex flex-row justify-between bg-[#8a2d2d] gap-[0.125in] p-[0.25in]">

                            <div className = "w-[3.5in] flex flex-col">

                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Total visits:</h3>
                                    <p>7</p>
                                </div>
                                
                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Latest visit:</h3>
                                    <p>2026-05-23</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col">
                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Perks claimed:</h3>
                                    <p>2</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col">
                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Blood donated:</h3>
                                    <p>3.15L</p>
                                </div>

                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Blood bags filled:</h3>
                                    <p>9</p>
                                </div>
                            </div>

                        </div>

                        <h1 className = "text-[56px] mb-[-0.5in] text-[#f9fdff]">Donor Actions</h1>

                        <div className = "flex flex-col gap-[0.5in]">

                            <div className = "flex flex-row bg-[#8a2d2d] rounded-[20px] gap-[0.125in] p-[0.25in] transition-transform duration-200 hover:scale-[1.03125]">
                                <div className = "flex flex-col text-[21px] text-[#f9fdff] gap-[0.125in]">
                                    <h3>Update donor analytics</h3>
                                    <p>Record new donor data after onsite procedures</p>
                                </div>
                            </div>

                            <div className = "flex flex-row bg-[#8a2d2d] rounded-[20px] gap-[0.125in] p-[0.25in] transition-transform duration-200 hover:scale-[1.03125]" onClick={claimPerks}>
                                <div className = "flex flex-col text-[21px] text-[#f9fdff] gap-[0.125in]">
                                    <h3>Claim sponsor perks</h3>
                                    <p>Verify donor eligibility and authorize claiming</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div className = "border-t-[5px] border-[#c15555] bg-[#8a2d2d] flex-1">

                <div className = "p-[0.125in] items-center text-[#f9fdff]">
                
                </div>
            </div>

        </main>

    );
}
