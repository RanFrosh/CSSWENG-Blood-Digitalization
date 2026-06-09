"use client"
import { supabase } from "@/db/supa";
import { useRouter } from "next/navigation";                

export default function Home() {
  
    const router = useRouter();

    // To be replaced once Supabase is set up
    const handleLogin = () => {

        const view = prompt("Type 1 for admin, 2 for int. staff, 3 for RB director.")

        if (view === "1") { 
            router.push("/staff/interview"); // Replaces log.html
        } else if (view === "2") { 
            router.push("/staff/check-in");  // Replaces search.html
        } else if (view === "3") { 
            router.push("/director");        // Replaces analytics.html
        }
    }

    return (

        <main className = "flex flex-col min-h-screen bg-[#f9fdff] text-black">

            {/* Header */}
            <div className = "h-[0.75in] border-b-[5px] border-b-[#c15555]">

                <div className = "p-[0.125in] gap-[0.25in] flex flex-row items-center">

                    <img 
                        className = "h-[0.5in]" 
                        src = "/images/logo.png" 
                    />

                    <div className = "text-[30px] text-[#8a2d2d] hover:underline">
                        <h1>Red Bank Foundation</h1>
                    </div>

                </div>

            </div>

            {/* Main Content */}
            <div className = "flex-1 bg-[#c15555] flex flex-row">

                <div className = "w-[1in] bg-[#c15555]"></div>

                {/* Left Panel */}
                <div className = "w-[3.25in] bg-[#f9fdff] p-[0.25in] flex flex-col gap-[0.5in]">

                    <h1 className = "text-[42px] font-normal mt-[0.25in]">
                        Welcome!
                    </h1>

                    <div className = "text-[18px] flex flex-col">

                        <label className = "mb-[5px]" htmlFor = "uname">Username:</label>

                        <input 
                            type = "text" 
                            className = "w-full mb-[15px] border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"
                        />

                        <label className = "mb-[5px]" htmlFor = "pass">Password:</label>
                        
                        <input 
                            type = "password" 
                            className = "w-full border-2 border-gray-300 rounded-md focus:border-[#8a2d2d]"
                        />

                        <div className = "text-[12px] text-[#8a2d2d] w-full text-end">
                            <p className = "inline hover:underline cursor-pointer">Forgot password?</p>
                        </div>

                    </div>

                    <div className = "w-[3in] flex flex-row gap-[0.25in]">

                        <button 
                            className = "w-[1in] bg-[#8a2d2d] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline" 
                            onClick = {handleLogin}
                        >
                            Log in
                        </button>

                        <button 
                            className = "w-[1in] bg-[#8a2d2d] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:underline"
                            onClick = {() => router.push('/register')}
                        >
                            Sign up &#8594;
                        </button>
                    </div>

                </div>

                {/* Main Panel */}
                <div className = "flex-1 bg-[#c15555] p-[0.75in] pr-[0.25in] flex flex-row gap-[0.5in]">

                    <div className = "w-[8.5in] flex flex-col gap-[0.5in]">
                        
                        <div className = "header">

                            <h1 className = "text-[#f9fdff] text-[56px]">A small act, 
                                <br />
                                a lifesaving impact.
                            </h1>

                        </div>

                        {/* Event List */}
                        <div className = "w-[8in] flex flex-col gap-[15px]">

                            <div className = "h-[1in] p-[0.25in] bg-[#f9fdff] flex flex-row gap-[0.25in] items-center">

                                <img 
                                    className="h-[1in] w-[1in] rounded-md"
                                    src="/images/event.png" 
                                />
                                
                                <div className = "flex flex-col gap-[0.125in]">

                                    <h3 className = "font-bold">Event title</h3>

                                    <p className = "text-justify">
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Learn more."
                                    </p>
                                
                                </div>

                            </div>

                            <div className = "h-[1in] p-[0.25in] bg-[#f9fdff] flex flex-row gap-[0.25in] items-center">
                                
                                <img 
                                    className="h-[1in] w-[1in] rounded-md"
                                    src="/images/event.png" 
                                />
                                
                                <div className = "flex flex-col gap-[0.125in]">

                                    <h3 className = "font-bold">Event title</h3>

                                    <p className = "text-justify">
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Learn more."
                                    </p>
                                
                                </div>

                            </div>
                            
                        </div>

                        {/* Carousel */}
                        <div className = "w-[8in] -mt-[0.5in] flex justify-center">
                            
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
            <div className = "border-t-[5px] border-[#c15555] bg-[#8a2d2d] flex-1">
                
                <div className = "p-[0.125in] text-center text-[#f9fdff]">
                    <p>additional text info like copyright etc</p>
                </div>

            </div>

        </main>
    );
}
