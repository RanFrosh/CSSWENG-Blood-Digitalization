"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/HeaderLS";
import { EventDetailsPanel } from "@/components/EventDetailsPanel";
import { ViewEvents } from "@/types/event_type";
import { verifyLabStaffEventAccess } from "../ls_action";
import { getLabStaffQueue } from "../ls_action";
import { QueueEntryWithDonor } from "@/types/queue_type";

export default function LSEventPage() {

    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    const [nextDonor, setNextDonor] = useState<QueueEntryWithDonor | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<ViewEvents | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPageData = async () => {

            setIsLoading(true);
            setErrorMessage("");
            
            const eventRes = await verifyLabStaffEventAccess(eventId);
        
            if (!eventRes.success || !eventRes.data) {
                setErrorMessage(eventRes.message || "Event not found or not assigned to you.");
                setIsLoading(false);
                return;
            }

            setSelectedEvent(eventRes.data);

            const queueRes = await getLabStaffQueue(eventId);
            
            if (queueRes.success && queueRes.data && queueRes.data.length > 0) {
                setNextDonor(queueRes.data[0]); 
            } else {
                setNextDonor(null); 
            }

            setIsLoading(false);
            };

        if (eventId) 
            fetchPageData();

    }, [eventId]);

    const goQueue = () => {
        router.push(`/ls/events/${eventId}/queue`);
    };

    const goBack = () => {
        router.push("/ls/events");
    };

    const confirmDonation = () => {
        // We will eventually add the dequeue database call here
        router.push(`/ls/events/${eventId}/record/${nextDonor?.donor_id}`);
    };

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading event details...</p>
                </div>
            </main>
        );
    }

    if (errorMessage || !selectedEvent) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm flex flex-col items-start gap-[0.25in]">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Access Denied
                        </h1>
                        <p className="text-[18px] text-red-500">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => router.push("/ls/events")}
                            className="px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold cursor-pointer hover:bg-blue-900 transition"
                        >
                            Back to My Events
                        </button>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black relative">
            
            <Header />

            <div className="flex-1 p-[0.35in]">
                {/* Page Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Lab Staff
                    </p>
                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        {selectedEvent.name}
                    </h1>
                </section>

                {/* Event Details Panel */}
                <EventDetailsPanel event={selectedEvent} />

                {/* Action Cards */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Actions
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={!nextDonor}
                            className={`border-2 rounded-[16px] p-[0.25in] text-left transition ${
                                !nextDonor 
                                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed" 
                                    : "bg-white border-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            }`}
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                Record Donor Blood Donation
                            </h3>
                            <p className="mt-[8px] text-[18px]">
                                Accept the next donor from the blood donation queue.
                            </p>
                        </button>

                        <button
                            onClick={goQueue}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                View Blood Donation Queue
                            </h3>
                            <p className="mt-[8px] text-[18px]">
                                View screened donors waiting for blood donation procedures.
                            </p>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 border-t-2 border-dashed border-[#c0cad0] pt-6">
                        <button
                            type="button"
                            onClick={goBack}
                            className="bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#fd5448] hover:border-[#fd5448] hover:text-white transition flex items-center gap-2 w-fit"
                        >
                            <span>←</span> Back to My Events
                        </button>
                    </div>

                </section>
            </div>

            {/* The Modal Overlay */}
            {showModal && nextDonor && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-[16px] shadow-2xl max-w-md w-full border-2 border-[#002940]">
                        <h2 className="text-2xl font-['Montserrat'] font-bold text-[#002940] mb-4">
                            Proceed to Donation?
                        </h2>
                        
                        <div className="mb-6 text-lg bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="mb-2">
                                <span className="font-bold text-[#002940]">Id: </span> {nextDonor.id}
                            </p>
                            <p>
                                <span className="font-bold text-[#002940]">Name:</span> {nextDonor.donor_profile?.first_name} {nextDonor.donor_profile?.last_name}
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 font-semibold border-2 border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDonation}
                                className="px-5 py-2 font-semibold bg-[#002940] text-white rounded-lg hover:bg-blue-900 transition"
                            >
                                Confirm & Start
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
