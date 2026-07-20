"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAllDonors } from "../rbd_action";
import { donor } from "@/db/models/donor";
import DonorCard from "@/components/DonorCard";
import Header from "@/components/HeaderRBD";

export default function DonorAnalyticsPage() {

    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Default");
    const [activeTab, setActiveTab] = useState("All");

    const [donors, setDonors] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadEvents = async () => {

            setIsLoading(true);
            setErrorMessage("");

            try {
                const result = await fetchAllDonors();

                if (result.success && result.data) {
                    setDonors(result.data);
                } else {
                    setErrorMessage(result.message);
                }
            } catch (error) {
                setErrorMessage("Failed to connect to the database");
            } finally {
                setIsLoading(false); 
            }
        }
        loadEvents();
    }, [activeTab]);

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

                {/* Main Title Section */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Red Bank Director
                    </p>
                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Search
                    </h1>
                </section>

                {/* Filters Section */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Filters
                    </h2>

                    <div className="mt-5 flex flex-row items-end gap-5 flex-wrap md:flex-nowrap">
                        <div className="flex-1 w-full flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Search by
                            </label>
                            <input
                                type="text"
                                placeholder="Input donor name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>

                        <div className="w-full md:w-[2in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white"
                            >
                                <option value="Default">Default</option>
                                <option value="Sex">Sex</option>
                                <option value="Blood Type">Blood Type</option>
                                <option value="Location">Location</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Registered Base Directory Records */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">

                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Donors
                        </h2>

                        <p className="text-[18px] text-[#002940]">
                            Showing {donors.length} donor/s
                        </p>

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