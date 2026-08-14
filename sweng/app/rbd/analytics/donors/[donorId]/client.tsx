"use client";

import { useRouter } from "next/navigation";
import DonorDetails from "@/components/panels/DonorDetails";
import Header from "@/components/headers/HeaderRBD";

interface DonorAnalyticsClientProps {
    selectedDonor: any; 
}

export default function DonorAnalyticsClient({ selectedDonor }: DonorAnalyticsClientProps) {
    const router = useRouter();

    const goBack = () => {
        router.push("/rbd/analytics/donors");
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

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <DonorDetails donor={selectedDonor}/>
                </section>

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940] mb-6">
                        Donation Metrics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {/* Blood Donated */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Blood Donated
                            </p>
                            <p className="mt-1 text-[26px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.bloodDonated || "0 mL"}
                            </p>
                        </div>

                        {/* Blood Bags Filled */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Blood Bags Filled
                            </p>
                            <p className="mt-1 text-[26px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.bloodBagsFilled || 0}
                            </p>
                        </div>

                        {/* Successful Donations */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Successful Donations
                            </p>
                            <p className="mt-1 text-[26px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.successfulDonations || 0}
                            </p>
                        </div>

                        {/* Success Rate */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Success Rate
                            </p>
                            <p className="mt-1 text-[26px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.totalVisits > 0 
                                    ? `${((Number(selectedDonor.successfulDonations) || 0) / Number(selectedDonor.totalVisits) * 100).toFixed(1)}%` 
                                    : "0.0%"}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940] mb-6">
                        Visit History & Metrics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {/* Recent Event */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Most Recent Event
                            </p>
                            <p className="mt-1 text-[20px] font-['Montserrat'] font-bold text-[#002940] truncate">
                                {selectedDonor?.recentVisitEvent || "N/A"} ({selectedDonor?.recentVisitDate?.split('-').reverse().join('/') || "N/A"})
                            </p>
                        </div>

                        {/* Total Visits */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Total Visits
                            </p>
                            <p className="mt-1 text-[22px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.totalVisits}
                            </p>
                        </div>

                        {/* Deferred Visits */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Deferred Visits
                            </p>
                            <p className="mt-1 text-[26px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.deferredVisits || 0}
                            </p>
                        </div>

                        {/* Eligibility Status */}
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col justify-center">
                            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">
                                Next Eligible Date
                            </p>
                            <p className={`mt-1 text-[22px] font-['Montserrat'] font-bold ${(!selectedDonor?.nextEligibleDate || new Date(selectedDonor.nextEligibleDate) <= new Date()) ? 'text-emerald-600' : 'text-[#002940]'}`}>
                                {(!selectedDonor?.nextEligibleDate || new Date(selectedDonor.nextEligibleDate) <= new Date()) 
                                    ? "Eligible Now" 
                                    : selectedDonor.nextEligibleDate.split('-').reverse().join('/')
                                }
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 border-t-2 border-dashed border-[#c0cad0] pt-6">
                        <button
                            type="button"
                            onClick={goBack}
                            className="bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#fd5448] hover:border-[#fd5448] hover:text-white transition flex items-center gap-2 w-fit"
                        >
                            <span>←</span> Back to Donor List
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}