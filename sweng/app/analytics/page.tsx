"use client"
import { supabase } from "@/db/supa";
import { useRouter } from "next/navigation";    
import Link from "next/link";    

import Header from "@/components/Header";

export default function AnalyticsPage() {
  
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

                {/* Margin */}
                <div className = "w-[1in] shrink-0 bg-[#c15555]"></div>

                {/* Left Panel */}
                <div className = "w-[3.25in] shrink-0 bg-[#f9fdff] p-[0.25in] flex flex-col gap-[0.5in]">

                    <h1 className = "text-[42px] font-normal mt-[0.25in] font-['Montserrat'] text-[#1b4054]">
                        Set Filters:
                    </h1>

                    <div className = "flex flex-col gap-[0.5in]">

                        <div className = "flex flex-col gap-[0.125in]">
                            
                            <h3 className = "text-[24px] font-semibold font-['Montserrat'] text-[#1b4054]">Date filters</h3>

                            <div className = "flex flex-row text-[18px] items-center gap-[0.125in]">
                                <label htmlFor = "sdate" className = "w-[1in]">Start date:</label>
                                <input type = "date" className = "border-2 border-gray-300 focus:border-[#1b4054]"/>
                            </div> 

                            <div className = "flex flex-row text-[18px] items-center gap-[0.125in]">
                                <label htmlFor = "edate" className = "w-[1in]">End date:</label>
                                <input type = "date" className = "border-2 border-gray-300 focus:border-[#1b4054]"/>
                            </div>

                        </div>

                    </div>

                    <div className = "flex flex-col gap-[0.125in]">

                        <h3 className = "text-[24px] font-semibold font-['Montserrat'] text-[#1b4054]">Other filters</h3>

                        <div className = "h-[0.25in] flex flex-row text-[18px] items-center gap-[0.25in]">

                            <label htmlFor = "fil1">Filter 1:</label>

                            <select name = "fil1" className = "border-2 border-gray-300 focus:border-[#1b4054]">
                                <option value = "1">Option 1</option>
                                <option value = "2">Option 2</option>
                                <option value = "3">Option 3</option>
                            </select>

                        </div>

                        <div className = "h-[0.25in] flex flex-row text-[18px] items-center gap-[0.25in]">
                            
                            <label htmlFor = "fil2">Filter 2:</label>
                            
                            <select name = "fil2" className = "border-2 border-gray-300 focus:border-[#1b4054]">
                                <option value = "1">Option 1</option>
                                <option value = "2">Option 2</option>
                                <option value = "3">Option 3</option>
                            </select>

                        </div>
                    </div>

                </div>

                {/* Main Panel */}
                <div className = "bg-[#c15555] p-[0.5in] pr-[0.25in] flex flex-row gap-[0.5in]">

                    <div className = "flex flex-col mr-[0.25in] gap-[0.25in]">
                        
                        <h1 className = "text-[56px] mt-[-0.25in] mb-[-0.125in] text-[#f9fdff] font-['Montserrat'] font-semibold">Numerical Data</h1>

                        {/* Numerical Data */}
                        <div className = "flex flex-row justify-between gap-[0.25in]">

                            <div className = "w-[3.5in] flex flex-col gap-[0.125in] bg-[#f9fdff] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[21px] font-semibold font-['Montserrat'] text-[#1b4054]">Total Onsite Visitors:</h3>
                                    <p>100</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col gap-[0.125in] bg-[#f9fdff] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[21px] font-semibold font-['Montserrat'] text-[#1b4054]">Successful Extractions:</h3>
                                    <p>75</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col gap-[0.125in] bg-[#f9fdff] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] gap-[0.125in] items-center">
                                    <h3 className="text-[21px] font-semibold font-['Montserrat'] text-[#1b4054]">Verified Safe Bags:</h3>
                                    <p>50</p>
                                </div>
                            </div>

                        </div>

                        {/* Graphical Data */}
                        <h1 className = "text-[56px] mb-[-0.125in] text-[#f9fdff] font-['Montserrat'] font-semibold">Graphical Data</h1>

                        <div className = "flex flex-row justify-between">

                            <div className = "w-[5.25in] flex flex-col bg-[#1b4054] rounded-[20px] gap-[0.125in] p-[0.25in]">

                                <h3 className = "text-[#f9fdff] font-semibold font-['Montserrat'] text-[24px]">Blood Type Breakdown</h3>

                                <div className = "flex flex-row items-center gap-[0.25in]">
                                    <img src = "/images/pie.png" alt="Placeholder Pie Chart" className = "w-[2in] h-[2in] object-contain"/>

                                    <p className = "text-[18px] text-[#f9fdff]">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    </p>
                                </div>

                            </div>

                            <div className = "w-[5.25in] flex flex-col bg-[#1b4054] rounded-[20px] gap-[0.125in] p-[0.25in]">

                                <h3 className = "text-[#f9fdff] font-semibold font-['Montserrat'] text-[24px]">Historical Event Logs</h3>
                                
                                <div className = "flex flex-row items-center gap-[0.25in]">
                                    <img src = "/images/table.png" alt="Placeholder Table" className = "w-[2in] h-[2in] object-contain"/>

                                    <p className = "text-[18px] text-[#f9fdff]">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    </p>
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
