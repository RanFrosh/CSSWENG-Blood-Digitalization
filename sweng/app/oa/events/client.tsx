"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/headers/HeaderOA";
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

    const [eventSearch, setEventSearch] = useState("");
    const [eventSort, setEventSort] = useState<"newest" | "oldest">("newest");
    const [eventPage, setEventPage] = useState(1);

    const resultsPerPage = 5;

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

    const filteredEvents = [...assignedEvents]
    .filter((event) => {
        if (eventSearch.trim() === "") return true;

        const query = eventSearch.trim().toLowerCase();

        return (
            event.name.toLowerCase().includes(query) ||
            event.partner.toLowerCase().includes(query) ||
            event.city.toLowerCase().includes(query) ||
            event.province.toLowerCase().includes(query)
        );
    })
    .sort((a, b) => {
        const dateA = new Date(a.event_date).getTime();
        const dateB = new Date(b.event_date).getTime();

        return eventSort === "newest"
            ? dateB - dateA
            : dateA - dateB;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEvents.length / resultsPerPage)
    );

    const safePage = Math.min(eventPage, totalPages);

    const eventsToDisplay = filteredEvents.slice(
        (safePage - 1) * resultsPerPage,
        safePage * resultsPerPage
    );
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
                                onClick={() => {
                                    onTabChange(tab);
                                    setEventSearch("");
                                    setEventSort("newest");
                                    setEventPage(1);
                                }}
                                className={getTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                        </div>
                    </div>

                    <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                        <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                            Filters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.2in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Search Events
                                </label>

                                <input
                                    type="text"
                                    value={eventSearch}
                                    onChange={(e) => {
                                        setEventSearch(e.target.value);
                                        setEventPage(1);
                                    }}
                                    placeholder="Input event name, partner, or location"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Sort by Date
                                </label>

                                <select
                                    value={eventSort}
                                    onChange={(e) => {
                                        setEventSort(
                                            e.target.value as "newest" | "oldest"
                                        );
                                        setEventPage(1);
                                    }}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[0.15in]">
                        <p className="text-[16px] text-[#002940]">
                            Showing {filteredEvents.length} result/s
                        </p>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {eventsToDisplay.map((event) => (
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

                        {filteredEvents.length === 0 && (
                            <div className="p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#c0cad0] rounded-[16px] bg-[#f9fdff]">
                                <p className="text-[20px] font-semibold text-[#002940] mb-2">No events found</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex flex-row items-center justify-between gap-5">
                        <button
                            type="button"
                            onClick={() =>
                                setEventPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={safePage === 1}
                            className={`px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[18px] font-semibold transition ${
                                safePage === 1
                                    ? "text-[#c0cad0] cursor-not-allowed"
                                    : "text-[#002940] cursor-pointer hover:underline hover:text-[#fd5448]"
                            }`}
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940] font-semibold">
                            Page {safePage} of {totalPages}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setEventPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                            disabled={safePage === totalPages}
                            className={`px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[18px] font-semibold transition ${
                                safePage === totalPages
                                    ? "text-[#c0cad0] cursor-not-allowed"
                                    : "text-[#002940] cursor-pointer hover:underline hover:text-[#fd5448]"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>

        </main>
    );
}
