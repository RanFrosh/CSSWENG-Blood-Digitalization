"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderRBD";

type BloodTypeData = {
    bloodType: string;
    count: number;
};

type EventAnalyticsDetails = {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    partner: string;
    totalDonors: number;
    bloodDonated: string;
    totalBagsProduced: number;
    showUpRate: string;
    extractionGoal: number;
    extractionProgress: number;
    bloodTypes: BloodTypeData[];
};

const events: EventAnalyticsDetails[] = [
    {
        id: "1",
        name: "Blood Donation Drive",
        location: "DLSU",
        date: "2026-07-15",
        time: "9:00 AM - 4:00 PM",
        partner: "Manila Doctors Hospital",
        totalDonors: 120,
        bloodDonated: "25200 mL",
        totalBagsProduced: 72,
        showUpRate: "85%",
        extractionGoal: 100,
        extractionProgress: 72,
        bloodTypes: [
            { bloodType: "O+", count: 24 },
            { bloodType: "A+", count: 16 },
            { bloodType: "B+", count: 14 },
            { bloodType: "AB+", count: 8 },
            { bloodType: "O-", count: 5 },
            { bloodType: "A-", count: 3 },
            { bloodType: "B-", count: 1 },
            { bloodType: "AB-", count: 1 },
            { bloodType: 'Rh-null', count: 0 },
        ],
    }
];

export default function EventAnalyticsDetailsPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    const selectedEvent = events.find((event) => {
        return event.id === eventId;
    });

    const goBack = () => {
        location.href = `/rbd/analytics/events/`;
    };

    if (selectedEvent === undefined) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />

                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Analytics Not Found
                        </h1>

                        <p className="mt-[10px] text-[18px] text-[#002940]">
                            The selected event does not have available analytics.
                        </p>

                        <button
                            type="button"
                            onClick={goBack}
                            className="mt-[0.25in] px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold cursor-pointer hover:bg-[#fd5448] transition"
                        >
                            Back to Event Analytics
                        </button>
                    </section>
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
                        Event Analytics
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <div>
                            <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.name}
                            </h2>
                        </div>

                        <span className="bg-[#002940] text-white px-5 py-3 rounded-full text-[18px] font-semibold">
                            Event ID: {selectedEvent.id}
                        </span>
                    </div>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                        <p>
                            <span className="font-semibold text-[#002940]">
                                Partner:
                            </span>{" "}
                            {selectedEvent.partner}
                        </p>

                        <p>
                            <span className="font-semibold text-[#002940]">
                                Location:
                            </span>{" "}
                            {selectedEvent.location}
                        </p>

                        <p>
                            <span className="font-semibold text-[#002940]">
                                Date:
                            </span>{" "}
                            {selectedEvent.date}
                        </p>

                        <p>
                            <span className="font-semibold text-[#002940]">
                                Time:
                            </span>{" "}
                            {selectedEvent.time}
                        </p>
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
                                {selectedEvent.totalDonors}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Blood Donated
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.bloodDonated}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Total Bags Produced
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.totalBagsProduced}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Show-up Rate
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.showUpRate}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-[0.35in]">
                    {(() => {
                        const colorMap: Record<string, string> = {
                            'O+': '#DC2626',  'O-': '#EF4444',
                            'A+': '#F87171',  'A-': '#FCA5A5',
                            'B+': '#FB923C',  'B-': '#FDBA74',
                            'AB+': '#9CA3AF', 'AB-': '#D1D5DB',
                            'Rh-null (or "Golden Blood")': '#EAB308'
                        };
                        
                        const totalUnits = selectedEvent?.bloodTypes?.reduce((sum, item) => sum + (item?.count || 0), 0) || 0;
                        const mainRadius = 50;
                        const mainCircumference = 2 * Math.PI * mainRadius;
                        let accumulatedPercentage = 0;

                        return (
                            <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Blood Type Distribution
                                </h2>

                                <div className="mt-[0.25in] flex flex-col xl:flex-row items-center gap-10">
                                    
                                    {/* Left Side: Master Combined Donut Chart */}
                                    <div className="relative w-56 h-56 shrink-0 flex items-center justify-center">
                                        <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90">
                                            <circle cx="70" cy="70" r={mainRadius} fill="transparent" stroke="#F3F4F6" strokeWidth="14" />
                                            
                                            {selectedEvent?.bloodTypes?.map((bloodType) => {
                                                if (!bloodType || !bloodType.count) return null;
                                                
                                                const typeStr = bloodType?.bloodType || '';
                                                const fillColor = colorMap[typeStr] || '#DC2626';

                                                const percentage = totalUnits > 0 ? (bloodType.count / totalUnits) * 100 : 0;
                                                const strokeLength = (percentage / 100) * mainCircumference;
                                                const strokeOffset = mainCircumference - ((accumulatedPercentage / 100) * mainCircumference);
                                                
                                                accumulatedPercentage += percentage;

                                                return (
                                                    <circle
                                                        key={`main-donut-${typeStr}`}
                                                        cx="70" cy="70" r={mainRadius}
                                                        fill="transparent"
                                                        stroke={fillColor}
                                                        strokeWidth="14"
                                                        strokeDasharray={`${strokeLength} ${mainCircumference}`}
                                                        strokeDashoffset={strokeOffset}
                                                        className="transition-all duration-500 ease-out"
                                                    />
                                                );
                                            })}
                                        </svg>
                                        
                                        <div className="absolute inset-0 flex flex-col items-center justify-center font-['Montserrat']">
                                            <span className="text-[32px] font-bold text-[#002940]">{totalUnits}</span>
                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Units</span>
                                        </div>
                                    </div>

                                    {/* Right Side: Grid of 9 Independent Distribution Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1 w-full">
                                        {selectedEvent?.bloodTypes?.map((bloodType) => {
                                            if (!bloodType) return null;

                                            const typeStr = bloodType?.bloodType || '';
                                            const fillColor = colorMap[typeStr] || '#DC2626';
                                            const count = bloodType.count || 0;
                                            const percentage = totalUnits > 0 ? (count / totalUnits) * 100 : 0;

                                            // Independent Ring Setup (Radius matching donor analytics style configuration)
                                            const miniRadius = 34;
                                            const miniCircumference = 2 * Math.PI * miniRadius;
                                            const miniStrokeOffset = miniCircumference - (percentage / 100) * miniCircumference;

                                            return (
                                                <div
                                                    key={typeStr}
                                                    className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-4 flex flex-row items-center justify-between gap-3 min-w-0 shadow-sm"
                                                >
                                                    {/* Modular Mini Donut Ring Layout Component */}
                                                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                                                            <circle
                                                                cx="40" cy="40" r={miniRadius}
                                                                className="stroke-gray-100"
                                                                strokeWidth="6.5"
                                                                fill="transparent"
                                                            />
                                                            <circle
                                                                cx="40" cy="40" r={miniRadius}
                                                                style={{ stroke: fillColor }}
                                                                strokeWidth="6.5"
                                                                fill="transparent"
                                                                strokeDasharray={miniCircumference}
                                                                strokeDashoffset={miniStrokeOffset}
                                                                strokeLinecap="round"
                                                                className="transition-all duration-500 ease-out"
                                                            />
                                                        </svg>
                                                        
                                                        {/* Center Text Container with safety sizing hooks for Rh-null text scaling */}
                                                        <div className="absolute inset-0 flex items-center justify-center text-center px-1.5">
                                                            <span className={`${typeStr.includes('Golden') ? 'text-[9px] leading-tight px-0.5' : 'text-[18px]'} font-['Montserrat'] font-bold text-[#002940] break-words line-clamp-3`}>
                                                                {typeStr}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Metric Readings Output block */}
                                                    <div className="text-right shrink-0">
                                                        <p className="text-[26px] font-['Montserrat'] font-bold text-[#002940] leading-none">
                                                            {count}
                                                        </p>
                                                        <p className="text-[13px] font-['Montserrat'] font-medium text-gray-400 mt-1">
                                                            {percentage.toFixed(1)}%
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            </div>
                        );
                    })()}

                    {/* Target Extraction Goals Segment Indicator */}
                    <div className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Extraction Goal Progress
                        </h2>

                        <div className="mt-[0.25in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Target Bags
                                </p>

                                <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                    {selectedEvent.totalBagsProduced} / {selectedEvent.extractionGoal}
                                </p>
                            </div>

                            <div className="mt-5 w-full h-[24px] bg-white border-2 border-[#c0cad0] rounded-full overflow-hidden">
                                <div
                                    className="bg-[#fd5448] h-full transition-all duration-500 ease-out"
                                    style={{ width: `${Math.min(((selectedEvent.totalBagsProduced / selectedEvent.extractionGoal) * 100), 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}