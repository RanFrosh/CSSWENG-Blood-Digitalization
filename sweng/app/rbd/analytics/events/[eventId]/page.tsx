import Link from "next/link";
import Header from "@/components/headers/HeaderRBD";
import { fetchEventAnalytics } from "@/actions/rbd_action";
import { EventDetailsPanel } from "@/components/EventDetailsPanel";

export default async function EventAnalyticsDetailsPage({
    params,
}: {
    params: Promise<{ eventId: string }> | { eventId: string };
}) {
    const resolvedParams = await params;
    const { eventId } = resolvedParams;

    const result = await fetchEventAnalytics(eventId);

    if (!result?.success || !result?.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Analytics Not Found
                        </h1>
                        <p className="mt-[10px] text-[18px] text-[#002940]">
                            {result?.message || "The selected event does not have available analytics."}
                        </p>

                        <Link
                            href="/rbd/analytics/events"
                            className="mt-[0.25in] inline-block px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold hover:bg-[#fd5448] transition-colors"
                        >
                            Back to Event Analytics
                        </Link>
                    </section>
                </div>
            </main>
        );
    }

    const selectedEvent = result.data;
    
    const progressPct = selectedEvent.extractionGoal > 0 
        ? Math.min(((selectedEvent.totalBagsProduced / selectedEvent.extractionGoal) * 100), 100) 
        : 0;

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

                {/* Event Details Panel */}
                <EventDetailsPanel event={selectedEvent} />

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Analytics Summary
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Total Donors</p>
                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.totalDonors}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Blood Donated</p>
                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.bloodDonated}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Total Bags Produced</p>
                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.totalBagsProduced}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Extraction Success Rate</p>
                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.successRate}
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
                        
                        const totalUnits = selectedEvent?.bloodTypes?.reduce((sum: number, item: any) => sum + (item?.count || 0), 0) || 0;
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
                                            
                                            {selectedEvent?.bloodTypes?.map((bloodType: any) => {
                                                if (!bloodType || !bloodType.count) return null;
                                                
                                                const typeStr = bloodType?.bloodType || '';
                                                const fillColor = colorMap[typeStr] || '#DC2626';

                                                const percentage = totalUnits > 0 ? (bloodType.count / totalUnits) * 100 : 0;
                                                const strokeLength = (percentage / 100) * mainCircumference;
                                                const strokeGap = mainCircumference - strokeLength;
                                                const strokeOffset = -((accumulatedPercentage / 100) * mainCircumference);
                                                
                                                accumulatedPercentage += percentage;

                                                return (
                                                    <circle
                                                        key={`main-donut-${typeStr}`}
                                                        cx="70" cy="70" r={mainRadius}
                                                        fill="transparent"
                                                        stroke={fillColor}
                                                        strokeWidth="14"
                                                        strokeDasharray={`${strokeLength} ${strokeGap}`}
                                                        strokeDashoffset={strokeOffset}
                                                        className="transition-all duration-500 ease-out"
                                                    />
                                                );
                                            })}
                                        </svg>
                                        
                                        <div className="absolute inset-0 flex flex-col items-center justify-center font-['Montserrat']">
                                            <span className="text-[32px] font-bold text-[#002940]">{totalUnits}</span>
                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Donors</span>
                                        </div>
                                    </div>

                                    {/* Right Side: Grid of Independent Distribution Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1 w-full">
                                        {selectedEvent?.bloodTypes?.map((bloodType: any) => {
                                            if (!bloodType) return null;

                                            const typeStr = bloodType?.bloodType || '';
                                            const fillColor = colorMap[typeStr] || '#DC2626';
                                            const count = bloodType.count || 0;
                                            const percentage = totalUnits > 0 ? (count / totalUnits) * 100 : 0;

                                            // Independent Ring Setup
                                            const miniRadius = 34;
                                            const miniCircumference = 2 * Math.PI * miniRadius;
                                            const miniStrokeOffset = miniCircumference - (percentage / 100) * miniCircumference;

                                            return (
                                                <div
                                                    key={typeStr}
                                                    className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-4 flex flex-row items-center justify-between gap-3 min-w-0 shadow-sm"
                                                >
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
                                                        
                                                        <div className="absolute inset-0 flex items-center justify-center text-center px-1.5">
                                                            <span className={`${typeStr.includes('Golden') ? 'text-[9px] leading-tight px-0.5' : 'text-[18px]'} font-['Montserrat'] font-bold text-[#002940] break-words line-clamp-3`}>
                                                                {typeStr}
                                                            </span>
                                                        </div>
                                                    </div>

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
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/rbd/analytics/events"
                        className="mt-[0.35in] inline-block bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold hover:bg-[#fd5448] hover:border-[#fd5448] hover:text-white transition-colors"
                    >
                        Back to Event List
                    </Link>
                    
                </section>
            </div>
        </main>
    );
}