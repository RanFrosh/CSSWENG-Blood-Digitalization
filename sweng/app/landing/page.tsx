"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderLanding";

type LandingEvent = {
    id: string;
    title: string;
    details: string;
    image: string;
    copyright?: string;
};

const events: LandingEvent[] = [
    {
        id: "1",
        title: "Event 1",
        details:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a venenatis metus. Suspendisse ac pretium dui.",
        image: "/images/event.png",
        copyright: "copyright for event 1",
    },
    {
        id: "2",
        title: "Event 2",
        details:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a venenatis metus. Suspendisse ac pretium dui.",
        image: "/images/event.png",
        copyright: "copyright for event 2",
    },
    {
        id: "3",
        title: "Event 3",
        details:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a venenatis metus. Suspendisse ac pretium dui.",
        image: "/images/event.png",
        copyright: "copyright for event 3",
    },
];

export default function Home() {
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);

    const currentEvent = events[currentIndex];

    const handleLogin = () => {
        const view = prompt("Type 1 for OA/Registration, 2 for MP/Nurse, 3 for Lab, 4 for Recovery, 5 for RBD, 6 for SA.");

        if (view === "1") {
            router.push("/oa/events");
        } else if (view === "2") {
            router.push("/mp/events");
        } else if (view === "3") {
            router.push("/ls/events");
        } else if (view === "4") {
            router.push("/rs/events")
        }else if (view === "5") {
            router.push("/rbd/analytics");
        } else if (view === "6") {
            router.push("/sa/list");
        }
    };

    const goToPrevious = () => {
        if (currentIndex === 0) {
            setCurrentIndex(events.length - 1);
        } else {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex === events.length - 1) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const getIndicatorClass = (index: number) => {
        let className =
            "h-[14px] w-[14px] rounded-full border-2 border-white cursor-pointer transition ";

        if (currentIndex === index) {
            className += "bg-white";
        } else {
            className += "bg-transparent";
        }

        return className;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex === events.length - 1) {
                    return 0;
                } else {
                    return prevIndex + 1;
                }
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff]">
            <Header />

            <div className="flex-1 flex flex-row">
                {/* Left Panel */}
                <div className="w-[5in] shrink-0 bg-[#f9fdff] p-[0.5in] flex flex-col gap-[0.5in] justify-center">
                    <h1 className="text-[42px] font-['Montserrat'] font-semibold text-[#1b4054]">
                        Welcome!
                    </h1>

                    <div className="text-[21px] flex flex-col">
                        <label className="mb-[5px]" htmlFor="uname">
                            Username:
                        </label>

                        <input
                            id="uname"
                            type="text"
                            className="w-full mb-[15px] border-2 border-gray-300 rounded-md focus:border-[#1b4054] pl-[10px] pr-[10px] outline-none"
                        />

                        <label className="mb-[5px]" htmlFor="pass">
                            Password:
                        </label>

                        <input
                            id="pass"
                            type="password"
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
                        >
                            Log in
                        </button>

                        <button className="w-[1in] bg-[#f9fdff] text-[#1b4054] p-[5px] rounded-[10px] text-center border-2 border-[#1b4054] cursor-pointer hover:bg-[#fd5448] hover:text-[#f9fdff] hover:border-[#fd5448] transition">
                            Sign up
                        </button>
                    </div>
                </div>

                {/* Main Panel */}
                <div className="flex-1">
                    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-gray-200">
                        {/* Background Image */}
                        <img
                            src={currentEvent.image}
                            alt={currentEvent.title}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                        />

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/55"></div>

                        {/* Event Text */}
                        <div className="absolute right-[0.8in] bottom-[1.1in] z-20 max-w-[5in] text-white text-center">
                            <h2 className="text-[72px] leading-none font-bold font-['Montserrat'] drop-shadow-lg">
                                {currentEvent.title}
                            </h2>

                            <p className="mt-[0.25in] text-[22px] leading-snug drop-shadow-md">
                                {currentEvent.details}
                            </p>
                        </div>

                        {/* Previous Button */}
                        <button
                            type="button"
                            onClick={goToPrevious}
                            className="absolute left-[0.35in] top-1/2 z-30 -translate-y-1/2 text-white text-[52px] cursor-pointer hover:scale-110 transition-transform"
                        >
                            ‹
                        </button>

                        {/* Next Button */}
                        <button
                            type="button"
                            onClick={goToNext}
                            className="absolute right-[0.35in] top-1/2 z-30 -translate-y-1/2 text-white text-[52px] cursor-pointer hover:scale-110 transition-transform"
                        >
                            ›
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-[0.55in] left-1/2 z-30 flex -translate-x-1/2 gap-[8px]">
                            {events.map((event, index) => (
                                <button
                                    key={event.id}
                                    type="button"
                                    onClick={() => setCurrentIndex(index)}
                                    className={getIndicatorClass(index)}
                                ></button>
                            ))}
                        </div>

                        {/* Copyright Placeholder */}
                        <p className="absolute bottom-[0.25in] left-1/2 z-30 -translate-x-1/2 text-white text-[12px]">
                            {currentEvent.copyright}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}