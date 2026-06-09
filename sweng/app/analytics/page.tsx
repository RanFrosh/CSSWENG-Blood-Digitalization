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

                <div className = "w-[1in] bg-[#c15555]"></div>

                {/* Left Panel */}
                <div className = "w-[3.25in] bg-[#f9fdff] p-[0.25in] flex flex-col gap-[0.5in]">

                    <h1 className = "text-[42px] font-normal mt-[0.25in]">
                        Set Filters:
                    </h1>

                    <div className = "flex flex-col gap-[0.5in]">

                        <div className = "flex flex-col gap-[0.125in]">
                            
                            <h3 className = "text-[24px] font-bold">Date filters</h3>

                            <div className = "flex flex-row text-[21px] items-center gap-[0.125in]">
                                <label htmlFor = "sdate">Start date:</label>
                                <input type = "date" className = "border-2 border-gray-300 focus:border-[#8a2d2d]"/>
                            </div> 

                            <div className = "flex flex-row text-[21px] items-center gap-[0.125in]">
                                <label htmlFor = "edate">End date:</label>
                                <input type = "date" className = "border-2 border-gray-300 focus:border-[#8a2d2d]"/>
                            </div>

                        </div>

                    </div>

                    <div className = "flex flex-col gap-[0.125in]">

                        <h3 className = "text-[24px]">Other filters</h3>

                        <div className = "h-[0.25in] flex flex-row text-[21px] items-center gap-[0.125in]">

                            <label htmlFor = "fil1">Filter 1:</label>

                            <select name = "fil1" className = "border-2 border-gray-300 focus:border-[#8a2d2d]">
                                <option value = "1">Option 1</option>
                                <option value = "2">Option 2</option>
                                <option value = "3">Option 3</option>
                            </select>

                        </div>

                        <div className = "h-[0.25in] flex flex-row text-[21px] items-center gap-[0.125in]">
                            
                            <label htmlFor = "fil2">Filter 2:</label>
                            
                            <select name = "fil2" className = "border-2 border-gray-300 focus:border-[#8a2d2d]">
                                <option value = "1">Option 1</option>
                                <option value = "2">Option 2</option>
                                <option value = "3">Option 3</option>
                            </select>

                        </div>
                    </div>

                </div>

                {/* Main Panel */}
                <div className = "flex-1 bg-[#c15555] p-[0.75in] pr-[0.25in] flex flex-row gap-[0.5in]">

                    <div className = "flex flex-1 flex-col mr-[0.25in] gap-[0.75in]">
                        
                        <h1 className = "text-[56px] mb-[-0.5in] text-[#f9fdff]">Numerical Data</h1>

                        <div className = "flex flex-row justify-between">

                            <div className = "w-[3.5in] flex flex-col bg-[#8a2d2d] gap-[0.125in] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Total Onsite Visitors:</h3>
                                    <p>100</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col bg-[#8a2d2d] gap-[0.125in] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Successful Extractions:</h3>
                                    <p>75</p>
                                </div>
                            </div>

                            <div className = "w-[3.5in] flex flex-col bg-[#8a2d2d] gap-[0.125in] p-[0.25in]">
                                <div className = "flex flex-row text-[21px] text-[#f9fdff] gap-[0.125in] items-center">
                                    <h3>Verified Safe Bags:</h3>
                                    <p>50</p>
                                </div>
                            </div>

                        </div>

                        {/* Graphical Data */}
                        <h1 className = "text-[56px] mb-[-0.5in] text-[#f9fdff]">Graphical Data</h1>

                        <div className = "flex flex-row justify-between">

                            <div className = "w-[6in] flex flex-col bg-[#8a2d2d] rounded-[20px] gap-[0.125in] p-[0.25in]">

                                <h3 className = "text-[30px] text-[#f9fdff]">Blood Type Breakdown</h3>

                                <div className = "flex flex-row items-center gap-[0.5in]">
                                    <img src = "/images/pie.png" alt="Placeholder Pie Chart" className = "w-[3.5in] h-[3.5in] object-contain"/>

                                    <p className = "text-[21px] text-[#f9fdff]">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    </p>
                                </div>

                            </div>

                            <div className = "w-[6in] flex flex-col bg-[#8a2d2d] rounded-[20px] gap-[0.125in] p-[0.25in]">

                                <h3 className = "text-[30px] text-[#f9fdff]">Historical Event Logs</h3>
                                
                                <div className = "flex flex-row items-center gap-[0.5in]">
                                    <img src = "/images/table.png" alt="Placeholder Table" className = "w-[3.5in] h-[3.5in] object-contain"/>

                                    <p className = "text-[21px] text-[#f9fdff]">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    </p>
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
