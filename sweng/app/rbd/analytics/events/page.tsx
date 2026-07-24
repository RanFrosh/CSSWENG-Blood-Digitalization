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
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Default");

    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    
    // State for holding events from the backend
    const [events, setEvents] = useState<ViewEvents[]>([]);

    // Loading State
    const [isLoading, setIsLoading] = useState(true);

    // Error display
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(events.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const result = await fetchFilteredEvents(activeSearch, statusFilter, sortBy);

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

    }, [activeSearch, statusFilter, sortBy]);

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

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        
        const resultsSection = document.getElementById('results-top');

        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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

                    <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Directory
                    </h2>

                    {/* Search and Sort */}
                    <div className="mt-6 bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-row items-end gap-5 flex-wrap">
                        
                        <div className="flex-1 flex flex-col gap-2 min-w-[250px]">
                            
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Search by
                            </label>

                            {/* Wrapper */}
                            <div className="flex flex-row items-center w-full h-[54px] bg-white border-2 border-[#c0cad0] rounded-[10px] focus-within:border-[#002940] transition-colors overflow-hidden">
                                
                                {/* The Search Button */}
                                <button
                                    type="button"
                                    onClick={() => setActiveSearch(searchInput)}
                                    className="pl-4 pr-2 h-full flex items-center justify-center text-gray-400 hover:text-[#002940] transition-colors cursor-pointer"
                                    title="Search"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={2.5} 
                                        stroke="currentColor" 
                                        className="w-6 h-6"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </button>

                                {/* The Borderless Input */}
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') setActiveSearch(searchInput);
                                    }}
                                    placeholder="Input event name or partner..."
                                    className="flex-1 h-full pr-4 text-[18px] outline-none bg-transparent text-[#002940] placeholder-gray-400"
                                />
                            </div>

                        </div>

                        {/* Status Filter */}
                        <div className="w-full md:w-[1.5in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Status
                            </label>
                            
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                            >
                                <option value="All">All</option>
                                <option value="Completed">Completed</option>
                                <option value="Ongoing">Ongoing</option>
                            </select>
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
                                {/* Date Options */}
                                <option value ="Date">Date (earliest)</option>
                                <option value ="Date (Oldest)">Date (oldest)</option>
                                
                                {/* Partner Options */}
                                <option value = "Partner (A-Z)">Partner (A-Z)</option>
                                <option value = "Partner (Z-A)">Partner (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {/* Divider & Result Count */}
                    <section id="results-top" className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                        
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
                            {currentEvents.map((event) => (
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
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                            >
                                Previous
                            </button>

                            <p className="text-[18px] text-[#002940]">
                                Page {currentPage} of {totalPages || 1}
                            </p>

                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                            >
                                Next
                            </button>
                        </div>
                    </section>
                </section>
            </div>
        </main>
    );
}