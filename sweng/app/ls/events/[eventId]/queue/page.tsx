"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/HeaderLS";
import { viewQueueWithDonors, viewStaffStatus } from "@/app/queue/queue_action";
import { QueueEntryWithDonor, StaffWithStatus } from "@/types/queue_type";

export default function QueuePage() {
    
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;

    const [waitlist, setWaitlist] = useState<QueueEntryWithDonor[]>([]);
    const [labStaff, setLabStaff] = useState<StaffWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchQueueData = async () => {
            if (!eventId) return;
            setIsLoading(true);
            setErrorMessage("");

            try {
                const [queueRes, staffRes] = await Promise.all([
                    viewQueueWithDonors(eventId),
                    viewStaffStatus(BigInt(eventId)) 
                ]);

                if (queueRes.success && queueRes.data) {
                    setWaitlist(queueRes.data);
                } else {
                    setErrorMessage(queueRes.message);
                }

                if (staffRes.success && staffRes.data) {
                    setLabStaff(staffRes.data);
                }
                
            } catch (error) {
                setErrorMessage("Failed to load queue data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQueueData();
    }, [eventId]);

    const latestAddition = waitlist.length > 0 ? waitlist[waitlist.length - 1] : null;

    // Component Renderers
    const getCurrentDonor = (staff: StaffWithStatus) => {
        if (!staff.isBusy) {
            return (
                <div className="mt-5 bg-white rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Ready for next donor
                    </p>
                </div>
            );
        } else {
            return (
                <div className="mt-5 bg-white rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Currently Handling
                    </p>
                    <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        #{staff.queueEntryId}
                    </p>
                    <p className="mt-1 text-[18px] text-[#002940]">
                        {staff.currentDonorName || "Unknown Donor"}
                    </p>
                    <p className="mt-1 text-[18px] text-[#002940]">
                        Donor ID: {staff.currentDonorId}
                    </p>
                </div>
            );
        }
    };

    const getLatestAddition = () => {
        if (!latestAddition) {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">Latest Addition</p>
                    <p className="mt-2.5 text-[18px] text-[#002940]">No donors have checked in.</p>
                </div>
            );
        } else {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">Latest Addition</p>
                    <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        #{latestAddition.id}
                    </p>
                    <p className="mt-1 text-[18px] text-[#002940]">
                        {latestAddition.donor_profile?.first_name} {latestAddition.donor_profile?.last_name}
                    </p>
                    <p className="mt-1 text-[18px] text-[#002940]">
                        Donor ID: {latestAddition.donor_id}
                    </p>
                </div>
            );
        }
    };

    const getWaitlist = () => {
        if (waitlist.length === 0) {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        No donors are currently waiting.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col gap-4">
                    {waitlist.map((entry, index) => (
                        <div
                            key={entry.id.toString()}
                            className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5"
                        >
                            <div className="flex flex-row items-start justify-between gap-5 flex-wrap">
                                <div>
                                    <p className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                        #{entry.id}
                                    </p>
                                    <p className="mt-2.5 text-[18px] font-semibold text-[#002940]">
                                        {entry.donor_profile?.first_name} {entry.donor_profile?.last_name}
                                    </p>
                                    <p className="mt-1 text-[18px] text-[#002940]">
                                        Donor ID: {entry.donor_id}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[18px] font-semibold text-[#002940]">Position</p>
                                    <p className="mt-1 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                        {index + 1}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff]">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading queue...</p>
                </div>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff]">
                <Header />
                <div className="flex-1 p-[0.35in] text-red-500 font-bold">
                    Error: {errorMessage}
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff]">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Page Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <div>
                        <div>
                            <p className="text-[18px] font-['Montserrat'] text-[#002940]">Lab Staff</p>
                            <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                                Screening Queue
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Queue Summary */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Current Queue Status
                        </h2>
                        <span className="bg-[#002940] text-white px-5 py-3.5 rounded-full text-[18px] font-semibold">
                            Event ID: {eventId}
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Donors Waiting</p>
                            <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                {waitlist.length}
                            </p>
                        </div>
                        {getLatestAddition()}
                    </div>
                </section>

                {/* Lab Staff Status */}
                <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Lab Staff Status
                    </h2>
                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5">
                        {labStaff.map((staff) => {
                            const cardColor = staff.isBusy ? "bg-[#fd5448]" : "bg-[#002940]";
                            
                            return (
                                <div key={staff.profiles_id.toString()} className={`${cardColor} rounded-[18px] p-5`}>
                                    <div className="flex flex-row items-center justify-between gap-3 flex-wrap">
                                        <h3 className="text-[24px] font-['Montserrat'] font-bold text-white">
                                            {staff.name || "Unknown Staff"}
                                        </h3>
                                        <span className="bg-white text-[#002940] px-4 py-2 rounded-full text-[16px] font-semibold truncate max-w-[120px]">
                                            {staff.profiles_id.toString().substring(0, 8)}...
                                        </span>
                                    </div>
                                    {getCurrentDonor(staff)}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Waitlist */}
                <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Waitlist
                    </h2>
                    <div className="mt-5">
                        {getWaitlist()}
                    </div>
                </section>
            </div>
        </main>
    );
}