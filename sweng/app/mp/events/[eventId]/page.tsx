"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderMP";

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
    },
];

// Sample queue donor structure
type QueueDonor = {
    queueNumber: string;
    id: string;
    name: string;
};

// Sample next donor in queue
const nextDonor: QueueDonor | null = {
    queueNumber: "005",
    id: "D-005",
    name: "June Doe"
};

export default function MPEventPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    // Find the selected event based on the eventId
    let selectedEvent: AssignedEvent | undefined = undefined;
    selectedEvent = assignedEvents.find((event) => {
        return event.id === eventId;
    });

    const goQueue = () => {
        router.push(`/mp/events/${eventId}/queue`);
    };

    // Accept donor from queue and proceed to screening
    const acceptNewDonor = () => {
        if (nextDonor === null) {
            alert("There are no donors in the queue.");
        } else {
            const isConfirmed = confirm(
                `Queue Number: #${nextDonor.queueNumber}\nName: ${nextDonor.name}\n\nProceed to screening?`
            );

            if (isConfirmed) {
                router.push(`/mp/events/${eventId}/screening/${nextDonor.id}`);
            }
        }
    };

    const goBack = () => {
        router.push("/mp/events");
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
                            className="mt-[0.25in] px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold cursor-pointer hover:underline"
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
                        <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                            Medical Professional
                        </p>

                        <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                            {selectedEvent.name}
                        </h1>
                    </section>

                    {/* Event Details */}
                    <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                        <div className="flex flex-row items-center justify-between gap-[0.25in] flex-wrap">
                            <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                Event Details
                            </h2>

                            <span className="bg-[#002940] text-white px-5 py-3 rounded-full text-[18px] font-semibold">
                                Event ID: {eventId}
                            </span>
                        </div>

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

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                            <button
                                onClick={acceptNewDonor}
                                className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                            >
                                <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                    Screen Donor
                                </h3>

                                <p className="mt-[8px] text-[18px]">
                                    Accept the next donor from the screening queue.
                                </p>
                            </button>

                            <button
                                onClick={goQueue}
                                className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                            >
                                <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                    View Screening Queue
                                </h3>

                                <p className="mt-[8px] text-[18px]">
                                    View checked-in donors waiting for health screening.
                                </p>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        );
    }
}