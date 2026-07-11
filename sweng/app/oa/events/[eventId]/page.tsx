"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderOA";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";

// Sample event structure
type AssignedEvent = {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    partner: string;
    status: EventStatus;
};

// Sample event
const assignedEvents: AssignedEvent[] = [
    {
        id: "1",
        name: "Blood Donation Drive",
        location: "DLSU",
        date: "XX/XX/XXXX",
        time: "XX:XX AM - XX:XX PM",
        partner: "Manila Doctors Hospital",
        status: "Ongoing",
    }
];

export default function OAEventPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    // Find the selected event based on the eventId
    let selectedEvent: AssignedEvent | undefined = undefined;
    selectedEvent = assignedEvents.find((event) => {
        return event.id === eventId;
    });

    const goRegister = () => {
        router.push(`/oa/events/${eventId}/register`);
    };

    const goScanner = () => {
        router.push(`/oa/events/${eventId}/scanner`);
    };

    const goSearch = () => {
        router.push(`/oa/events/${eventId}/search`);
    };

    const goBack = () => {
        router.push("/oa/events");
    };

    // If the selected event is not found, display error message
    if (selectedEvent === undefined) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff]">
                <Header />

                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Not Found
                        </h1>

                        <p className="mt-[10px] text-[18px]">
                            The selected event does not exist or is not assigned to this account.
                        </p>

                        <button
                            onClick={goBack}
                            className="mt-[0.25in] px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white font-semibold cursor-pointer hover:underline"
                        >
                            Back to My Events
                        </button>
                    </section>
                </div>
            </main>
        );

    // If the selected event is found, display event details and actions
    } else {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff]">
                <Header />

                <div className="flex-1 p-[0.35in]">
                    {/* Page Title */}
                    <section className="bg-[#f9fdff] p-[0.25in]">
                        <p className="text-[16px] font-['Montserrat'] text-[#002940]">
                            Onsite Admin
                        </p>

                        <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                            {selectedEvent.name}
                        </h1>
                    </section>

                    {/* Event Details */}
                    <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Details
                        </h2>

                        <div className="mt-[0.15in] grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Partner:
                                </span>{" "}
                                {selectedEvent.partner}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Location:
                                </span>{" "}
                                {selectedEvent.location}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Date:
                                </span>{" "}
                                {selectedEvent.date}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Time:
                                </span>{" "}
                                {selectedEvent.time}
                            </p>
                        </div>
                    </section>

                    {/* Action Cards */}
                    <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Actions
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[0.25in]">
                            <button
                                onClick={goSearch}
                                className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                            >
                                <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                    Search Donor
                                </h3>

                                <p className="mt-[8px] text-[16px]">
                                    Search for an existing donor account.
                                </p>
                            </button>
                            
                            <button
                                onClick={goRegister}
                                className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                            >
                                <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                    Register Donor
                                </h3>

                                <p className="mt-[8px] text-[16px]">
                                    Create a donor account before check-in.
                                </p>
                            </button>

                            <button
                                onClick={goScanner}
                                className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                            >
                                <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                    Scan QR
                                </h3>

                                <p className="mt-[8px] text-[16px]">
                                    Scan an existing donor account QR code.
                                </p>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        );
    }
}