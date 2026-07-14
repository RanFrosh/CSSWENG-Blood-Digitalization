"use client";

import { useRouter } from "next/navigation";

import Header from "@/components/HeaderRS";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";

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
    event: AssignedEvent | null;
    eventId: string;
};

export default function RSEventClient({
    event,
    eventId,
}: Props) {
    const router = useRouter();

    const goScanner = () => {
        router.push(`/rs/events/${eventId}/scanner`);
    };

    const goBack = () => {
        router.push("/rs/events");
    };

    if (!event) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />

                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Not Found
                        </h1>

                        <p className="mt-[10px] text-[18px]">
                            The selected event does not exist or is not assigned
                            to this account.
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
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 p-[0.35in]">
                {/* Page Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[16px] font-['Montserrat'] text-[#002940]">
                        Recovery Staff
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        {event.name}
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
                </section>

                {/* Action Cards */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Actions
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1">
                        <button
                            onClick={goScanner}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                Scan QR
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                Scan a donor perk QR code for refreshments.
                            </p>
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}