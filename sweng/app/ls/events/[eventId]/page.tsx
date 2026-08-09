"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/HeaderLS";
import { EventDetailsPanel } from "@/components/EventDetailsPanel";
import { ViewEvents } from "@/types/event_type";
import { verifyLabStaffEventAccess, getLabStaffQueue, getStaffStatus, acceptDonor } from "@/actions/ls_action";
import { QueueEntryWithDonor, StaffWithStatus } from "@/types/queue_type";

export default function LSEventPage() {

    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;

    const [nextDonor, setNextDonor] = useState<QueueEntryWithDonor | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<ViewEvents | null>(null);

    const [waitlist, setWaitlist] = useState<QueueEntryWithDonor[]>([]);
    const [myStation, setMyStation] = useState<StaffWithStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(waitlist.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentWaitlist = waitlist.slice(startIndex, startIndex + itemsPerPage);

    const latestAddition = waitlist.length > 0 ? waitlist[waitlist.length - 1] : null;

    useEffect(() => {

        const fetchDashboardData = async () => {

            if (!eventId) 
                return;

            setIsLoading(true);
            setErrorMessage("");

            try {

                const eventRes = await verifyLabStaffEventAccess(eventId);
                
                if (!eventRes.success || !eventRes.data) {
                    setErrorMessage(eventRes.message || "Event not found or not assigned to you.");
                    setIsLoading(false);
                    return;
                }
                
                setSelectedEvent(eventRes.data);

                const queueRes = await getLabStaffQueue(eventId);

                if (!queueRes.success || !queueRes.data) {
                    setErrorMessage(queueRes.message || "Failed to load waitlist.");
                    setIsLoading(false);
                    return;
                }

                const queueArray = queueRes.data.queue; 
                setWaitlist(queueArray);

                if (queueArray && queueArray.length > 0) {
                    setNextDonor(queueArray[0]);
                } else {
                    setNextDonor(null);
                }

                const staffRes = await getStaffStatus(eventId);
                
                if (staffRes.success && staffRes.data) {
                    setMyStation(staffRes.data);
                } else {
                    console.error("Failed to load station:", staffRes.message);
                }

            } catch (error) {
                console.error("Dashboard Load Error:", error);
                setErrorMessage("Failed to load command center data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();

    }, [eventId]);

    const goBack = () => {
        router.push("/ls/events");
    };

    const handleConfirm = async () => {

        if (!nextDonor) 
            return;

        setIsProcessing(true);
        
        const res = await acceptDonor(nextDonor.id.toString(), eventId);
        
        if (res?.success) {
            router.push(`/ls/events/${eventId}/record/${nextDonor.donor_id}`);
        } else {
            alert(res?.message); 
            setIsProcessing(false);
            setShowAcceptModal(false);
        }
    };

    const StaffCard = ({ staff }: { staff: StaffWithStatus }) => {
    
        const isBusy = staff.isBusy;
        
        return (
            <div className={`p-6 rounded-xl border-l-8 flex justify-between items-center transition-colors ${
                isBusy ? 'border-red-500 bg-red-50' : 'border-emerald-500 bg-emerald-50'
            }`}>
                <div>
                    <p className="font-bold text-slate-800 text-2xl mb-1">{staff.name || "Unknown"}</p>
                    <p className="text-base text-slate-600 font-bold tracking-wider">
                        {staff.role.toUpperCase()}-{staff.profiles_id.substring(0, 4).toUpperCase()}
                    </p>
                </div>
                <div className="text-right">
                    {isBusy ? (
                        <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-red-700 bg-red-100 px-4 py-1.5 rounded-md shadow-sm">
                                Queue #{staff.queueEntryId}
                            </span>
                            <p className="text-base text-red-600 mt-2 font-bold">
                                Donor ID: {staff.currentDonorId}
                            </p>
                        </div>
                    ) : (
                        <span className="text-lg font-bold text-emerald-700 bg-emerald-100 px-5 py-2 rounded-md shadow-sm">
                            Ready
                        </span>
                    )}
                </div>
            </div>
        );
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
                <Header/>
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            {errorMessage || "Access Denied"}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black relative">
            
            <Header />

            <div className="flex-1 p-[0.35in]">

                {/* Event Details Panel */}
                <EventDetailsPanel event={selectedEvent} />

                {/* Dashboard Grid */}
                <div className=" mt-[30px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Staff Station */}
                    <section className="lg:col-span-4 bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            My Station
                        </h2>
                        
                        {myStation ? (
                            <StaffCard staff={myStation} />
                        ) : (
                            <p className="text-lg text-slate-500 italic py-4">Loading your station...</p>
                        )}
                        
                        <div className="mt-6 pt-6 border-t-2 border-slate-100">
                            <button 
                                disabled={(!myStation?.isBusy && waitlist.length === 0)}
                                onClick={() => {
                                    if (myStation?.isBusy) {
                                        router.push(`/ls/events/${eventId}/record/${myStation.currentDonorId}`);
                                    } else {
                                        setShowAcceptModal(true);
                                    }
                                }}
                                className="w-full bg-white text-[#002940] py-5 rounded-xl text-xl font-bold border-2 border-[#002940] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fd5448] hover:border-[#fd5448] hover:text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
                            >
                                {myStation?.isBusy ? "Complete Current Donor" : "Accept Next Donor"}
                            </button>
                        </div>

                        {/* Return Button */}
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

                    {/* Waitlist */}
                    <section className="lg:col-span-8 bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-8">
    
                        {/* Waitlist Header & Stats */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b-2 border-slate-100 pb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Current Waitlist</h2>
                            
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-slate-50 border-2 border-slate-200 px-5 py-2.5 rounded-xl flex items-center gap-3">
                                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Waiting: </span>
                                    <span className="text-2xl font-bold text-slate-800">{waitlist.length}</span>
                                </div>
                                
                                {latestAddition && (
                                    <div className="bg-blue-50 border-2 border-blue-100 px-5 py-2.5 rounded-xl flex items-center gap-3">
                                        <span className="text-sm text-blue-600 font-bold uppercase tracking-wider">Latest: </span>
                                        <span className="text-2xl font-bold text-blue-900">#{latestAddition.id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-4 border-slate-100 text-lg text-slate-500">
                                        <th className="pb-4 font-bold w-32 uppercase tracking-wider">Position</th>
                                        <th className="pb-4 font-bold w-40 uppercase tracking-wider">Queue #</th>
                                        <th className="pb-4 font-bold uppercase tracking-wider">Donor ID</th>
                                        <th className="pb-4 font-bold text-right uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentWaitlist.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-slate-500 text-xl font-medium">
                                                The queue is currently empty.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentWaitlist.map((entry, index) => {
                                            const actualPosition = startIndex + index + 1;
                                            return (
                                                <tr key={entry.id.toString()} className="border-b-2 border-slate-50 hover:bg-slate-50 transition-colors">
                                                    <td className="py-6">
                                                        <span className="text-2xl font-bold text-slate-400">
                                                            {actualPosition}
                                                        </span>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className="text-2xl font-bold text-slate-800">
                                                            #{entry.id}
                                                        </span>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className="text-xl text-slate-600 font-semibold">
                                                            {entry.donor_id}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 text-right">
                                                        <span className="text-base font-bold text-amber-700 bg-amber-50 border-2 border-amber-200 px-4 py-2 rounded-lg shadow-sm">
                                                            Waiting
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Page controls */}
                        <div className="flex items-center justify-between border-t-2 border-slate-100 pt-6 mt-4">
                            <p className="text-lg text-slate-500 font-medium">
                                Showing{" "}
                                <span className="text-slate-800 font-bold">
                                    {waitlist.length === 0 ? 0 : startIndex + 1}
                                </span>{" "}
                                to{" "}
                                <span className="text-slate-800 font-bold">
                                    {Math.min(startIndex + itemsPerPage, waitlist.length)}
                                </span>{" "}
                                of <span className="text-slate-800 font-bold">{waitlist.length}</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="px-6 py-2.5 rounded-lg border-2 border-slate-200 text-base font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    // FIX: Use >= and handle the case where totalPages is 0
                                    disabled={currentPage >= totalPages || waitlist.length === 0} 
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="px-6 py-2.5 rounded-lg border-2 border-slate-200 text-base font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                        
                    </section>
                </div>
            </div>

            {/*  Accept Donor Modal */}
            {showAcceptModal && nextDonor && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="bg-[#002940] p-6 text-white text-center">
                            <h3 className="text-3xl font-bold font-['Montserrat']">Accept Donor</h3>
                            <p className="text-blue-200 mt-2 font-medium">Verify details before proceeding</p>
                        </div>

                        <div className="p-8">
                            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-8 flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider">Queue Number</span>
                                    <span className="text-4xl font-bold text-[#002940]">#{nextDonor.id}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider">Donor ID</span>
                                    <span className="text-2xl font-semibold text-slate-700">{nextDonor.donor_id}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    disabled={isProcessing}
                                    onClick={() => setShowAcceptModal(false)}
                                    className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isProcessing}
                                    onClick={handleConfirm}
                                    className="flex-1 px-6 py-4 rounded-xl bg-emerald-600 text-white text-lg font-bold hover:bg-emerald-700 transition-colors shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center items-center cursor-pointer"
                                >
                                    {isProcessing ? "Assigning..." : "Confirm & Start"}
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            )}
        </main>
    );
}
