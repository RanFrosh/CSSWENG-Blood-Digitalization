"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DonorCard from "@/components/DonorCard";

interface DonorAnalyticsClientProps {
    initialDonors: any[]; 
    currentSearch: string;
    currentBlood: string;
    currentSex: string;
    currentEligibility: string;
    currentSort: string;
}

export default function DonorAnalyticsClient({
    initialDonors,
    currentSearch,
    currentBlood,
    currentSex,
    currentEligibility,
    currentSort
}: DonorAnalyticsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for the search input box
    const [searchInput, setSearchInput] = useState(currentSearch);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(initialDonors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDonors = initialDonors.slice(startIndex, startIndex + itemsPerPage);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value && value !== "All" && value !== "Default") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        setCurrentPage(1);
        router.push(`?${params.toString()}`);
    };

    const viewDonorAnalytics = (donorId: string) => {
        router.push(`/rbd/analytics/donors/${donorId}`);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const resultsSection = document.getElementById('results-top');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
            {/* Filters Section */}
            <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                    Donor Directory
                </h2>
                
                <div className="mt-6 bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-row items-end gap-5 flex-wrap">
                    
                    {/* Search Input */}
                    <div className="flex-1 flex flex-col gap-2 min-w-[250px]">
                        <label className="text-[18px] font-semibold text-[#002940]">Search</label>
                        <div className="flex flex-row items-center w-full h-[54px] bg-white border-2 border-[#c0cad0] rounded-[10px] focus-within:border-[#002940] transition-colors overflow-hidden">
                            <button
                                type="button"
                                onClick={() => updateFilter('search', searchInput)}
                                className="pl-4 pr-2 h-full flex items-center justify-center text-gray-400 hover:text-[#002940] transition-colors cursor-pointer"
                                title="Search"
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
                                placeholder="Input donor id..."
                                className="flex-1 h-full pr-4 text-[18px] outline-none bg-transparent text-[#002940] placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Blood Type Filter */}
                    <div className="w-full md:w-[1.5in] flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">Blood Type</label>
                        <select 
                            value={currentBlood}
                            onChange={(e) => updateFilter('blood', e.target.value)}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                        >
                            <option value="All">All Types</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>

                    {/* Sex Filter */}
                    <div className="w-full md:w-[1.5in] flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">Sex</label>
                        <select 
                            value={currentSex}
                            onChange={(e) => updateFilter('sex', e.target.value)}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                        >
                            <option value="All">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    {/* Eligibility Filter */}
                    <div className="w-full md:w-[1.5in] flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">Eligibility</label>
                        <select 
                            value={currentEligibility}
                            onChange={(e) => updateFilter('eligibility', e.target.value)}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                        >
                            <option value="All">All</option>
                            <option value="Eligible">Eligible</option>
                            <option value="Recovery">In Recovery</option>
                        </select>
                    </div>

                    {/* Sorting */}
                    <div className="w-full md:w-[2in] flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">Sort By</label>
                        <select 
                            value={currentSort}
                            onChange={(e) => updateFilter('sortBy', e.target.value)}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                        >
                            <option value="Default">ID (ascending)</option>
                            <option value="ID (Descending)">ID (descending)</option>
                            <option value="Age (Youngest)">Age (ascending)</option>
                            <option value="Age (Oldest)">Age (descending)</option>
                        </select>
                    </div>
                </div>
            </section>

            <section id="results-top" className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                {/* Divider & Result Count */}
                <div className="flex flex-row items-center justify-between border-b-2 border-[#c0cad0] pb-4">
                    <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                        Results
                    </h3>
                    <span className="bg-[#e2e8ec] text-[#002940] px-4 py-1 rounded-full text-[16px] font-semibold">
                        Showing {initialDonors.length} {initialDonors.length === 1 ? 'donor' : 'donors'}
                    </span>
                </div>

                <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                    {currentDonors.map((donor) => (
                        <DonorCard 
                            key={donor.id?.toString()} 
                            donor={donor} 
                            onViewAnalytics={viewDonorAnalytics} 
                        />
                    ))}

                    {/* Empty State Fallback */}
                    {initialDonors.length === 0 && (
                        <div className="p-8 text-center text-gray-500 italic border-2 border-dashed border-gray-300 rounded-[16px]">
                            No donors found matching your criteria.
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
                        disabled={currentPage >= totalPages || initialDonors.length === 0}
                        className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    );
}