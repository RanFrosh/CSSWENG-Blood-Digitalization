"use client"
import { supabase } from "@/db/supa";
import { useRouter } from "next/navigation"; 
import Link from "next/link";            

import Header from "@/components/Header";

export default function PerkPage() {

    const router = useRouter();
    
    const returnToDonor = () => {
        alert("Perk claimed! Returning to donor profile.");
        router.push('/profile'); 
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

                {/* Left Panel */}
                <div className = "w-[3.25in] bg-[#f9fdff] p-[0.25in] flex flex-col gap-[0.5in]">

                    <h1 className = "text-[40px] font-normal mt-[0.25in] font-['Montserrat'] text-[#1b4054]">Instructions:</h1>

                    <div className = "flex flex-col text-[21px]">

                        <div className = "h-[0.75in] flex items-center border-b-[5px] border-[#1b4054] pb-[0.25in]">
                            <p>Open the Red Bank Foundation app.</p>
                        </div>

                        <div className = "h-[0.75in] flex items-center border-b-[5px] border-[#1b4054]">
                            <p>Go to user profile.</p>
                        </div>
                        
                        <div className = "h-[0.75in] flex items-center border-b-[5px] border-[#1b4054]">
                            <p>Go to sponser perks.</p>
                        </div>

                        <div className = "h-[0.75in] flex items-center border-b-[5px] border-[#1b4054]">
                            <p>Select a claimable perk.</p>
                        </div>

                        <div className = "h-[0.75in] flex items-center border-b-[5px] border-[#1b4054]">
                            <p>Show QR code to scanner.</p>
                        </div>

                    </div>

                </div>

                {/* Main Panel */}
                <div className = "flex-1 bg-[#c15555] p-[0.5in] flex flex-row gap-[0.5in]">

                    <div className = "flex flex-col w-[10in] gap-[0.25in]">

                        <div className = "header">
                            <h1 className = "text-[56px] text-[#f9fdff] font-['Montserrat'] font-semibold">Claim Sponsor Perk</h1>
                        </div>

                        <div className = "w-[85%]">
                            <img src = "/images/camera.png" className = "w-[7in]" onClick={returnToDonor}/>
                            
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
