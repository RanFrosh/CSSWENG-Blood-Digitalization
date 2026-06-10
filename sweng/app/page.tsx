"use client"
import { supabase } from "@/db/supa";
import { useRouter } from "next/navigation";   

import Header from "@/components/Header";

export default function Home() {
  
    const router = useRouter();

    // To be replaced once Supabase is set up
    const handleLogin = () => {

        const view = prompt("Type 1 for admin, 2 for int. staff, 3 for RB director.")

        if (view === "1") { 
            router.push("/log"); // Replaces log.html
        } else if (view === "2") { 
            router.push("/search");  // Replaces search.html
        } else if (view === "3") { 
            router.push("/analytics");        // Replaces analytics.html
        }
    }

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

                    <h1 className = "text-[42px] font-['Montserrat'] mt-[0.25in] text-[#1b4054]">
                        Welcome!
                    </h1>

                    <div className = "text-[18px] flex flex-col">

                        <label className = "mb-[5px]" htmlFor = "uname">Username:</label>

                        <input 
                            type = "text" 
                            className = "w-full mb-[15px] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] pr-[10px]"
                        />

                        <label className = "mb-[5px]" htmlFor = "pass">Password:</label>
                        
                        <input 
                            type = "password" 
                            className = "w-full border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] pr-[10px]"
                        />

                        <div className = "text-[12px] text-[#1b4054] w-full text-end">
                            <p className = "inline hover:underline cursor-pointer text-[#1b4054]">Forgot password?</p>
                        </div>

                    </div>

                    <div className = "w-[3in] flex flex-row gap-[0.25in]">

                        <button 
                            className = "w-[1in] bg-[#1b4054] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline" 
                            onClick = {handleLogin}
                        >
                            Log in
                        </button>

                        <button 
                            className = "w-[1in] bg-[#1b4054] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline"
                        >
                            Sign up &#8594;
                        </button>
                    </div>

                </div>

                {/* Main Panel */}
                <div className = "flex-1 bg-[#c15555] p-[0.5in] flex flex-row gap-[0.5in]">

                    <div className = "flex-1 flex flex-col gap-[0.5in]">
                        
                        <div className = "header">

                            <h1 className = "text-[#f9fdff] text-[56px] font-['Montserrat'] font-semibold">A small act, 
                                <br />
                                a lifesaving impact.
                            </h1>

                        </div>

                        {/* Event List */}
                        <div className = "flex-1 flex flex-col gap-[15px]">

                            <div className = "h-[1.25in] p-[0.25in] bg-[#f9fdff] flex flex-row gap-[0.25in] items-center">

                                <img 
                                    className="h-[1in] w-[1in] rounded-md"
                                    src="/images/event.png" 
                                />
                                
                                <div className = "flex flex-col gap-[0.125in]">

                                    <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Event title</h3>

                                    <p className = "text-justify">
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Learn more."
                                    </p>
                                
                                </div>

                            </div>

                            <div className = "h-[1.25in] p-[0.25in] bg-[#f9fdff] flex flex-row gap-[0.25in] items-center">
                                
                                <img 
                                    className="h-[1in] w-[1in] rounded-md"
                                    src="/images/event.png" 
                                />
                                
                                <div className = "flex flex-col gap-[0.125in]">

                                    <h3 className = "font-bold font-['Montserrat'] text-[#1b4054]">Event title</h3>

                                    <p className = "text-justify">
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Learn more."
                                    </p>
                                
                                </div>

                            </div>
                            
                        </div>

                        {/* Carousel */}
                        <div className = "flex-1 -mt-[0.65in] flex justify-center">
                            
                            <img 
                                className = "h-[1in]"
                                src = "/images/carousel.png" 
                            />

                        </div>

                    </div>

                    <div className = "w-[4in] overflow-hidden">
                        
                        <img 
                            className = "h-full w-full object-cover"
                            src = "/images/blood.png" 
                        />

                    </div>

                </div>

            </div>

            {/* Footer */}
                <div className = "bg-[#1b4054] h-[0.75in] shrink-0">
                    
                    <div className = "p-[0.125in] text-center text-[#f9fdff]">
                        <p>additional text info like copyright etc</p>
                    </div>

                </div>

        </main>
    );
}
