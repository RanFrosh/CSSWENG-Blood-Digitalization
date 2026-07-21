"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchFilteredEvents } from "../rbd_action";
import { ViewEvents } from "@/types/event_type";
import Header from "@/components/HeaderRBD";
import { EventCard } from "@/components/EventCard";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";
type EventTab = EventStatus | "All";

export default function SearchEventsPage() {

    const router = useRouter();
    
    // Set the initial active tab to "Ongoing"
    const [activeTab, setActiveTab] = useState<EventTab>("All");

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Default");
    
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
                const result = await fetchFilteredEvents(activeTab, searchTerm, sortBy);

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

        const delayDebounceFn = setTimeout(() => {
            loadEvents();
        }, 300);
        
        return () => clearTimeout(delayDebounceFn);

    }, [activeTab, searchTerm, sortBy]);

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

                <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">

                    {/* Header & Status Tabs */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Directory
                        </h2>

                        <div className="flex flex-row flex-wrap gap-2">
                            {["All", "Ongoing", "Completed"].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab as EventTab)}
                                    className={`px-6 py-2 rounded-full font-semibold border-2 transition-colors cursor-pointer ${
                                        activeTab === tab
                                            ? "bg-[#002940] text-white border-[#002940]"
                                            : "bg-[#f9fdff] text-[#002940] border-[#c0cad0] hover:bg-gray-200"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search and Sort */}
                    <div className="mt-6 bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-row items-end gap-5 flex-wrap">
                        <div className="flex-1 flex flex-col gap-2 min-w-[250px]">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Search by
                            </label>
                            
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Input event name or partner..."
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] transition-colors bg-white"
                            />
                        </div>

                        <div className="w-full md:w-[2in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sort By
                            </label>
                            
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                            >
                                <option value="Default">Default</option>
                                <option value="Date">Date</option>
                                <option value="Partner">Partner</option>
                                <option value="Status">Status</option>
                            </select>
                        </div>
                    </div>

                    {/* Divider & Result Count */}
                    <div className="mt-8 flex flex-row items-center justify-between border-b-2 border-[#c0cad0] pb-4">
                        <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Results
                        </h3>
                        
                        <span className="bg-[#e2e8ec] text-[#002940] px-4 py-1 rounded-full text-[16px] font-semibold">
                            Showing {events.length} {events.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>

                    {/* Events List */}
                    <div className="mt-[0.25in] flex flex-col gap-[0.25in]">
                        {events.map((event) => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                actionButton={createActionButton(event)} 
                            />
                        ))}

                        {events.length === 0 && !isLoading && (
                            <div className="p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#c0cad0] rounded-[16px] bg-[#f9fdff]">
                                <p className="text-[20px] font-semibold text-[#002940] mb-2">No events found</p>
                                <p className="text-[16px] text-gray-500">Try adjusting your filters or search term.</p>
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