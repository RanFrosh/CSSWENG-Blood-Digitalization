"use client"
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

    const donor = {
        name: "",
        email: "",
        number: "",
        sex: "",
        bloodType: "",
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
                            href = "/list"
                            className = "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer group w-[80px] mx-auto"
                        >
                            <img src = "/images/search.png" className = "w-15 h-15 object-contain group-hover:-translate-y-1 transition-transform"/>

                            <p className = "mt-2 text-xs font-bold text-black font-['Montserrat']">Search</p>

                        </Link>

                    </div>

                </div>

                {/* Donor Profile */}
                <div className = "w-[3.25in] shrink-0 bg-[#f9fdff] p-[0.25in] flex flex-col gap-[0.5in]">

                    <h1 className = "text-[36px] mt-[0.25in] font-['Montserrat'] text-[#1b4054]">Donor Profile</h1>

                    <div className = "flex flex-col gap-[0.25in]">
                        
                        <div className = "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Name:</h3>
                            <p>{donor.name}</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Email address:</h3>
                            <p>{donor.email}</p>
                        </div>
                        
                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Mobile number:</h3>
                            <p>{donor.number}</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Sex:</h3>
                            <p>{donor.sex}</p>
                        </div>

                        <div className= "h-[0.5in] flex flex-col text-[18px]">
                            <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Blood type:</h3>
                            <p>{donor.bloodType}</p>
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
