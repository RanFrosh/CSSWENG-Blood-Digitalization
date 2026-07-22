"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchFilteredDonors } from "../rbd_action";
import DonorCard from "@/components/DonorCard";
import Header from "@/components/HeaderRBD";

export default function DonorAnalyticsPage() {

    const router = useRouter();

    const [activeTab, setActiveTab] = useState("All");

    // Filters
    const [sexFilter, setSexFilter] = useState("All");
    const [bloodFilter, setBloodFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Default");

    // Search
    const [searchInput, setSearchInput] = useState(""); 
    const [activeSearch, setActiveSearch] = useState("");

    const [donors, setDonors] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadDonors = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const result = await fetchFilteredDonors(activeSearch, bloodFilter, sexFilter, sortBy);

                if (result.success && result.data) {
                    setDonors(result.data);
                } else {
                    setErrorMessage(result.message || "Failed to load donors.");
                }
            } catch (error) {
                setErrorMessage("Failed to connect to the database");
            } finally {
                setIsLoading(false); 
            }
        }

        loadDonors();

    }, [activeSearch, bloodFilter, sexFilter, sortBy]);

    const viewDonorAnalytics = (donorId: string) => {
        router.push(`/rbd/analytics/donors/${donorId}`);
    };

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading Donors...</p>
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

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">

                {/* Filters Section */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                    
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Directory
                    </h2>
                    
                    {/* 2. Search, Blood Filter, and Sort (Tinted Container) */}
                    <div className="mt-6 bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-row items-end gap-5 flex-wrap">
                        
                        {/* Search Input with embedded button */}
                        <div className="flex-1 flex flex-col gap-2 min-w-[250px]">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Search Name or Email
                            </label>
                            
                            <div className="flex flex-row items-center w-full h-[54px] bg-white border-2 border-[#c0cad0] rounded-[10px] focus-within:border-[#002940] transition-colors overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setActiveSearch(searchInput)}
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
                                        if (e.key === 'Enter') setActiveSearch(searchInput);
                                    }}
                                    placeholder="Input donor details..."
                                    className="flex-1 h-full pr-4 text-[18px] outline-none bg-transparent text-[#002940] placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Blood Type Filter */}
                        <div className="w-full md:w-[1.5in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Blood Type
                            </label>
                            
                            <select 
                                value={bloodFilter}
                                onChange={(e) => setBloodFilter(e.target.value)}
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
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sex
                            </label>
                            
                            <select 
                                value={sexFilter}
                                onChange={(e) => setSexFilter(e.target.value)}
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                            >
                                <option value="All">All</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        {/* Sorting */}
                        <div className="w-full md:w-[2in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sort By
                            </label>
                            
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer transition-colors"
                            >
                                <option value="Default">Newest First</option>
                                <option value="Name (A-Z)">Name (A-Z)</option>
                                <option value="Name (Z-A)">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">

                    {/* Divider & Result Count */}
                    <div className="mt-8 flex flex-row items-center justify-between border-b-2 border-[#c0cad0] pb-4">
                        <h3 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Results
                        </h3>
                        
                        <span className="bg-[#e2e8ec] text-[#002940] px-4 py-1 rounded-full text-[16px] font-semibold">
                            Showing {donors.length} {donors.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {donors.map((donor) => (
                            <DonorCard 
                                key={donor.id?.toString()} 
                                donor={donor} 
                                onViewAnalytics={viewDonorAnalytics} 
                            />
                        ))}

                        {/* Empty State Fallback */}
                        {donors.length === 0 && (
                            <div className="p-8 text-center text-gray-500 italic border-2 border-dashed border-gray-300 rounded-[16px]">
                                No donors found matching your criteria.
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

                        <p className="text-[18px] text-[#002940]">Page 1</p>

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