"use client";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderRBD";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";

type EventAnalytics = {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    partner: string;
    status: EventStatus;
};

const events: EventAnalytics[] = [
    {
        id: "1",
        name: "Blood Donation Drive",
        location: "DLSU",
        date: "2026-07-15",
        time: "9:00 AM - 4:00 PM",
        partner: "Manila Doctors Hospital",
        status: "Ongoing",
    },
    {
        id: "2",
        name: "Name 2",
        location: "Location 2",
        date: "Date 2",
        time: "Time 2",
        partner: "Partner 2",
        status: "Upcoming",
    },
    {
        id: "3",
        name: "Name 3",
        location: "Location 3",
        date: "Date 3",
        time: "Time 3",
        partner: "Partner 3",
        status: "Completed",
    },
];

export default function EventAnalyticsPage() {
    const router = useRouter();

    // for some reason this specific folder keeps bugging so im using direct link lmao
    const viewEventAnalytics = (eventId: string) => {
        location.href = `/rbd/analytics/events/${eventId}`;
    };

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

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Search Events
                    </h2>

                    <div className="mt-5 flex flex-row items-end gap-5">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Search by
                            </label>

                            <input
                                type="text"
                                placeholder="Input event name or partner"
                                className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>

                        <div className="w-[2in] flex flex-col gap-2">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Sort By
                            </label>

                            <select className="w-full h-[54px] border-2 border-[#c0cad0] rounded-[10px] px-4 text-[18px] outline-none focus:border-[#002940] bg-white">
                                <option>Default</option>
                                <option>Date</option>
                                <option>Partner</option>
                                <option>Status</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Events
                        </h2>

                        <p className="text-[18px] text-[#002940]">
                            Showing {events.length} event/s
                        </p>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {events.slice(0, 5).map((event) => (
                            <div
                                key={event.id}
                                className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                            >
                                <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between gap-5 flex-wrap">
                                    <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                        <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                            {event.name}
                                        </h2>

                                        <span className="px-[12px] py-[6px] rounded-full text-[16px] font-semibold bg-white text-[#002940]">
                                            {event.status}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            viewEventAnalytics(event.id);
                                        }}
                                        className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
                                    >
                                        View Analytics
                                    </button>
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

                    <div className="mt-5 flex flex-row items-center justify-between gap-5">
                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940]">
                            Page 1
                        </p>

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