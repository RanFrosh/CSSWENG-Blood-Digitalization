"use client"
import { useRouter } from "next/navigation";    
import Link from "next/link";    

import Header from "@/components/Header";
import DonorCard from "@/components/DonorCard";

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

                </div>

                {/* Main Panel */}
                <div className = "w-[15in] bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in]">

                    <h1 className = "inline bg-[#c15555] text-[56px] text-[#f9fdff] p-[0.25in] font-['Montserrat'] font-semibold">Donor Search</h1>

                    <div className = "flex flex-col gap-[0.5in]">

                        <div className = "flex flex-row gap-[0.5in]">

                            <div className = "relative w-[5in] ">

                                <img className = "absolute h-[0.25in] left-[0.125in] top-[0.125in]" src = "/images/search.png" />

                                <input type = "text" className = "w-[5in] text-[30px] pl-[0.5in] border-2 border-gray-300" placeholder="Input donor info"/>
                            </div>

                            <select className="w-[1.75in] text-[20px] px-[0.125in] border-2 border-gray-300 bg-[#f9fdff] rounded-md">
                                <option value="">Sex</option>
                                <option value="option1">Male</option>
                                <option value="option2">Female</option>
                            </select>

                            <select className="w-[1.75in] text-[20px] px-[0.125in] border-2 border-gray-300 bg-[#f9fdff] rounded-md">
                                <option value="">Blood Type</option>
                                <option value="option1">A+</option>
                                <option value="option2">A-</option>
                                <option value="option3">B+</option>
                                <option value="option4">B-</option>
                                <option value="option5">AB+</option>
                                <option value="option6">AB-</option>
                                <option value="option7">O+</option>
                                <option value="option8">O-</option>
                            </select>

                            <button className = "w-[1.25in] bg-[#1b4054] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline text-[24px]">Search</button>

                        </div>

                        <div className="grid grid-cols-3 gap-x-[0.25in] gap-y-[0.25in] -mb-[0.125in]">
                            {/* add the donor cards here */}
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
