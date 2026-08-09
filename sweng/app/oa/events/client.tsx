"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/HeaderOA";
import StaffDetails from "@/components/StaffDetails";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";
type EventTab = EventStatus | "All";

// Fixed Type Collision: Changed from 'StaffDetails' to 'StaffProfile'
// so it doesn't clash with your imported <StaffDetails /> component!
export type StaffProfile = {
    id: string;
    name: string;
    role: string;
};

export type AssignedEvent = {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    partner: string;
    status: EventStatus;
};

export default function OAEventsClient({
    assignedEvents,
    staff, // Keeping this prop available in case you need to pass it into <StaffDetails /> later!
}: {
    assignedEvents: AssignedEvent[];
    staff: StaffProfile | null;
}) {
    const router = useRouter();
    
    // Tab State
    const [activeTab, setActiveTab] = useState<EventTab>("Ongoing");
    const tabs: EventTab[] = ["Ongoing", "Upcoming", "Completed", "All"];

    // Restored Join Modal State!
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [eventCode, setEventCode] = useState("");

    const filteredEvents =
        activeTab === "All"
        ? assignedEvents
        : assignedEvents.filter((event) => event.status === activeTab);

    const openEvent = (event: AssignedEvent) => {
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

    const openJoinModal = () => {
        setEventCode("");
        setIsJoinModalOpen(true);
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

                {/* You might need to pass `staff` in here eventually if this component expects it: <StaffDetails staff={staff} /> */}
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
                                    onClick={() => setActiveTab(tab)}
                                    className={getTab(tab)}
                                    >
                                    {tab}
                                </button>
                            ))}

                            {/* Restored Join Event Button */}
                            <button
                                type="button"
                                onClick={openJoinModal}
                                className="px-[20px] py-[10px] rounded-full bg-[#002940] border-2 border-[#002940] text-white font-bold text-[16px] cursor-pointer hover:bg-white hover:text-[#002940] transition"
                            >
                                + Join Event
                            </button>
                        </div>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {filteredEvents.map((event) => (
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

                        {filteredEvents.length === 0 && (
                            <div className="p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#c0cad0] rounded-[16px] bg-[#f9fdff]">
                                <p className="text-[20px] font-semibold text-[#002940] mb-2">No events found</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Restored Modal */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Join Event
                        </h2>

                        <form className="mt-[0.2in] flex flex-col gap-[0.15in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Event Code
                                </label>
                                <input
                                    type="text"
                                    value={eventCode}
                                    onChange={(event) => setEventCode(event.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                    placeholder="Enter code..."
                                />
                            </div>

                            <div className="mt-[0.2in] flex flex-row justify-end gap-[10px]">
                                <button
                                    type="button"
                                    onClick={() => setIsJoinModalOpen(false)}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        console.log("Joining with code:", eventCode);
                                        setIsJoinModalOpen(false);
                                    }}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90"
                                >
                                    Join Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}