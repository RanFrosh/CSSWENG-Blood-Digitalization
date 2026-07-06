"use client";
import Header from "@/components/HeaderRBD";

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

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Analytics Summary
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Total Donors
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {overallAnalytics.totalDonors}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Blood Donated
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {overallAnalytics.bloodDonated}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Total Bags Produced
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {overallAnalytics.totalBagsProduced}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Show-up Rate
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {overallAnalytics.showUpRate}
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
                            {overallAnalytics.bloodTypes.map((bloodType) => (
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
                            ))}
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
                                    {overallAnalytics.totalBagsProduced} / {overallAnalytics.extractionGoal}
                                </p>
                            </div>

                            <div className="mt-5 w-full h-[24px] bg-white border-2 border-[#c0cad0] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#002940]"
                                    style={{
                                        width: `${overallAnalytics.extractionProgress}%`,
                                    }}
                                ></div>
                            </div>

                            <p className="mt-4 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {overallAnalytics.extractionProgress}%
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}