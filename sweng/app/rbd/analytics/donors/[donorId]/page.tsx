"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchDonorAnalytics } from "../../rbd_action";
import DonorDetails from "@/components/DonorDetails";
import Header from "@/components/HeaderRBD";

export default function DonorAnalyticsDetailsPage() {
    
    const router = useRouter();
    const params = useParams();
    const donorId = params.donorId as string;
    const [selectedDonor, setSelectedDonor] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        const loadDonor = async () => {

            if (!donorId) 
                return;

            setIsLoading(true);
            setErrorMessage("");

            try {

                const result = await fetchDonorAnalytics(donorId);

                if (result.success && result.data) {
                    setSelectedDonor(result.data);
                } else {
                    setErrorMessage(result.message || "Failed to load donor data.");
                    setSelectedDonor(undefined);
                }
            } catch (error) {
                setErrorMessage("Failed to connect to the database.");
                setSelectedDonor(undefined);
            } finally {
                setIsLoading(false); 
            }
        }

        loadDonor();
    }, [donorId]);

    const goBack = () => {
        router.push("/rbd/analytics/donors");
    };

    if (selectedDonor === undefined) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />

                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Donor Analytics Not Found
                        </h1>

                        <p className="mt-[10px] text-[18px] text-[#002940]">
                            The selected donor does not have available analytics.
                        </p>

                        <button
                            type="button"
                            onClick={goBack}
                            className="mt-[0.25in] px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold cursor-pointer hover:underline"
                        >
                            Back to Donor Analytics
                        </button>
                    </section>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading Donor Details...</p>
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
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Analytics Summary
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Total Visits:
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.totalVisits}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Blood Donated:
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.bloodDonated}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Blood Bags Filled:
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.bloodBagsFilled}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Successful Donations:
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.successfulDonations}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-[0.35in] grid grid-cols-1 xl:grid-cols-2 gap-[0.35in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Most Recent Visit
                        </h2>

                        <div className="mt-[0.25in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="mt-5 text-[18px] font-semibold text-[#002940]">
                                Event:
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.recentVisitEvent}
                            </p>
                            
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Date:
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedDonor?.recentVisitDate}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Donor Visit Metrics
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Deferred Visits: 
                                </p>

                                <p className="mt-2 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    {selectedDonor?.deferredVisits}
                                </p>
                            </div>

                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Next Eligible Donation Date:
                                </p>

                                <p className="mt-2 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    {(!selectedDonor?.nextEligibleDate || new Date(selectedDonor.nextEligibleDate) <= new Date()) 
                                        ? "Eligible Now" 
                                        : selectedDonor.nextEligibleDate
                                    }
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={goBack}
                            className="mt-[0.35in] bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#fd5448] hover:border-[#fd5448] hover:text-white transition"
                        >
                            Back to Donor List
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}