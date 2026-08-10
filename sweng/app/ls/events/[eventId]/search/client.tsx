"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type DonorAnalytics = {
    id: string;
    name: string;
    sex: string;
    bloodType: string;
    image: string;
};

interface DonorSearchClientProps {
    eventId: string;
    initialDonors: DonorAnalytics[];
}

export default function DonorSearchClient({ eventId, initialDonors }: DonorSearchClientProps) {
    
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Default");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    let processedDonors = initialDonors.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "Sex") {
        processedDonors.sort((a, b) => a.sex.localeCompare(b.sex));
    } else if (sortBy === "Blood Type") {
        processedDonors.sort((a, b) => a.bloodType.localeCompare(b.bloodType));
    }

    const totalPages = Math.ceil(processedDonors.length / itemsPerPage) || 1;
    const paginatedDonors = processedDonors.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const viewDonorRecord = (donorId: string) => {
        router.push(`/ls/events/${eventId}/search/${donorId}`);
    };

    return (
        <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
            <section className="bg-[#f9fdff] p-[0.25in]">
                <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                    Lab Staff
                </p>
                <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                    Donor Records Search
                </h1>
            </section>

            <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                    Search Donors
                </h2>

                <div className="mt-5 flex flex-row items-end gap-5">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">
                            Search by
                        </label>
                        <input
                            type="text"
                            placeholder="Input donor name"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on new search
                            }}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                        />
                    </div>

                    <div className="w-[2in] flex flex-col gap-2">
                        <label className="text-[18px] font-semibold text-[#002940]">
                            Sort By
                        </label>
                        <select 
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on sort change
                            }}
                            className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer"
                        >
                            <option value="Default">Default</option>
                            <option value="Sex">Sex</option>
                            <option value="Blood Type">Blood Type</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                    <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                        Donors
                    </h2>
                    <p className="text-[18px] text-[#002940]">
                        Showing {processedDonors.length} donor/s
                    </p>
                </div>

                <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                    {paginatedDonors.map((donor) => (
                        <div
                            key={donor.id}
                            className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                        >
                            <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between gap-4 flex-wrap">
                                <div className="flex flex-row items-center gap-4 flex-wrap">
                                    <img
                                        src={donor.image}
                                        alt={donor.name}
                                        className="w-[60px] h-[60px] rounded-full bg-white object-cover border-2 border-white"
                                    />
                                    <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                        {donor.name}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => viewDonorRecord(donor.id)}
                                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
                                >
                                    View Record
                                </button>
                            </div>

                            <div className="p-[0.35in]">
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                    <p>
                                        <span className="font-semibold text-[#002940]">Sex:</span> {donor.sex}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-[#002940]">Blood Type:</span> {donor.bloodType}
                                    </p>              
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {paginatedDonors.length === 0 && (
                        <p className="text-center text-[18px] text-[#5c6b73] py-5">
                            No donors found matching your search.
                        </p>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="mt-5 flex flex-row items-center justify-between gap-5">
                    <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:hover:no-underline disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <p className="text-[18px] text-[#002940]">
                        Page {currentPage} of {totalPages}
                    </p>
                    <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:hover:no-underline disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    );
}