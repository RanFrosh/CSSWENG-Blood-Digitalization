"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/HeaderOA";
import StaffDetails from "@/components/StaffDetails";
import { ViewEventsWithProvince } from "@/types/event_type";
import { EventStatusType } from "@/db/enums/event_status";
import { ReadProfile } from "@/types/profile_type";

type EventTab = EventStatusType | "All";

type Props = {
    assignedEvents: ViewEventsWithProvince[];
    staff: ReadProfile | null;
    activeTab: EventTab;
    onTabChange: (tab: EventTab) => void;
};

export default function OAEventsClient({
    assignedEvents,
    staff,
    activeTab,
    onTabChange,
}: Props) {
    const router = useRouter();

    const tabs: EventTab[] = ["Ongoing", "Upcoming", "Completed", "All"];

    const openEvent = (event: ViewEventsWithProvince) => {
        if (event.status === "Ongoing") {
            router.push(`/oa/events/${event.id}`);
        }
    };

    const getTab = (tab: EventTab) => {
        let className = "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

        if (activeTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className += "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };

    const createActionButton = (event: ViewEventsWithProvince) => {
        if (event.status !== "Ongoing") {
            return null;
        }

        return (
            <button
                onClick={() => openEvent(event)}
                className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
            >
                Open Event
            </button>
        );
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                    Welcome, {staff?.name || "Admin"}!
                </h1>
            </section>

                <StaffDetails />

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Assigned Events
                        </h2>

                        <div className="flex flex-row flex-wrap gap-[10px] items-center">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={getTab(tab)}
                                    >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {assignedEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                            >
                                <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center gap-[0.15in]">
                                        <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                        {event.name}
                                        </h2>

                                        <span className="px-[12px] py-[6px] rounded-full text-[16px] font-semibold bg-white text-[#002940]">
                                        {event.status}
                                        </span>
                                    </div>

                                    {createActionButton(event)}
                                </div>

                                <div className="p-[0.35in]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                        <p>
                                        <span className="font-semibold text-[#002940]">
                                            Partner:
                                        </span>{" "}
                                        {event.partner}
                                        </p>

                                        <p>
                                        <span className="font-semibold text-[#002940]">
                                            Location:
                                        </span>{" "}
                                        {event.city}, {event.province}
                                        </p>

                                        <p>
                                        <span className="font-semibold text-[#002940]">
                                            Date:
                                        </span>{" "}
                                        {event.event_date}
                                        </p>

                                        <p>
                                        <span className="font-semibold text-[#002940]">
                                            Time:
                                        </span>{" "}
                                        {event.start_time && event.end_time ? `${event.start_time} - ${event.end_time}` : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {assignedEvents.length === 0 && (
                            <div className="p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#c0cad0] rounded-[16px] bg-[#f9fdff]">
                                <p className="text-[20px] font-semibold text-[#002940] mb-2">No events found</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

        </main>
    );
}
