"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/HeaderLanding";
import { executeLogin } from "../login/login_action";

export type LandingEvent = {
    id: string;
    title: string;
    details: string;
    image: string;
};

const fallbackEvent: LandingEvent = {
    id: "fallback-1",
    title: "Welcome!",
    details: "Log in to view upcoming events and manage operations.",
    image: "/images/event.png",
};

export default function LandingClient({ initialEvents }: { initialEvents: LandingEvent[] }) {
    
    const router = useRouter();

    const displayEvents = initialEvents.length > 0 ? initialEvents : [fallbackEvent];

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentEvent = displayEvents[currentIndex];

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        setErrorMessage("");

        const result = await executeLogin(email, password);

        if (!result.success || !result.data) {
            setErrorMessage("Invalid Login Credentials.");
            setIsLoading(false);
            return;
        }

        const role = result.data.role;

        switch (role) {
            case "onsite_admin": router.push("/oa/events"); break;
            case "med_prof": router.push("/mp/events"); break;
            case "lab_staff": router.push("/ls/events"); break;
            case "recov_staff": router.push("/rs/events"); break;
            case "director": router.push("/rbd/analytics"); break;
            case "super_admin": router.push("/sa/management"); break;
            default:
                setErrorMessage("Unauthorized role detected.");
                setIsLoading(false);
        }
    };

    const goToPrevious = () => {
        setCurrentIndex(currentIndex === 0 ? displayEvents.length - 1 : currentIndex - 1);
    };

    const goToNext = () => {
        setCurrentIndex(currentIndex === displayEvents.length - 1 ? 0 : currentIndex + 1);
    };

    const getIndicatorClass = (index: number) => {
        return `h-[14px] w-[14px] rounded-full border-2 border-white cursor-pointer transition ${
            currentIndex === index ? "bg-white" : "bg-transparent"
        }`;
    };

    useEffect(() => {
        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, displayEvents.length]);

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 flex flex-row">
                <div className="w-[5in] shrink-0 bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in] justify-center">
                    <h1 className="text-[42px] font-['Montserrat'] font-semibold text-[#1b4054]">
                        Welcome!
                    </h1>

                    <div className="text-[21px] flex flex-col">
                        {errorMessage && (
                            <div className="mb-4 p-2 text-sm text-white bg-red-500 rounded text-center">
                                {errorMessage}
                            </div>
                        )}

                        <label className="mb-[5px]" htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-[15px] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] pr-[10px] outline-none"
                        />

                        <label className="mb-[5px]" htmlFor="pass">Password:</label>
                        <input
                            id="pass"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] pr-[10px] outline-none"
                        />

                        <div className="text-[12px] text-[#1b4054] w-full text-end">
                            <p className="inline hover:underline cursor-pointer text-[#1b4054]">
                                Forgot password?
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-row gap-[0.25in] ml-auto">
                        <button
                            className="w-[1in] bg-[#1b4054] text-[#f9fdff] p-[5px] rounded-[10px] text-center cursor-pointer hover:bg-[#fd5448] transition"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? "..." : "Log in"}
                        </button>

                        <button 
                            className="w-[1in] bg-[#f9fdff] text-[#1b4054] p-[5px] rounded-[10px] text-center border-2 border-[#1b4054] cursor-pointer hover:bg-[#fd5448] hover:text-[#f9fdff] hover:border-[#fd5448] transition"
                            onClick={() => router.push("/signup")}
                        >
                            Sign up
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#1b4054]">
                        
                        <img
                            src={currentEvent.image}
                            alt={currentEvent.title}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-black/55"></div>

                        <div className="absolute right-[0.8in] bottom-[1.1in] z-20 max-w-[5in] text-white text-center animate-in slide-in-from-right-4 fade-in duration-500">
                            <h2 className="text-[72px] leading-none font-bold font-['Montserrat'] drop-shadow-lg">
                                {currentEvent.title}
                            </h2>
                            <p className="mt-[0.25in] text-[22px] leading-snug drop-shadow-md line-clamp-3">
                                {currentEvent.details}
                            </p>
                        </div>

                        {displayEvents.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-[0.35in] top-1/2 z-30 -translate-y-1/2 text-white text-[52px] cursor-pointer hover:scale-110 transition-transform"
                                >
                                    ‹
                                </button>

                                <button
                                    onClick={goToNext}
                                    className="absolute right-[0.35in] top-1/2 z-30 -translate-y-1/2 text-white text-[52px] cursor-pointer hover:scale-110 transition-transform"
                                >
                                    ›
                                </button>

                                <div className="absolute bottom-[0.55in] left-1/2 z-30 flex -translate-x-1/2 gap-[8px]">
                                    {displayEvents.map((event, index) => (
                                        <button
                                            key={event.id}
                                            onClick={() => setCurrentIndex(index)}
                                            className={getIndicatorClass(index)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}