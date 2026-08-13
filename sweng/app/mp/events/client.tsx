"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventStatusType } from "@/db/enums/event_status";
import { ViewEvents } from "@/types/event_type";
import { ViewEventsWithProvince } from "@/types/event_type";
import { EventCard } from "@/components/EventCard";

type EventTab = EventStatusType | "All";

interface MPEventsClientProps {
    initialEvents: ViewEventsWithProvince[];
    currentTab: EventTab;
    availableCities: string[];
    availablePartners: string[];
    currentSearch: string;
    currentPartner: string;
    currentCity: string;
    currentSort: string;
}

export default function MPEventsClient({
    initialEvents,
    currentTab,
    availableCities,
    availablePartners,
    currentSearch,
    currentPartner,
    currentCity,
    currentSort,
}: MPEventsClientProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchInput, setSearchInput] = useState(currentSearch);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(initialEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEvents = initialEvents.slice(startIndex, startIndex + itemsPerPage);

    const tabs: EventTab[] = ["Ongoing", "Upcoming", "Completed", "All"];

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

    const handleTabClick = (tab: EventTab) => {
        const params = new URLSearchParams(searchParams.toString());
        if (tab !== "Ongoing") {
            params.set("tab", tab);
        } else {
            params.delete("tab"); 
        }
        setCurrentPage(1);
        router.push(`?${params.toString()}`);
    };

    const openEvent = (event: ViewEvents) => {
        router.push(`/mp/events/${event.id}`);
    };

    const createActionButton = (event: ViewEvents) => {
        return (
            <button
                onClick={() => openEvent(event)}
                className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
            >
                Open Event
            </button>
        );
    };

    const getTabClass = (tab: EventTab) => {
        return `px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ${
            currentTab === tab
                ? "bg-[#002940] border-[#002940] text-white font-bold"
                : "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white"
        }`;
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const resultsSection = document.getElementById('results-top');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
            
            {/* Header & Tabs */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-[1rem]">
                <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                    Assigned Events
                </h2>
                <div className="flex flex-row flex-wrap gap-[10px]">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => handleTabClick(tab)} className={getTabClass(tab)}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Filters Block */}
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
                            onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('search', searchInput); }}
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
                            <option key={partnerName} value={partnerName}>{partnerName}</option>
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
                            <option key={cityName} value={cityName}>{cityName}</option>
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
            </div>

            {/* Results Section */}
            <div id="results-top" className="mt-[0.35in] flex flex-row items-center justify-between border-b-2 border-[#c0cad0] pb-4">
                <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                    Results
                </h3>
                <span className="bg-[#e2e8ec] text-[#002940] px-4 py-1 rounded-full text-[16px] font-semibold">
                    Showing {initialEvents.length} {initialEvents.length === 1 ? 'event' : 'events'}
                </span>
            </div>

            {/* Event Cards List */}
            <div className="mt-[0.25in] flex flex-col gap-[0.25in]">
                {initialEvents.length === 0 ? (
                    <div className="bg-[#f9fdff] border-2 border-dashed border-[#c0cad0] rounded-[16px] py-[0.5in] text-center">
                        <p className="text-[18px] font-semibold text-[#002940]">
                            No events match your criteria.
                        </p>
                        <p className="mt-2 text-[16px] text-[#5c6b73]">
                            Try adjusting your search, filters, or tab selection.
                        </p>
                    </div>
                ) : (
                    currentEvents.map((event) => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            actionButton={createActionButton(event)} 
                        />
                    )))}
            </div>

            {/* Pagination */}
            {initialEvents.length > 0 && (
                <div className="mt-5 flex flex-row items-center justify-between gap-5 border-t-2 border-[#c0cad0] pt-4">
                    <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                    >
                        Previous
                    </button>
                    <p className="text-[18px] text-[#002940] font-semibold">
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
            )}
        </section>
    );
}