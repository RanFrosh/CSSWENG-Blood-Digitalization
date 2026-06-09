"use client"
import { supabase } from "@/db/supa";
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

                    </div>

                </div>

                {/* Main Panel */}
                <div className = "h-full w-[15in] bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in]">

                    <h1 className = "inline bg-[#c15555] text-[56px] text-[#f9fdff] p-[0.25in]">Donor Search</h1>

                    <div className = "flex flex-col gap-[0.5in]">

                        <div className = "flex flex-row gap-[0.5in]">

                            <div className = "relative w-[5in] ">

                                <img className = "absolute h-[0.25in] left-[0.125in] top-[7.5px]" src = "/images/search.png" />

                                <input type = "text" className = "w-[5in] text-[30px] pl-[0.5in] border-2 border-gray-300" placeholder="Input donor name"/>
                            </div>

                            <button className = "w-[1in] bg-[#8a2d2d] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline">Search</button>

                        </div>

                        <div className = "flex flex-col gap-[15px]">

                            <div className = "flex flex-row justify-between h-[1.5in]">

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]" id="donor" onClick={viewDonor}>

                                    <div className = "h-[1in] pl-[0.125in] pt-[0.125in] flex">
                                        <img src = "/images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center gap-[7.5px]">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px]">John Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">john_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className="h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    
                                    <div className="h-[1in] pl-[0.125in] pt-[0.125in] flex">
                                        <img src="/images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center gap-[7.5px]">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px]">Janet Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">janet_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className="h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    
                                    <div className="h-[1in] pl-[0.125in] pt-[0.125in] flex">
                                        <img src="/images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center gap-[7.5px]">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px]">Jeanne Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">jeanne_doe@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className = "flex flex-row justify-between h-[1.5in]">

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    <div className = "h-[1in] pl-[0.125in] pt-[0.125in] flex">
                                        <img src = "/images/user.png"/>
                                    </div>

                                    <div className = "flex flex-col justify-center gap-[7.5px]">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px]">Julian Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">julian_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">

                                    <div className = "h-[1in] pl-[0.125in] pt-[0.125in] flex">
                                        <img src = "/images/user.png"/>
                                    </div>

                                    <div className = "flex flex-col justify-center gap-[7.5px]">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px]">Jonah Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">jonah_doe@gmail.com</p>
                                    </div>
                                </div>

                                <div className = "h-[1.25in] w-[4.5in] bg-[#c15555] rounded-[20px] flex flex-row gap-[0.25in] transition-transform duration-200 hover:scale-[1.0625]">
                                    <div className="h-[1in] pl-[0.125in] pt-[0.125in] flex">
                                        <img src="../images/user.png"/>
                                    </div>

                                    <div className="flex flex-col justify-center gap-[7.5px]">
                                        <h3 className = "font-bold text-[#f9fdff] text-[28px]">Janice Doe</h3>
                                        <p className = "text-[#f9fdff] text-[21px]">janice_doe@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

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
