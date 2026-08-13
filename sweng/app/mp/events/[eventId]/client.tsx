"use client";

import { useRouter } from "next/navigation";
import { EventStatusType } from "@/db/enums/event_status";
import { ViewEventsWithProvince } from "@/types/event_type";

type EventTab = EventStatusType | "All";

export default function MPEventsClient({
    initialEvents,
    currentTab,
}: {
    initialEvents: ViewEventsWithProvince[];
    currentTab: EventTab;
}) {
    const router = useRouter();
    const tabs: EventTab[] = ["Ongoing", "Upcoming", "Completed", "All"];

    const openEvent = (event: ViewEventsWithProvince) => {
        if (event.status === "Ongoing") {
            router.push(`/mp/events/${event.id}`);
        }
    };

    const handleTabClick = (tab: EventTab) => {
        router.push(`/mp/events?tab=${tab}`);
    };

    const getTabClass = (tab: EventTab) => {
        return `px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ${
            currentTab === tab
                ? "bg-[#002940] border-[#002940] text-white font-bold"
                : "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white"
        }`;
    };

    return (
        <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
            <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                <div>
                    <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                        Assigned Events
                    </h2>
                </div>

                <div className="flex flex-row flex-wrap gap-[10px]">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => handleTabClick(tab)} className={getTabClass(tab)}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                {initialEvents.length === 0 ? (
                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                        <p className="text-[18px] font-semibold text-[#002940]">
                            No {currentTab.toLowerCase()} events found.
                        </p>
                        <p className="mt-1 text-[16px] text-[#5c6b73]">
                            Try selecting a different tab.
                        </p>
                    </div>
                ) : (
                    initialEvents.map((event) => (
                        <div key={event.id} className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm">
                            <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center gap-[0.15in]">
                                    <h2 className="text-[24px] font-['Montserrat'] font-bold">{event.name}</h2>
                                    <span className="px-[12px] py-[6px] rounded-full text-[16px] font-semibold bg-white text-[#002940]">
                                        {event.status}
                                    </span>
                                </div>
                                {event.status === "Ongoing" && (
                                    <button
                                        onClick={() => openEvent(event)}
                                        className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
                                    >
                                        Open Event
                                    </button>
                                )}
                            </div>
                            <div className="p-[0.35in]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                    <p><span className="font-semibold text-[#002940]">Partner:</span> {event.partner}</p>
                                    <p><span className="font-semibold text-[#002940]">Location:</span> {event.city}, {event.province}</p>
                                    <p><span className="font-semibold text-[#002940]">Date:</span> {event.event_date}</p>
                                    <p><span className="font-semibold text-[#002940]">Time:</span> {event.start_time && event.end_time ? `${event.start_time} - ${event.end_time}` : "—"}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}