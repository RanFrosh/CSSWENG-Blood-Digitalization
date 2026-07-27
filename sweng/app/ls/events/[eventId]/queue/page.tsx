"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/HeaderLS";
import { getLabStaffQueue, getStaffStatus } from "../../ls_action";
import { QueueEntryWithDonor, StaffWithStatus } from "@/types/queue_type";

export default function QueuePage() {
    
    const params = useParams();
    const eventId = params.eventId as string;

    const [eventName, setEventName] = useState("Loading Event...");
    const [waitlist, setWaitlist] = useState<QueueEntryWithDonor[]>([]);
    const [myStation, setMyStation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(waitlist.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentWaitlist = waitlist.slice(startIndex, startIndex + itemsPerPage);

    const latestAddition = waitlist.length > 0 ? waitlist[waitlist.length - 1] : null;

    useEffect(() => {
        const fetchQueueData = async () => {

            if (!eventId) 
                return;

            setIsLoading(true);
            setErrorMessage("");

            try {

                const queueRes = await getLabStaffQueue(eventId);

                if (!queueRes.success || !queueRes.data) {
                    setErrorMessage(queueRes.message || "Failed to load queue.");
                    setIsLoading(false);
                    return; 
                }

                setWaitlist(queueRes.data.queue);
                setEventName(queueRes.data.eventName);

                const staffRes = await getStaffStatus(eventId);
                
                if (staffRes.success && staffRes.data) {
                    setMyStation(staffRes.data);
                }
                
            } catch (error) {
                setErrorMessage("Failed to load queue data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQueueData();
    }, [eventId]);

    const StaffCard = ({ staff }: { staff: StaffWithStatus }) => {
        
        const isBusy = staff.isBusy;
        
        return (
            <div className={`p-3 rounded-lg border-l-4 flex justify-between items-center transition-colors ${
                isBusy ? 'border-red-500 bg-red-50' : 'border-emerald-500 bg-emerald-50'
            }`}>
                <div>
                    <p className="font-bold text-slate-800 text-sm">{staff.name || "Unknown"}</p>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">
                        {staff.role.toUpperCase()}-{staff.profiles_id.substring(0, 4).toUpperCase()}
                    </p>
                </div>
                <div className="text-right">
                    {isBusy ? (
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded shadow-sm">
                                Queue #{staff.queueEntryId}
                            </span>
                            <p className="text-[11px] text-red-600 mt-1 font-medium">
                                Donor ID: {staff.currentDonorId}
                            </p>
                        </div>
                    ) : (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded shadow-sm">
                            Ready
                        </span>
                    )}
                </div>
            </div>
        );
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
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">

                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">{errorMessage}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-['Montserrat']">
            <Header />

            <div className="flex-1 max-w-[1600px] mx-auto w-full p-6 flex flex-col gap-6">
                
                {/* Header Strip */}
                <div className="flex flex-row justify-between items-end border-b border-slate-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{eventName}</h1>
                        <p className="text-sm text-slate-500 font-bold mt-1">Event ID: {eventId}</p>
                    </div>
                    
                    {/* Quick Stats Banner */}
                    <div className="flex gap-4">
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
                            <span className="text-sm text-slate-500 font-semibold">Total Waiting</span>
                            <span className="text-xl font-bold text-slate-800">{waitlist.length}</span>
                        </div>
                        {latestAddition && (
                            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
                                <span className="text-sm text-blue-600 font-semibold">Latest</span>
                                <span className="text-xl font-bold text-blue-900">#{latestAddition.id}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: My Station */}
                    <section className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            My Station
                        </h2>
                        
                        {myStation ? (
                            <StaffCard staff={myStation} />
                        ) : (
                            <p className="text-sm text-slate-500 italic">Loading your station...</p>
                        )}
                        
                        {/* 💥 This is exactly where your "Call Next Donor" button will go! */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <button 
                                disabled={myStation?.isBusy || waitlist.length === 0}
                                className="w-full bg-[#002940] text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                            >
                                {myStation?.isBusy ? "Complete Current Donor" : "Call Next Donor"}
                            </button>
                        </div>
                    </section>

                    {/* Waitlist */}
                    <section className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Current Waitlist</h2>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100 text-sm text-slate-500">
                                        <th className="pb-3 font-semibold w-24">Position</th>
                                        <th className="pb-3 font-semibold w-32">Queue #</th>
                                        <th className="pb-3 font-semibold">Donor ID</th>
                                        <th className="pb-3 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentWaitlist.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                                                The queue is currently empty.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentWaitlist.map((entry, index) => {
                                            const actualPosition = startIndex + index + 1;
                                            return (
                                                <tr key={entry.id.toString()} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                    <td className="py-3">
                                                        <span className="text-sm font-bold text-slate-400">
                                                            {actualPosition}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-base font-bold text-slate-800">
                                                            #{entry.id}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm text-slate-600 font-medium">
                                                            {entry.donor_id}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded shadow-sm">
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
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                            <p className="text-sm text-slate-500 font-medium">
                                Showing <span className="text-slate-800">{startIndex + 1}</span> to <span className="text-slate-800">{Math.min(startIndex + itemsPerPage, waitlist.length)}</span> of <span className="text-slate-800">{waitlist.length}</span>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                        
                    </section>
                </div>
            </div>
        </main>
    );
}