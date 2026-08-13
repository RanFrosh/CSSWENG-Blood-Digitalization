"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ViewEventsWithProvince } from "@/types/event_type";
import { verifyEventAccess } from "../../../event_records/event_action";
import Header from "@/components/HeaderMP";
import { pickNextDonor, retrieveDonor, peekNextDonor } from "@/app/queue/queue_action";

export default function MPEventPage() {
    const router = useRouter();
    const params = useParams();
    const [event, setEvent] = useState<ViewEventsWithProvince | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [actionError, setActionError] = useState("");

    const eventId = params.eventId as string;

    useEffect(() => {
    const load = async () => {
        setIsLoading(true);
        setErrorMessage("");
        const result = await verifyEventAccess(BigInt(eventId));
        if (result.success && result.data) {
            setEvent(result.data);
        } else {
            setErrorMessage(result.message);
        }
        setIsLoading(false);
        };
        load();
    }, [eventId]);

    const goQueue = () => {
        router.push(`/mp/events/${eventId}/queue`);
    };

    // Accept donor from queue and proceed to screening
    const acceptNewDonor = async () => {
        setActionError("");
        const peek = await peekNextDonor(BigInt(eventId));
        if (!peek.success || !peek.data || !peek.data.donor_id) {
            setActionError(peek.message);
            return;
        }

        const donorInfo = await retrieveDonor(peek.data.donor_id);
        if (!donorInfo.success || !donorInfo.data) {
            setActionError(donorInfo.message);
            return;
        }

        const isConfirmed = confirm(
            `Queue #${peek.data.id}\nName: ${donorInfo.data.first_name} ${donorInfo.data.last_name}\n\nAccept this donor for screening?`
        );
        if (!isConfirmed) return;

        const pick = await pickNextDonor(BigInt(eventId));
        if (!pick.success || !pick.data) {
            setActionError(pick.message);
            return;
        }
        
        router.push(`/mp/events/${eventId}/screening/${pick.data.donor_id}?queueId=${pick.data.id}`);
    };

    const goBack = () => {
        router.push("/mp/events");
    };

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading event...</p>
                </div>
            </main>
        );
    }

    // If the selected event is not found, display error message
    if (errorMessage) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <p className="mt-[10px] text-[18px]">
                            {errorMessage}
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
    } else if (event) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />

                <div className="flex-1 p-[0.35in]">
                    {/* Page Title */}
                    <section className="bg-[#f9fdff] p-[0.25in]">
                        <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                            Medical Professional
                        </p>

                        <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                            {event.name}
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
                                {event?.start_time && event?.end_time ? `${event.start_time} - ${event.end_time}` : "—"}
                            </p>
                        </div>
                    </section>

                    {actionError && (
                        <div className="mt-[0.15in] p-2 text-sm text-white bg-red-500 rounded text-center">
                            {actionError}
                        </div>
                    )}

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
