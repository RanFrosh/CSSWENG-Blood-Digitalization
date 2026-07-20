"use client";

<<<<<<< Updated upstream
=======
import { useEffect, useState, useMemo } from "react";
>>>>>>> Stashed changes
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderRBD";

type DonorAnalytics = {
    id: string;
    name: string;
    sex: string;
<<<<<<< Updated upstream
    bloodType: string;
    location: string;
=======
    blood: string;
    street: string;
    zip_code: string;
    active: boolean;
    email: string;
    age: string;
    mobile_no: string;
>>>>>>> Stashed changes
};

const donors: DonorAnalytics[] = [
    {
        id: "D-001",
        name: "John Doe",
        sex: "Male",
        bloodType: "O+",
        location: "Manila",
    },
    {
        id: "D-002",
        name: "Jason Doe",
        sex: "Male",
        bloodType: "A+",
        location: "San Juan",
    },
    {
        id: "D-003",
        name: "Jean Doe",
        sex: "Female",
        bloodType: "B+",
        location: "Makati",
    },
    {
        id: "D-004",
        name: "Jack Doe",
        sex: "Male",
        bloodType: "AB+",
        location: "Taguig",
    },
    {
        id: "D-005",
        name: "June Doe",
        sex: "Female",
        bloodType: "O-",
        location: "Pasay",
    },
];

export default function DonorAnalyticsPage() {
    const router = useRouter();
<<<<<<< Updated upstream

    const viewDonorAnalytics = (donorId: string) => {
        router.push(`/rbd/analytics/donors/${donorId}`);
=======
    const [donors, setDonors] = useState<Donor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Default");

    useEffect(() => {
        const loadDonors = async () => {
            const result = await fetchAllDonors();
            if (result.success && result.data) {
                setDonors(result.data);
            }
            setIsLoading(false);
        };
        loadDonors();
    }, []);

    // Handle Client-Side Filtering and Sorting
    const filteredAndSortedDonors = useMemo(() => {
        const filtered = donors.filter(donor => {
            const fullName = `${donor.first_name} ${donor.last_name}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "Sex") return a.sex.localeCompare(b.sex);
            if (sortBy === "Blood Type") return a.blood.localeCompare(b.blood);
            if (sortBy === "Location") return `${a.street}, ${a.zip_code}`.localeCompare(`${b.street}, ${b.zip_code}`);
            return 0; 
        });
    }, [donors, searchQuery, sortBy]);

    const viewDonorAnalytics = (donorId: bigint) => {
        router.push(`/rbd/analytics/donors/${donorId.toString()}`);
>>>>>>> Stashed changes
    };

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
<<<<<<< Updated upstream
                            Showing {donors.length} donor/s
=======
                            Showing {isLoading ? "..." : filteredAndSortedDonors.length} donor/s
>>>>>>> Stashed changes
                        </p>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
<<<<<<< Updated upstream
                        {donors.slice(0, 5).map((donor) => (
                            <div
                                key={donor.id}
                                className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                            >
                                <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between gap-5 flex-wrap">
                                    <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                        <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                            {donor.name}
                                        </h2>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            viewDonorAnalytics(donor.id);
                                        }}
                                        className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
                                    >
                                        View Analytics
                                    </button>
                                </div>

                                <div className="p-[0.35in]">
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Sex:
                                            </span>{" "}
                                            {donor.sex}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Blood Type:
                                            </span>{" "}
                                            {donor.bloodType}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Location:
                                            </span>{" "}
                                            {donor.location}
                                        </p>
=======
                        {isLoading ? (
                            <p className="text-[18px] text-[#002940] animate-pulse">Fetching database records...</p>
                        ) : filteredAndSortedDonors.length === 0 ? (
                            <p className="text-[18px] text-gray-500 italic">No matching donors found in the system.</p>
                        ) : (
                            filteredAndSortedDonors.slice(0, 5).map((donor) => (
                                <div
                                    key={donor.id.toString()}
                                    className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                                >
                                    <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between gap-5 flex-wrap">
                                        <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                            <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                                {donor.first_name} {donor.last_name}
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => viewDonorAnalytics(donor.id)}
                                            className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline hover:bg-gray-100 transition"
                                        >
                                            View Analytics
                                        </button>
                                    </div>

                                    <div className="p-[0.35in]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                            <p>
                                                <span className="font-semibold text-[#002940]">Blood Type: </span>  
                                                {donor.blood}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-[#002940]">Email: </span>  
                                                {donor.email}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-[#002940]">Sex: </span>  
                                                {donor.sex}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-[#002940]">Mobile Number: </span>  
                                                {donor.mobile_no}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-[#002940]">Age: </span>  
                                                {donor.age}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-[#002940]">Location: </span>  
                                                {`${donor.street}, ${donor.zip_code}`}
                                            </p>
                                        </div>
>>>>>>> Stashed changes
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

<<<<<<< Updated upstream
=======
                    {/* Pagination Context Footers */}
>>>>>>> Stashed changes
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