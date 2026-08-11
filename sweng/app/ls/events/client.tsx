"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { ViewEvents } from "@/types/event_type";
import JoinEventButton from "@/components/JoinEventButton";

interface LSEventsClientProps {
    initialEvents: ViewEvents[];
    availableCities: string[];
    availablePartners: string[];
    currentSearch: string;
    currentPartner: string;
    currentCity: string;
    currentSort: string;
}

export default function LSEventsClient({
    initialEvents,
    availableCities,
    availablePartners,
    currentSearch,
    currentPartner,
    currentCity,
    currentSort,
}: LSEventsClientProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Local UI states only
    const [searchInput, setSearchInput] = useState(currentSearch);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [eventCode, setEventCode] = useState("");
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(initialEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEvents = initialEvents.slice(startIndex, startIndex + itemsPerPage);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value && value !== "All Cities" && value !== "All Partners" && value !== "Default") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        setCurrentPage(1); // Reset page on filter change
        router.push(`?${params.toString()}`);
    };

    const openEvent = (event: ViewEvents) => {
        if (event.status === "Ongoing") {
            router.push(`/ls/events/${event.id}`);
        }
    };

    const createActionButton = (event: ViewEvents) => {
        if (event.status === "Ongoing") {
            return (
                <button
                    onClick={() => openEvent(event)}
                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
                >
                    Open Event
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

    return (
        <>
            <section className="mt-5 bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                    Assigned Events
                </h2>

                {/* Search and Sort */}
                <div className="mt-6 bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-row items-end gap-5 flex-wrap">
                    
                    <div className="flex-1 flex flex-col gap-2 min-w-[250px]">
                        <label className="text-[18px] font-semibold text-[#002940]">Search by</label>
                        <div className="flex flex-row items-center w-full h-[54px] bg-white border-2 border-[#c0cad0] rounded-[10px] focus-within:border-[#002940] transition-colors overflow-hidden">
                            <button
                                type="button"
                                onClick={() => updateFilter('search', searchInput)}
                                className="pl-4 pr-2 h-full flex items-center justify-center text-gray-400 hover:text-[#002940] transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') updateFilter('search', searchInput);
                                }}
                                placeholder="Input event name or partner..."
                                className="flex-1 h-full pr-4 text-[18px] outline-none bg-transparent text-[#002940] placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">Partner</label>
                        <select 
                            value={currentPartner}
                            onChange={(e) => updateFilter('partner', e.target.value)}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white"
                        >
                            <option value="All Partners">All Partners</option>
                            {availablePartners.map((partnerName) => (
                                <option key={partnerName} value={partnerName}>
                                    {partnerName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">City</label>
                        <select 
                            value={currentCity}
                            onChange={(e) => updateFilter('city', e.target.value)}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white"
                        >
                            <option value="All Cities">All Cities</option>
                            {availableCities.map((cityName) => (
                                <option key={cityName} value={cityName}>
                                    {cityName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-[2in] flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">Sort By</label>
                        <select 
                            value={currentSort}
                            onChange={(e) => updateFilter('sortBy', e.target.value)}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                        >
                            <option value="Default">ID (ascending)</option>
                            <option value="ID (Descending)">ID (descending)</option>
                            <option value="Date (Earliest)">Date (earliest)</option>
                            <option value="Date (Oldest)">Date (oldest)</option>
                            <option value="Partner (A-Z)">Partner (A-Z)</option>
                            <option value="Partner (Z-A)">Partner (Z-A)</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setEventCode("");
                            setIsJoinModalOpen(true);
                        }}
                        className="px-[20px] py-[10px] rounded-full bg-[#002940] border-2 border-[#002940] text-white font-bold text-[16px] cursor-pointer hover:bg-white hover:text-[#002940] transition"
                    >
                        + Join Event
                    </button>
                </div>

                {/* Divider & Result Count */}
                <section id="results-top" className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between border-b-2 border-[#c0cad0] pb-4">
                        <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Results
                        </h3>
                        <span className="bg-[#e2e8ec] text-[#002940] px-4 py-1 rounded-full text-[16px] font-semibold">
                            Showing {initialEvents.length} {initialEvents.length === 1 ? 'event' : 'events'}
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

                        {initialEvents.length === 0 && (
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

            {/* Join Event Modal */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Join Event
                        </h2>
                        <form className="mt-[0.2in] flex flex-col gap-[0.15in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Event Code
                                </label>
                                <input
                                    type="text"
                                    value={eventCode}
                                    onChange={(event) => setEventCode(event.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                />
                            </div>
                            
                            <div className="mt-[0.2in] flex flex-row justify-end gap-[10px] w-full items-start">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsJoinModalOpen(false);
                                        setEventCode("");
                                    }}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white shrink-0"
                                >
                                    Cancel
                                </button>

                                <JoinEventButton 
                                    eventId={eventCode} 
                                    onSuccess={() => {
                                        setIsJoinModalOpen(false);
                                        setEventCode("");
                                    }} 
                                />

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}