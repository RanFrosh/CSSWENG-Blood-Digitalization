"use client";

import { useEffect, useState } from "react";
import Header from "@/components/HeaderRBD";
import { fetchDirectorStats } from "@/app/analytics/analytics_action";

type BloodTypeData = {
    bloodType: string;
    count: number;
};

type OverallAnalytics = {
    totalDonors: number;
    bloodDonated: string;
    totalBagsProduced: number;
    showUpRate: string;
    extractionGoal: number;
    extractionProgress: number;
    bloodTypes: BloodTypeData[];
};

const overallAnalytics: OverallAnalytics = {
    totalDonors: 480,
    bloodDonated: "106400 mL",
    totalBagsProduced: 304,
    showUpRate: "88%",
    extractionGoal: 400,
    extractionProgress: 76,
    bloodTypes: [
        { bloodType: "O+", count: 102 },
        { bloodType: "A+", count: 78 },
        { bloodType: "B+", count: 54 },
        { bloodType: "AB+", count: 30 },
        { bloodType: "O-", count: 18 },
        { bloodType: "A-", count: 12 },
        { bloodType: "B-", count: 7 },
        { bloodType: "AB-", count: 3 },
    ],
};

export default function OverallAnalyticsPage() {

    const [analytics, setAnalytics] = useState<OverallAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            const result = await fetchDirectorStats();
            
            if (result.success && result.data) {
                const db = result.data;
                
                setAnalytics({
                    totalDonors: db.totalActiveDonors,
                    // Convert bags to mL (assuming standard 450mL bags)
                    bloodDonated: `${(db.extractionGoals.currentCollected * 450).toLocaleString()} mL`, 
                    totalBagsProduced: db.extractionGoals.currentCollected,
                    showUpRate: `${db.showUpRates.ratePercent}%`,
                    extractionGoal: db.extractionGoals.targetGoal,
                    extractionProgress: db.extractionGoals.progressPercent,
                    bloodTypes: db.donorDemographics.map((demo: any) => ({
                        bloodType: demo.blood_type,
                        count: Number(demo.count) // Cast it to a number here
                    }))
                });
            }
            setIsLoading(false);
        };
        
        loadDashboard();
    }, []);

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Red Bank Director
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Overall Analytics
                    </h1>
                </section>

                {/* Filters */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Filters
                    </h2>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Start Date
                            </label>

                            <input
                                type="date"
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                End Date
                            </label>

                            <input
                                type="date"
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Partner
                            </label>

                            <select className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white">
                                <option>All Partners</option>
                                <option>Manila Doctors Hospital</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Location
                            </label>

                            <select className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white">
                                <option>All Locations</option>
                                <option>DLSU</option>
                            </select>
                        </div>
                    </div>
                </section>

                {isLoading ? (
                     <div className="mt-[0.35in] h-[300px] flex items-center justify-center text-[#002940] text-xl font-semibold animate-pulse">
                            Compiling database analytics...
                     </div>
                ) : !analytics ? (
                     <div className="mt-[0.35in] h-[300px] flex items-center justify-center text-red-500 text-xl font-semibold">
                            Failed to load analytics data.
                     </div>
                ) : (
                    <>
                        <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                            <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                Analytics Summary
                            </h2>

                            <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <p className="text-[18px] font-semibold text-[#002940]">Total Donors</p>
                                    <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                        {analytics.totalDonors}
                                    </p>
                                </div>
                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <p className="text-[18px] font-semibold text-[#002940]">Blood Donated</p>
                                    <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                        {analytics.bloodDonated}
                                    </p>
                                </div>
                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <p className="text-[18px] font-semibold text-[#002940]">Total Bags Produced</p>
                                    <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                        {analytics.totalBagsProduced}
                                    </p>
                                </div>
                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <p className="text-[18px] font-semibold text-[#002940]">Show-up Rate</p>
                                    <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                        {analytics.showUpRate}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mt-[0.35in] grid grid-cols-1 xl:grid-cols-2 gap-[0.35in]">
                            <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Blood Type Distribution
                                </h2>

                                <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analytics.bloodTypes.length > 0 ? analytics.bloodTypes.map((bloodType) => (
                                        <div
                                            key={bloodType.bloodType}
                                            className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-row items-center justify-between"
                                        >
                                            <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                                {bloodType.bloodType}
                                            </p>
                                            <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                                {bloodType.count}
                                            </p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 italic col-span-2">No active blood inventory found.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Extraction Goal Progress
                                </h2>

                                <div className="mt-[0.25in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                                        <p className="text-[18px] font-semibold text-[#002940]">
                                            Target Bags
                                        </p>
                                        <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                            {analytics.totalBagsProduced} / {analytics.extractionGoal}
                                        </p>
                                    </div>

                                    <div className="mt-5 w-full h-[24px] bg-white border-2 border-[#c0cad0] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#002940] transition-all duration-1000 ease-out"
                                            style={{ width: `${analytics.extractionProgress}%` }}
                                        ></div>
                                    </div>

                                    <p className="mt-4 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                        {analytics.extractionProgress}%
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}