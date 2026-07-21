"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchDirectorEvents } from "../rbd_action";
import { ViewEvents } from "@/types/event_type";
import Header from "@/components/HeaderRBD";
import { EventCard } from "@/components/EventCard";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";
type EventTab = EventStatus | "All";

export default function SearchEventsPage() {

    const router = useRouter();
    
    // Set the initial active tab to "Ongoing"
    const [activeTab, setActiveTab] = useState<EventTab>("Ongoing");
    
    // State for holding events from the backend
    const [events, setEvents] = useState<ViewEvents[]>([]);

    // Loading State
    const [isLoading, setIsLoading] = useState(true);

    // Error display
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const result = await fetchDirectorEvents(activeTab);

                if (result.success && result.data) {
                    setEvents(result.data);
                } else {
                    setErrorMessage(result.message || "Failed to load events.");
                }
            } catch (error) {
                setErrorMessage("Failed to connect to the database");
            } finally {
                setIsLoading(false); 
            }
        }
        
        loadEvents();
    }, [activeTab]);

    const viewEventAnalytics = (eventId: BigInt) => {
        router.push(`/rbd/analytics/events/${eventId}`);
    };

    // Create button to open event if it is ongoing
    const createActionButton = (event: ViewEvents) => {

        if (event.status === "Ongoing" || event.status === "Completed") {
            return (
                <button
                    onClick={() => viewEventAnalytics(event.id)}
                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] transition hover:bg-gray-200 cursor-pointer"
                >
                    View Event
                </button>
            );
        } 
        
        return null;
    };

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading Events...</p>
                </div>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">

                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">{errorMessage}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in] flex flex-col gap-[0.35in]">
                {/* Header Section */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Red Bank Director
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Search
                    </h1>
                </section>

                {/* Filter and Search Bar */}
                <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Filters
                    </h2>

                    <div className="mt-5 flex flex-row items-end gap-5">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Search by
                            </label>

                            <input
                                type="text"
                                placeholder="Input event name or partner"
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>

                        <div className="w-[2in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sort By
                            </label>

                            <select className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white">
                                <option>Default</option>
                                <option>Date</option>
                                <option>Partner</option>
                                <option>Status</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Event Results Section */}
                <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Events
                        </h2>

                        <p className="text-[18px] text-[#002940]">
                            Showing {events.length} event/s
                        </p>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {events.map((event) => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                actionButton={createActionButton(event)} 
                            />
                        ))}

                        {events.length === 0 && !isLoading && (
                            <div className="p-8 text-center text-gray-500 italic border-2 border-dashed border-gray-300 rounded-[16px]">
                                No events found.
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex flex-row items-center justify-between gap-5">
                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940]">
                            Page 1
                        </p>

                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}