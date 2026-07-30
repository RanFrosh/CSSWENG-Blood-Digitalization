"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/HeaderRBD";
import { fetchAllDonors } from "@/app/analytics/donor_action";

type Donor = {
    id: bigint; 
    first_name: string;
    last_name: string;
    sex: string;
    blood: string;
    street: string | null;
    zip_code: string | null;
    active: boolean;
    email: string;
    age: number | null;
    mobile_no: string
};

export default function DonorAnalyticsPage() {
    
    const router = useRouter();
    const [donors, setDonors] = useState<Donor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
    

    const viewDonorAnalytics = (donorId: bigint) => {
        router.push(`/rbd/analytics/donors/${donorId.toString()}`);
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Red Bank Director
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Analytics
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
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>

                        <div className="w-[2in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sort By
                            </label>

                            <select className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white">
                                <option>Default</option>
                                <option>Sex</option>
                                <option>Blood Type</option>
                                <option>Location</option>
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
                            Showing {isLoading ? "..." : donors.length} donor/s
                        </p>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {isLoading ? (
                            <p className="text-[18px] text-[#002940] animate-pulse">Fetching database records...</p>
                        ) : donors.length === 0 ? (
                            <p className="text-[18px] text-gray-500 italic">No donors found in the system.</p>
                        ) : (
                            donors.slice(0, 5).map((donor) => (
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
                                        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                            
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
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination (View-Only for Demo) */}
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