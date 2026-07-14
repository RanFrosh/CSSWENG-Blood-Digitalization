"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/HeaderMP";
import { QueueEntryWithDonor, StaffWithStatus } from "@/types/queue_type";
import { viewStaffStatus, viewQueueWithDonors } from "@/app/queue/queue_action";

export default function QueuePage() {
    const router = useRouter();
    const params = useParams();
    const [waitList, setWaitList] = useState<QueueEntryWithDonor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const eventId = params.eventId as string;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(waitList.length / pageSize);
    const displayedDonors = waitList.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const [staffList, setStaffList] = useState<StaffWithStatus[]>([]);

    useEffect(() => {
    const load = async () => {
        console.log("1. CLIENT SENDING EVENT ID:", eventId);
        setIsLoading(true);
        setErrorMessage("");
        const [queueResult, staffResult] = await Promise.all([
            viewQueueWithDonors(eventId),
            viewStaffStatus(BigInt(eventId)),
        ]);
        if (queueResult.success && queueResult.data && staffResult.success && staffResult.data) {
            setWaitList(queueResult.data);
            setStaffList(staffResult.data);
            setCurrentPage(1);
        } else {
            setErrorMessage(`Queue: ${queueResult.message} and Staff: ${staffResult.message}`);
            console.log(``);
        }
        setIsLoading(false);
        };
    load();
    }, [eventId]);

    // Get the current donor being handled by a medical professional
    const getCurrentDonor = (medicalProfessional: StaffWithStatus) => {
        // MP is currently free
        if (!medicalProfessional.isBusy) {
            return (
                <div className="mt-5 bg-white rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Ready for next donor
                    </p>
                </div>
            );
        // MP is currently handling a donor
        } else {
            return (
                <div className="mt-5 bg-white rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Currently Handling
                    </p>

                    <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        #{medicalProfessional.currentDonorName}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        {medicalProfessional.name}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        Donor ID: {medicalProfessional.currentDonorId}
                    </p>
                </div>
            );
        }
    };

    // Get the last donor added to the queue
    const getLatestAddition = () => {
        // No donor has been added to the queue yet
        const last = waitList.length > 0 ? waitList[waitList.length - 1] : null;
        if (!last) {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Latest Addition
                    </p>

                    <p className="mt-2.5 text-[18px] text-[#002940]">
                        No donors have checked in.
                    </p>
                </div>
            );
        // At least one donor has been added to the queue
        } else {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Latest Addition
                    </p>

                    <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        #{last.id}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        {last.donor_profile?.first_name && last.donor_profile?.last_name
                            ? `${last.donor_profile.first_name} ${last.donor_profile.last_name}`
                            : "Missing name"}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        Donor ID: {last.donor_id}
                    </p>
                </div>
            );
        }
    };

    // Get the donor waitlist
    const getWaitlist = () => {
        // No donors in queue
        if (waitList.length === 0) {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        No donor in queue
                    </p>
                </div>
            );
        // At least one donor in queue
        } else {
            return (
                <div className="flex flex-col gap-4">
                    {displayedDonors.map((donor, index) => (
                        <div
                            key={donor.id}
                            className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5"
                        >
                            <div className="flex flex-row items-start justify-between gap-5 flex-wrap">
                                <div>
                                    <p className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                        #{donor.id}
                                    </p>

                                    <p className="mt-2.5 text-[18px] font-semibold text-[#002940]">
                                        {donor.donor_profile?.first_name && donor.donor_profile?.last_name
                                            ? `${donor.donor_profile.first_name} ${donor.donor_profile.last_name}`
                                            : "Missing name"}
                                    </p>

                                    <p className="mt-1 text-[18px] text-[#002940]">
                                        Donor ID: {donor.donor_id}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[18px] font-semibold text-[#002940]">
                                        Position
                                    </p>

                                    <p className="mt-1 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-full text-[18px] font-semibold cursor-pointer transition ${
                                        currentPage === page
                                            ? "bg-[#002940] text-white"
                                            : "bg-white text-[#002940] border-2 border-[#002940] hover:bg-[#002940] hover:text-white"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    };

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
                    <div className="flex-1 p-[0.35in]">
                        <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                            <p className="mt-[10px] text-[18px]">
                                {errorMessage}
                            </p>
                        </section>
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
                            <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                                Medical Professional
                            </p>

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
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Donors Waiting
                            </p>

                            <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                {waitList.length}
                            </p>
                        </div>

                        {getLatestAddition()}
                    </div>
                </section>

                {/* Medical Professional Status */}
                <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Medical Professional Status
                    </h2>

                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5">
                        {staffList.map((medicalProfessional) => {
                            let cardColor = "bg-[#fd5448]";

                            if (!medicalProfessional.isBusy) {
                                cardColor = "bg-[#002940]";
                            }

                            return (
                                <div
                                    key={medicalProfessional.profiles_id}
                                    className={`${cardColor} rounded-[18px] p-5`}
                                >
                                    <div className="flex flex-row items-center justify-between gap-3 flex-wrap">
                                        <h3 className="text-[24px] font-['Montserrat'] font-bold text-white">
                                            {medicalProfessional.name}
                                        </h3>

                                        <span className="bg-white text-[#002940] px-4 py-2 rounded-full text-[18px] font-semibold">
                                            {medicalProfessional.profiles_id}
                                        </span>
                                    </div>

                                    {getCurrentDonor(medicalProfessional)}
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