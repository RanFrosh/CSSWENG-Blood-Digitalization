"use client";
import { useState, useEffect } from "react";
import { EventStatusType } from "@/db/enums/event_status";
import { ViewEventsWithProvince } from "@/types/event_type";
import { ReadProfile } from "@/types/profile_type";
import Header from "@/components/headers/HeaderOA";
import OAEventsClient from "./client";
import { executeEventQueryStaff } from "../../../actions/event_action";
import { fetchOACurrentUser } from "../../../actions/oa_action";

type EventTab = EventStatusType | "All";

export default function OAEventsPage() {
    const [activeTab, setActiveTab] = useState<EventTab>("Ongoing");

    const [events, setEvents] = useState<ViewEventsWithProvince[]>([]);
    const [staff, setStaff] = useState<ReadProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const [eventsRes, profileRes] = await Promise.all([
                    executeEventQueryStaff(
                        activeTab !== "All" ? { status: activeTab } : {}
                    ),
                    fetchOACurrentUser(),
                ]);

                if (eventsRes.success && eventsRes.data) {
                    setEvents(eventsRes.data);
                } else {
                    setErrorMessage(eventsRes.message);
                }

                if (profileRes.success && profileRes.data) {
                    setStaff(profileRes.data);
                }
            } catch (error) {
                setErrorMessage("Failed to connect to the database");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
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

    return (
        <OAEventsClient
            assignedEvents={events}
            staff={staff}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />
    );
}
