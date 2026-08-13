"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderSA";
import { executeQueryAllEvents } from "@/app/event_records/event_action";
import { ViewEventsWithProvince } from "@/types/event_type";

type TabFilter = "All" | ViewEventsWithProvince["status"];

type SortOption =
    | "Default"
    | "Date: Earliest"
    | "Date: Latest"
    | "Target Bags: High to Low"
    | "Target Bags: Low to High"
    | "Name: A-Z";

export default function SAEventLogsSearchPage() {
    const router = useRouter();

    const PAGE_SIZE = 8;

    const [events, setEvents] = useState<ViewEventsWithProvince[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState("");

    const [activeTab, setActiveTab] = useState<TabFilter>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadEvents = async () => {
            setEventsLoading(true);
            setEventsError("");
            const result = await executeQueryAllEvents();
            if (result.success && result.data) {
                setEvents(result.data);
            } else {
                setEventsError(result.message);
                setEvents([]);
            }
            setEventsLoading(false);
        };
        loadEvents();
    }, []);

    const tabs: TabFilter[] = ["All", "Ongoing", "Upcoming", "Completed"];

    const sortOptions: SortOption[] = [
        "Default",
        "Date: Earliest",
        "Date: Latest",
        "Target Bags: High to Low",
        "Target Bags: Low to High",
        "Name: A-Z",
    ];

    const formatEventId = (event: ViewEventsWithProvince): string => {
        const year = event.event_date.split("-")[0];
        return `EVT-${year}-${event.id}`;
    };

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
                formatEventId(event).toLowerCase().includes(query)
        );
    }

    filteredEvents.sort((a, b) => {
        if (sortBy === "Date: Earliest") {
            return a.event_date.localeCompare(b.event_date);
        } else if (sortBy === "Date: Latest") {
            return b.event_date.localeCompare(a.event_date);
        } else if (sortBy === "Target Bags: High to Low") {
            return Number(b.target_blood) - Number(a.target_blood);
        } else if (sortBy === "Target Bags: Low to High") {
            return Number(a.target_blood) - Number(b.target_blood);
        } else if (sortBy === "Name: A-Z") {
            return a.name.localeCompare(b.name);
        }

        return 0;
    });

    const pageCount = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const pagedEvents = filteredEvents.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

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

    const getStatusPill = (status: ViewEventsWithProvince["status"]) => {
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

    if (eventsLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading events...</p>
                </div>
            </main>
        );
    }

    if (eventsError) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">{eventsError}</p>
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
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setPage(1);
                                    }}
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
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setPage(1);
                                    }}
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
                                    onChange={(event) => {
                                        setSortBy(
                                            event.target.value as SortOption
                                        );
                                        setPage(1);
                                    }}
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
                        {pagedEvents.length === 0 ? (
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
                            pagedEvents.map((event) => (
                                <div
                                    key={event.id.toString()}
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
                                                viewEventLogs(
                                                    event.id.toString()
                                                )
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
                                                    {formatEventId(event)}
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
                                                    {event.event_date}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Target Collection:
                                                    </span>{" "}
                                                    {Number(event.target_blood)}{" "}
                                                    Bags
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Current Collected:
                                                    </span>{" "}
                                                    {Number(
                                                        event.produced_bags
                                                    )}{" "}
                                                    Bags
                                                </p>
                                            </div>

                                            <div className="w-full h-[1.6in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={event.img_url ?? "/images/event.png"}
                                                    alt={event.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/event.png"; }}
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
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940]">
                            Page {currentPage} of {pageCount}
                        </p>

                        <button
                            type="button"
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage >= pageCount}
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
