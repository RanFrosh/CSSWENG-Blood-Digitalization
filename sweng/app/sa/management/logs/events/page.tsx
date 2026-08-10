"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderSA";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";

type BloodEvent = {
    id: string;
    name: string;
    partner: string;
    city: string;
    province: string;
    date: string;
    status: EventStatus;
    targetBags: number;
    collectedBags: number;
    imageLink: string;
};

const initialEvents: BloodEvent[] = [
    {
        id: "EVT-2026-001",
        name: "Blood Donation Drive",
        partner: "Manila Doctors Hospital",
        city: "Manila",
        province: "Metro Manila",
        date: "2026-07-15",
        status: "Ongoing",
        targetBags: 100,
        collectedBags: 72,
        imageLink: "/images/event.png",
    },
    {
        id: "EVT-2026-002",
        name: "Corporate CSR Bloodletting",
        partner: "BPO Partner Inc.",
        city: "Taguig",
        province: "Metro Manila",
        date: "2026-08-10",
        status: "Upcoming",
        targetBags: 150,
        collectedBags: 0,
        imageLink: "/images/event.png",
    },
    {
        id: "EVT-2026-003",
        name: "Alumni Association Drive",
        partner: "DLSU Alumni Chapter",
        city: "Manila",
        province: "Metro Manila",
        date: "2026-05-20",
        status: "Completed",
        targetBags: 80,
        collectedBags: 85,
        imageLink: "/images/event.png",
    },
];

type TabFilter = "All" | EventStatus;

type SortOption =
    | "Default"
    | "Date: Earliest"
    | "Date: Latest"
    | "Target Bags: High to Low"
    | "Target Bags: Low to High"
    | "Name: A-Z";

export default function SAEventLogsSearchPage() {
    const router = useRouter();

    const [events] = useState<BloodEvent[]>(initialEvents);
    const [activeTab, setActiveTab] = useState<TabFilter>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");

    const tabs: TabFilter[] = ["All", "Ongoing", "Upcoming", "Completed"];

    const sortOptions: SortOption[] = [
        "Default",
        "Date: Earliest",
        "Date: Latest",
        "Target Bags: High to Low",
        "Target Bags: Low to High",
        "Name: A-Z",
    ];

    let filteredEvents = [...events];

    if (activeTab !== "All") {
        filteredEvents = filteredEvents.filter(
            (event) => event.status === activeTab
        );
    }

    if (search.trim() !== "") {
        const query = search.trim().toLowerCase();

        filteredEvents = filteredEvents.filter(
            (event) =>
                event.name.toLowerCase().includes(query) ||
                event.partner.toLowerCase().includes(query) ||
                event.city.toLowerCase().includes(query) ||
                event.province.toLowerCase().includes(query) ||
                event.id.toLowerCase().includes(query)
        );
    }

    filteredEvents.sort((a, b) => {
        if (sortBy === "Date: Earliest") {
            return a.date.localeCompare(b.date);
        } else if (sortBy === "Date: Latest") {
            return b.date.localeCompare(a.date);
        } else if (sortBy === "Target Bags: High to Low") {
            return b.targetBags - a.targetBags;
        } else if (sortBy === "Target Bags: Low to High") {
            return a.targetBags - b.targetBags;
        } else if (sortBy === "Name: A-Z") {
            return a.name.localeCompare(b.name);
        }

        return 0;
    });

    const getTabClass = (tab: TabFilter) => {
        let className =
            "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

        if (activeTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className +=
                "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };

    const getStatusPill = (status: EventStatus) => {
        let className =
            "px-[12px] py-[6px] rounded-full text-[14px] font-semibold ";

        if (status === "Ongoing") {
            className += "bg-[#e4f5ea] text-[#1a7a3f]";
        } else if (status === "Upcoming") {
            className += "bg-[#e4eff5] text-[#002940]";
        } else {
            className += "bg-[#f5e4e4] text-[#a32626]";
        }

        return className;
    };

    const viewEventLogs = (eventId: string) => {
        router.push(`/sa/management/logs/events/${eventId}`);
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Super Admin
                    </p>

                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Logs
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                Select Event
                            </h2>
                        </div>

                        <div className="flex flex-row items-center flex-wrap gap-[10px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={getTabClass(tab)}
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

                        <div className="flex flex-row items-center justify-between flex-wrap gap-[0.2in]">
                            <div className="flex-1 min-w-[3in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Search by
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Input event name, partner, city, province, or ID"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                />
                            </div>

                            <div className="w-full sm:w-[3in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Sort By
                                </label>

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(
                                            event.target.value as SortOption
                                        )
                                    }
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[0.25in] text-[16px]">
                        <p>Showing {filteredEvents.length} result/s</p>
                    </div>

                    <div className="mt-[0.25in] flex flex-col gap-[0.25in]">
                        {filteredEvents.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No events found
                                </p>

                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different search term, sort option, or
                                    tab filter.
                                </p>
                            </div>
                        ) : (
                            filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                                >
                                    <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                        <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                            <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                                {event.name}
                                            </h2>

                                            <span
                                                className={getStatusPill(
                                                    event.status
                                                )}
                                            >
                                                {event.status}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                viewEventLogs(event.id)
                                            }
                                            className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:bg-[#f0f0f0]"
                                        >
                                            View Logs
                                        </button>
                                    </div>

                                    <div className="p-[0.35in]">
                                        <div className="grid grid-cols-1 xl:grid-cols-[1fr_2.6in] gap-[0.35in] items-start">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Event ID:
                                                    </span>{" "}
                                                    {event.id}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Corporate Partner:
                                                    </span>{" "}
                                                    {event.partner}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Location:
                                                    </span>{" "}
                                                    {event.city},{" "}
                                                    {event.province}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Scheduled Date:
                                                    </span>{" "}
                                                    {event.date}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Target Collection:
                                                    </span>{" "}
                                                    {event.targetBags} Bags
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Current Collected:
                                                    </span>{" "}
                                                    {event.collectedBags} Bags
                                                </p>
                                            </div>

                                            <div className="w-full h-[1.6in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={
                                                        event.imageLink ||
                                                        "/images/event-placeholder.png"
                                                    }
                                                    alt={event.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-5 flex flex-row items-center justify-between gap-5">
                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940]">Page 1</p>

                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}