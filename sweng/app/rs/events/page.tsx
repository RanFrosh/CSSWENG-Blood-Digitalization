"use client";
import { useState, useEffect } from "react";
import { EventStatusType } from "@/db/enums/event_status";
import { ViewEventsWithProvince } from "@/types/event_type";
import Header from "@/components/headers/HeaderRS";
import StaffDetails from "@/components/StaffDetails";
import RSClient from "./client";
import { executeEventQueryStaff } from "../../../actions/event_action";

type EventTab = EventStatusType | "All";

export default function RSEventsPage() {
    const [activeTab, setActiveTab] = useState<EventTab>("Ongoing");

    const [events, setEvents] = useState<ViewEventsWithProvince[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const result = await executeEventQueryStaff(
                    activeTab !== "All" ? { status: activeTab } : {}
                );
                if (result.success && result.data) {
                    setEvents(result.data);
                } else {
                    setErrorMessage(result.message);
                }
            } catch (error) {
                setErrorMessage("Failed to connect to the database");
            } finally {
                setIsLoading(false);
            }
        };
        loadEvents();
    }, [activeTab]);

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading events...</p>
                </div>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">{errorMessage}</p>
                </div>
            </main>
        );
    }

    return <RSClient assignedEvents={events} activeTab={activeTab} onTabChange={setActiveTab} />;
}
