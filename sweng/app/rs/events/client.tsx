"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderRS";
import StaffDetails from "@/components/StaffDetails";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";
type EventTab = EventStatus | "All";

export type AssignedEvent = {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    partner: string;
    status: EventStatus;
};

type Props = {
    assignedEvents: AssignedEvent[];
};

export default function RSClient({
    assignedEvents,
}: Props) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<EventTab>("Ongoing");

    const tabs: EventTab[] = ["Ongoing", "Upcoming", "Completed", "All"];

const filteredEvents =
    activeTab === "All"
        ? assignedEvents
        : assignedEvents.filter((event) => event.status === activeTab);

const openEvent = (event: AssignedEvent) => {
    if (event.status === "Ongoing") {
        router.push(`/rs/events/${event.id}`);
    }
};

const getTab = (tab: EventTab) => {
    let className =
        "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

    if (activeTab === tab) {
        className +=
            "bg-[#002940] border-[#002940] text-white font-bold";
    } else {
        className +=
            "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
    }

    return className;
};

const createActionButton = (event: AssignedEvent) => {
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
                {/* Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        My Events
                    </h1>
                </section>

                {/* Staff Details */}
                <StaffDetails />

                {/* Assigned Events */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                Assigned Events
                            </h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-row flex-wrap gap-[10px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                    }}
                                    className={getTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Event Cards */}
                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                            >
                                {/* Event Header */}
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

                                {/* Event Details */}
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
                                            {event.location}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Date:
                                            </span>{" "}
                                            {event.date}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Time:
                                            </span>{" "}
                                            {event.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
