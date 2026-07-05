"use client"

import { useRouter } from "next/navigation";    
import Link from "next/link";    

import Header from "@/components/Header";

export default function SearchPage() {
  
    const router = useRouter();

    const goHome = () => {
        router.push('/'); 
    };

    const viewDonor = () => {
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

                    </div>

                </div>

                {/* Main Panel */}
                <div className = "w-[15in] bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in]">

                    <h1 className = "inline bg-[#c15555] text-[56px] text-[#f9fdff] p-[0.25in] font-['Montserrat'] font-semibold">Donor Search</h1>

                    <div className = "flex flex-col gap-[0.5in]">

                        <div className = "flex flex-row gap-[0.5in]">

                            <div className = "relative w-[5in] ">

                                <img className = "absolute h-[0.25in] left-[0.125in] top-[0.125in]" src = "/images/search.png" />

                                <input type = "text" className = "w-[5in] text-[30px] pl-[0.5in] border-2 border-gray-300" placeholder="Input donor name"/>
                            </div>

                            <button className = "w-[1.25in] bg-[#1b4054] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline text-[24px]">Search</button>

                        </div>

                        <div className = "flex flex-col gap-[10px] -mb-[0.125in]">

                            <div className = "flex flex-row justify-between h-[1.5in]">

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]" id="donor" onClick={viewDonor}>

                                    <div className = "h-[1in] pl-[0.125in] pt-[0.25in] flex">
                                        <img src = "/images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px] font-['Montserrat']">John Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">john_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className="h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    
                                    <div className="h-[1in] pl-[0.125in] pt-[0.25in] flex">
                                        <img src="/images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px] font-['Montserrat']">Janet Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">janet_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className="h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    
                                    <div className="h-[1in] pl-[0.125in] pt-[0.25in] flex">
                                        <img src="/images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px] font-['Montserrat']">Jeanne Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">jeanne_doe@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className = "flex flex-row justify-between h-[1.5in]">

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    <div className = "h-[1in] pl-[0.125in] pt-[0.25in] flex">
                                        <img src = "/images/user.png"/>
                                    </div>

                                    <div className = "flex flex-col justify-center">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px] font-['Montserrat']">Julian Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">julian_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">

                                    <div className = "h-[1in] pl-[0.125in] pt-[0.25in] flex">
                                        <img src = "/images/user.png"/>
                                    </div>

                                    <div className = "flex flex-col justify-center">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px] font-['Montserrat']">Jonah Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">jonah_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    <div className="h-[1in] pl-[0.125in] pt-[0.25in] flex">
                                        <img src="../images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px] font-['Montserrat']">Janice Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">janice_doe@gmail.com</p>
                                    </div>
                                </div>
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
