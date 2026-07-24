"use client";

import { useEffect, useState } from "react";
import Header from "@/components/HeaderRBD";
import { fetchOverallAnalytics } from "../rbd_action";

type BloodTypeData = {
    bloodType: string;
    count: number;
    pct: number;
    color: string;
};

type EventCampaign = {
    id: string;
    name: string;
    partner: string;
    date: string;
    extractionGoal: number;
    totalBagsProduced: number;
};

type OverallAnalytics = {
    totalDonors: number;
    bloodDonated: string;
    totalBagsProduced: number;
    extractionSuccessRate: string;
    extractionGoal: number;
    extractionProgress: number;
    malePct: number;
    femalePct: number;
    activeEngagementRate: number;
    bloodTypes: BloodTypeData[];
    campaignEvents: EventCampaign[];
};

export default function OverallAnalyticsPage() {
    
    const [analytics, setAnalytics] = useState<OverallAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isFiltering, setIsFiltering] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [partner, setPartner] = useState("All Partners");
    const [sortBy, setSortBy] = useState("recent");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const events = analytics?.campaignEvents || [];
    const bloodTypes = analytics?.bloodTypes || [];
    
    const totalPages = Math.ceil(events.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);

    const uniquePartners = Array.from(new Set(events.map(event => event.partner)));

    useEffect(() => {
        const loadAnalyticsData = async () => {
            const isFirstLoad = !analytics;
            
            if (isFirstLoad) {
                setIsLoading(true);
            } else {
                setIsFiltering(true);
            }
            
            setErrorMessage("");

            try {
                const result = await fetchOverallAnalytics({
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    partner: partner !== "All Partners" ? partner : undefined,
                    sortBy
                });

                if (result.success && result.data) {
                    setAnalytics(result.data); 
                } else {
                    setErrorMessage(result.message || "Failed to load analytics.");
                }
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
                setErrorMessage("Failed to connect to the database");
            } finally {
                setIsLoading(false);
                setIsFiltering(false);
            }
        };

        loadAnalyticsData();
    }, [startDate, endDate, partner, sortBy]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const resultsSection = document.getElementById('results-top');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [events.length, sortBy]);

    if (errorMessage) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-[24px] font-bold text-red-500 mb-2">Backend Crash</p>
                    <p className="text-[18px] text-gray-700">{errorMessage}</p>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="mt-[0.35in] h-[400px] flex items-center justify-center text-[#002940] text-xl font-semibold animate-pulse">
                    Fetching analytics...
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
                        Overall Analytics
                    </h1>
                </section>

                <div className={`transition-opacity duration-300 ease-in-out ${
                    isFiltering ? 'opacity-50 pointer-events-none' : 'opacity-100'
                }`}>

                    {/* Filters Section */}
                    <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Filters
                        </h2>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[18px] font-semibold text-[#002940]">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate || ""}
                                    max={endDate || undefined}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            {/* End Date */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[18px] font-semibold text-[#002940]">End Date</label>
                                <input
                                    type="date"
                                    value={endDate || ""}
                                    min={startDate || undefined}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[18px] font-semibold text-[#002940]">Partner</label>
                                <select 
                                    value={partner}
                                    onChange={(e) => setPartner(e.target.value)}
                                    className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white"
                                >
                                    <option value="All Partners">All Partners</option>
                                    {uniquePartners.map((partnerName) => (
                                        <option key={partnerName} value={partnerName}>
                                            {partnerName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[18px] font-semibold text-[#002940]">Location</label>
                                <select className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white">
                                    <option>All Locations</option>
                                    <option>DLSU</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Donor Metrics */}
                    <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Overall Donor Base Insights
                        </h2>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 shadow-sm">
                                <p className="text-[15px] font-bold text-[#002940] uppercase tracking-wide">Total Registered Donors</p>
                                <p className="mt-2 text-[42px] font-['Montserrat'] font-bold text-[#002940] leading-none">
                                    {analytics?.totalDonors || 0}
                                </p>
                            </div>
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 shadow-sm">
                                <p className="text-[15px] font-bold text-[#002940] uppercase tracking-wide">Active Engagement Rate</p>
                                <p className="mt-2 text-[42px] font-['Montserrat'] font-bold text-[#002940] leading-none">
                                    {Number(analytics?.activeEngagementRate || 0).toFixed(0)}%
                                </p>
                            </div>
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 shadow-sm">
                                <p className="text-[15px] font-bold text-[#002940] uppercase tracking-wide">Blood Volume Collected</p>
                                <p className="mt-2 text-[32px] font-['Montserrat'] font-bold text-[#002940] leading-none py-1.5">
                                    {analytics?.bloodDonated || "0 mL"}
                                </p>
                            </div>
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 shadow-sm">
                                <p className="text-[15px] font-bold text-[#002940] uppercase tracking-wide">Extraction Success Rate</p>
                                <p className="mt-2 text-[42px] font-['Montserrat'] font-bold text-[#002940] leading-none">
                                    {analytics?.extractionSuccessRate || "0%"}
                                </p>
                            </div>
                        </div>

                        {/* Gender Ratios */}
                        <div className="mt-8">
                            <div className="flex flex-row justify-between text-[13px] font-bold text-[#002940] mb-2 font-['Montserrat']">
                                <span>Male Base Ratio ({Number(analytics?.malePct || 0).toFixed(0)}%)</span>
                                <span>Female Base Ratio ({Number(analytics?.femalePct || 0).toFixed(0)}%)</span>
                            </div>
                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                                <div 
                                    style={{ width: `${analytics?.malePct || 0}%` }} 
                                    className="bg-[#002940] h-full transition-all duration-500 ease-out"
                                />
                                <div 
                                    style={{ width: `${analytics?.femalePct || 0}%` }} 
                                    className="bg-[#fd5448] h-full transition-all duration-500 ease-out"
                                />
                            </div>
                        </div>

                        <hr className="my-8 border-t border-[#c0cad0]" />

                        {/* ABO+Rh Systemic Distribution Breakdown */}
                        <div>
                            <h3 className="text-[22px] font-['Montserrat'] font-bold text-[#002940] mb-5">
                                ABO+Rh Systemic Distribution Breakdown
                            </h3>
                            
                            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-stretch">
                                <div className="w-full lg:w-[3.2in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-6 flex flex-col items-center justify-center min-h-[260px] shrink-0">
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                                            {(!analytics?.totalDonors || analytics.totalDonors === 0) && (
                                                <circle cx="40" cy="40" r="34" className="stroke-gray-100" strokeWidth="7" fill="transparent" />
                                            )}
                                            {(() => {
                                                let cumulativeOffset = 0;
                                                return bloodTypes.map((stat) => {
                                                    if (stat.count === 0) return null;
                                                    const circumference = 2 * Math.PI * 34;
                                                    const dashArray = `${(stat.pct / 100) * circumference} ${circumference}`;
                                                    const dashOffset = `${-(cumulativeOffset / 100) * circumference}`;
                                                    cumulativeOffset += stat.pct;
                                                    return (
                                                        <circle
                                                            key={`global-donut-ring-${stat.bloodType}`}
                                                            cx="40"
                                                            cy="40"
                                                            r="34"
                                                            stroke={stat.color}
                                                            strokeWidth="7"
                                                            fill="transparent"
                                                            strokeDasharray={dashArray}
                                                            strokeDashoffset={dashOffset}
                                                            className="transition-all duration-500 ease-out"
                                                        />
                                                    );
                                                });
                                            })()}
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                                            <span className="text-[38px] font-['Montserrat'] font-bold text-[#002940] leading-none">
                                                {analytics?.totalDonors || 0}
                                            </span>
                                            <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mt-1.5">
                                                Total Records
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {bloodTypes.map((item) => {
                                        const circleRadius = 34;
                                        const circumference = 2 * Math.PI * circleRadius; 
                                        const strokeDashoffset = `${(item.pct / 100) * circumference + 1.5} ${circumference}`;

                                        return (
                                            <div 
                                                key={item.bloodType} 
                                                className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-4 flex flex-row items-center justify-between shadow-sm min-w-0"
                                            >
                                                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                                                        <circle cx="40" cy="40" r={circleRadius} className="stroke-gray-100" strokeWidth="8" fill="transparent" />
                                                        <circle
                                                            cx="40"
                                                            cy="40"
                                                            r={circleRadius}
                                                            stroke={item.color}
                                                            strokeWidth="8"
                                                            fill="transparent"
                                                            strokeDasharray={circumference}
                                                            strokeDashoffset={strokeDashoffset}
                                                            strokeLinecap="round"
                                                            className="transition-all duration-500 ease-out"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center px-1 text-center">
                                                        <span className={`${item.bloodType.includes('Golden') || item.bloodType.includes('null') ? 'text-[8px] leading-tight' : 'text-[16px]'} font-['Montserrat'] font-bold text-[#002940] break-words line-clamp-2`}>
                                                            {item.bloodType.includes('Golden') || item.bloodType.includes('null') ? "Rh-null" : item.bloodType}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right flex flex-col justify-center">
                                                    <span className="text-[26px] font-['Montserrat'] font-bold text-[#002940] leading-none">
                                                        {item.count}
                                                    </span>
                                                    <span className="text-[12px] text-gray-400 font-medium mt-1">
                                                        {item.pct.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Campaign Performance Analytics */}
                    <section id="results-top" className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Event Performance
                                </h2>
                                <p className="text-[16px] text-gray-500 mt-1">
                                    Comparative review of targeted blood bag extractions against actual performance.
                                </p>
                            </div>

                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-[40px] bg-white border-2 border-[#c0cad0] rounded-[8px] px-3 text-[14px] font-semibold text-[#002940] outline-none focus:border-[#002940] cursor-pointer shadow-sm"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest_yield">Highest Blood Yield</option>
                                <option value="lowest_yield">Lowest Blood Yield</option>
                                <option value="highest_goal">Highest Extraction Goal</option>
                            </select>
                        </div>

                        <div className="mt-8 flex flex-col gap-6">
                            {currentEvents.map((event) => {
                                const rawPercent = event.extractionGoal > 0 ? (event.totalBagsProduced / event.extractionGoal) * 100 : 0;
                                const safeWidth = Math.min(rawPercent, 100);
                                const hitTarget = rawPercent >= 100;

                                return (
                                    <div key={`chart-${event.id}`} className="grid grid-cols-1 lg:grid-cols-4 items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="lg:col-span-1">
                                            <p className="font-['Montserrat'] font-bold text-[#002940] truncate">
                                                {event.name}
                                            </p>
                                            <p className="text-[14px] text-gray-400 font-medium">
                                                {event.date} • {event.partner}
                                            </p>
                                        </div>

                                        <div className="lg:col-span-3 flex items-center gap-4 w-full">
                                            <div className="flex-1 relative h-7 bg-[#e2e8ec] rounded-md overflow-hidden shadow-inner">
                                                <div 
                                                    className={`absolute top-0 left-0 h-full rounded-md transition-all duration-500 ease-out ${hitTarget ? 'bg-[#4ade80]' : 'bg-[#fd5448]'}`}
                                                    style={{ width: `${safeWidth}%` }}
                                                >
                                                    <div className="absolute top-0 left-0 w-full h-full bg-white/10" />
                                                </div>
                                            </div>
                                            
                                            <div className="w-[100px] flex flex-col text-right shrink-0">
                                                <span className={`text-[16px] font-bold ${hitTarget ? 'text-[#4ade80]' : 'text-[#002940]'}`}>
                                                    {event.totalBagsProduced} / {event.extractionGoal}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {totalPages > 1 && (
                                <div className="mt-5 flex flex-row items-center justify-between gap-5 border-t-2 border-[#e2e8f0] pt-4">
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
                                        disabled={currentPage >= totalPages}
                                        className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Extraction Statistics */}
                    <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Extraction Goal Progress
                        </h2>

                        <div className="mt-[0.25in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                                <p className="text-[18px] font-semibold text-[#002940]">Target Bags</p>
                                <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                    {analytics?.totalBagsProduced || 0} / {analytics?.extractionGoal || 0}
                                </p>
                            </div>

                            <div className="mt-5 w-full h-[24px] bg-white border-2 border-[#c0cad0] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#002940] transition-all duration-1000 ease-out"
                                    style={{ width: `${analytics?.extractionProgress || 0}%` }}
                                ></div>
                            </div>

                            <p className="mt-4 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {Number(analytics?.extractionProgress || 0).toFixed(2)}%
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}