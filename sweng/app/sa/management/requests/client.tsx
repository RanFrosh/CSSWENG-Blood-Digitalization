"use client";

import { useState } from "react";
import { approveRequestAction, rejectRequestAction } from "@/actions/sa_action"; 

type DBRequest = {
    id: string;
    bloodBagSerial: string;
    donorId: string | null;
    eventId: string | null;
    staffId: string;
    staffName: string;
    payload: any;
    status: string; 
    createdAt: Date;
    admin_remarks?: string;
};

type StatusTab = "All" | "pending" | "approved" | "rejected";
type SortOption = "Default" | "Name: A-Z" | "Date Submitted: Latest" | "Date Submitted: Earliest" | "Status";

export default function RequestsClient({ 
    initialRequests, currentAdminId 
}: { 
    initialRequests: DBRequest[]; 
    currentAdminId: string;
}) {
    
    const [activeTab, setActiveTab] = useState<StatusTab>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");

    const [selectedRequest, setSelectedRequest] = useState<DBRequest | null>(null);
    const [modalAction, setModalAction] = useState<"Approve" | "Reject" | null>(null);
    const [rejectionReasonInput, setRejectionReasonInput] = useState("");
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const tabs: StatusTab[] = ["All", "pending", "approved", "rejected"];
    const sortOptions: SortOption[] = ["Default", "Name: A-Z", "Date Submitted: Latest", "Date Submitted: Earliest", "Status"];

    let filteredRequests = [...initialRequests];

    if (activeTab !== "All") {
        filteredRequests = filteredRequests.filter((req) => req.status === activeTab);
    }

    if (search.trim() !== "") {
        const query = search.trim().toLowerCase();
        filteredRequests = filteredRequests.filter(
            (req) =>
                req.staffName.toLowerCase().includes(query) ||
                req.bloodBagSerial.toLowerCase().includes(query) ||
                req.id.toLowerCase().includes(query) ||
                JSON.stringify(req.payload).toLowerCase().includes(query)
        );
    }

    filteredRequests.sort((a, b) => {
        if (sortBy === "Name: A-Z") 
            return a.staffName.localeCompare(b.staffName);

        if (sortBy === "Date Submitted: Earliest") 
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        if (sortBy === "Date Submitted: Latest") 
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        if (sortBy === "Status") 
            return a.status.localeCompare(b.status);

        return 0;
    });

    const handleActionClick = (req: DBRequest, action: "Approve" | "Reject") => {
        setSelectedRequest(req);
        setModalAction(action);
        setRejectionReasonInput("");
        setNotification(null);
    };

    const confirmAction = async () => {
        if (!selectedRequest || !modalAction) return;

        if (modalAction === "Reject" && !rejectionReasonInput.trim()) {
            setNotification({ type: "error", message: "You must provide a reason for rejection." });
            return;
        }

        setIsProcessing(true);
        setNotification(null);

        let res;
        
        if (modalAction === "Approve") {
            res = await approveRequestAction(selectedRequest.id, currentAdminId, rejectionReasonInput);
        } else {
            res = await rejectRequestAction(selectedRequest.id, currentAdminId, rejectionReasonInput);
        }

        if (res.success) {
            setNotification({ 
                type: "success", 
                message: `Request ${selectedRequest.id} ${modalAction.toLowerCase()} successfully!` 
            });
            setSelectedRequest(null);
            setModalAction(null);
        } else {
            setNotification({ type: "error", message: res.message || "Action failed." });
        }

        setIsProcessing(false);
    };

    const getTabClass = (tab: StatusTab) => {
        return `px-[20px] py-[10px] capitalize rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ${
            activeTab === tab ? "bg-[#002940] border-[#002940] text-white font-bold" : "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white"
        }`;
    };

    const getStatusPill = (status: string) => {
        if (status === "approved") return "bg-[#e4f5ea] text-[#1a7a3f]";
        if (status === "pending") return "bg-[#fef9c3] text-[#854d0e]";
        return "bg-[#f5e4e4] text-[#a32626]";
    };

    const formatPayloadKey = (key: string) => {
        return key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div className="flex-1 bg-[#f9fdff] p-[0.35in]">

            <section className="bg-[#f9fdff] p-[0.25in]">
                <p className="text-[18px] font-['Montserrat'] text-[#002940]">Super Admin</p>
                <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">Requests</h1>
            </section>

            <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                
                {/* Notification Banner */}
                {notification && (
                    <div className={`mb-4 px-4 py-3 rounded-lg border-2 font-semibold flex justify-between ${
                        notification.type === "success" ? "bg-[#e4f5ea] border-[#1a7a3f] text-[#1a7a3f]" : "bg-[#f5e4e4] border-[#a32626] text-[#a32626]"
                    }`}>
                        <p>{notification.message}</p>
                        <button onClick={() => setNotification(null)}>&times;</button>
                    </div>
                )}

                <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                    <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">System Requests</h2>
                    <div className="flex flex-row items-center flex-wrap gap-[10px]">
                        {tabs.map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={getTabClass(tab)}>{tab}</button>
                        ))}
                    </div>
                </div>

                <div className="mt-[0.25in] flex flex-col gap-[0.25in]">
                    {filteredRequests.length === 0 ? (
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                            <p className="text-[18px] font-semibold text-[#002940]">No requests found</p>
                        </div>
                    ) : (
                        filteredRequests.map((req) => (
                            <div key={req.id} className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm">
                                <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                    <h2 className="text-[24px] font-['Montserrat'] font-bold">Request ID: {req.id}</h2>

                                    {req.status === "pending" && (
                                        <div className="flex flex-row gap-[10px]">
                                            <button onClick={() => handleActionClick(req, "Approve")} className="px-[16px] py-[8px] rounded-[10px] font-semibold bg-[#e4f5ea] text-[#1a7a3f] hover:bg-white cursor-pointer">Approve</button>
                                            <button onClick={() => handleActionClick(req, "Reject")} className="px-[16px] py-[8px] rounded-[10px] font-semibold bg-white text-[#a32626] hover:bg-[#fef2f2] cursor-pointer">Reject</button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-[0.35in]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                        <p><span className="font-semibold">Requester:</span> {req.staffName}</p>
                                        <p><span className="font-semibold">Target Bag Serial:</span> {req.bloodBagSerial}</p>
                                        <p><span className="font-semibold">Date Submitted:</span> {new Date(req.createdAt).toLocaleDateString()}</p>
                                        <p className="flex items-center gap-[10px]">
                                            <span className="font-semibold">Status:</span> 
                                            <span className={`capitalize ${getStatusPill(req.status)}`}>{req.status}</span>
                                        </p>
                                    </div>

                                    <div className="mt-[0.2in] rounded-[10px]">
                                        <p className="text-[18px] font-semibold text-[#002940] mb-[10px]">
                                            Proposed Data Changes:
                                        </p>
                                        
                                        <div className="flex flex-col gap-[8px]">
                                            {req.payload && typeof req.payload === 'object' ? (
                                                Object.entries(req.payload).map(([key, value]) => (
                                                    <div key={key} className="flex flex-row items-start gap-[15px] text-[16px]">
                                                        {/* The Field Name */}
                                                        <span className="min-w-[140px] text-[#5c6b73] font-medium mt-[2px]">
                                                            {formatPayloadKey(key)}:
                                                        </span>
                                                        
                                                        {/* The Proposed Value (Styled as a distinct change) */}
                                                        <span className="font-semibold text-[#1a7a3f] bg-[#e4f5ea] px-[12px] py-[4px] border border-[#bbf7d0] rounded-[8px] break-all">
                                                            {String(value)}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-[#a32626] italic text-[14px]">Invalid payload format</p>
                                            )}
                                        </div>
                                    </div>

                                    {req.admin_remarks && (
                                        <div className="mt-[0.15in] rounded-[10px]">
                                            <p className="text-[14px] font-semibold text-[#a32626] mb-1">Admin Remarks:</p>
                                            <p className="text-[16px] text-[#002940]">{req.admin_remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {selectedRequest && modalAction && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Dynamic Header */}
                        <div className={`${modalAction === 'Approve' ? 'bg-[#002940]' : 'bg-[#a32626]'} p-6 text-white text-center transition-colors`}>
                            <h3 className="text-3xl font-bold font-['Montserrat']">{modalAction} Request</h3>
                            <p className={`${modalAction === 'Approve' ? 'text-blue-200' : 'text-red-200'} mt-2 font-medium`}>
                                Verify details before proceeding
                            </p>
                        </div>
                        
                        <div className="p-6">

                            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-y-4 gap-x-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Request ID</p>
                                    <p className="font-bold text-[#002940] truncate" title={selectedRequest.id}>
                                        {selectedRequest.id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Target Bag Serial</p>
                                    <p className="font-bold text-[#002940] truncate">
                                        {selectedRequest.bloodBagSerial}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Submitted By</p>
                                    <p className="font-bold text-[#002940] truncate">
                                        {selectedRequest.staffName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Current Status</p>
                                    <p className="font-bold text-[#002940] capitalize">
                                        {selectedRequest.status}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Admin Remarks {modalAction === "Reject" ? <span className="text-[#a32626]">*</span> : <span className="text-gray-400 font-normal">(Optional)</span>}
                                </label>
                                <textarea
                                    rows={3}
                                    value={rejectionReasonInput}
                                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                                    placeholder={`Type reason for ${modalAction.toLowerCase()}...`}
                                    className="w-full border-2 border-slate-200 rounded-xl p-3 text-[15px] outline-none bg-white text-[#002940] focus:border-[#002940] transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    disabled={isProcessing}
                                    onClick={() => { setSelectedRequest(null); setModalAction(null); }}
                                    className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={isProcessing}
                                    onClick={confirmAction}
                                    className={`flex-1 px-6 py-4 rounded-xl text-white text-lg font-bold transition-colors shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center items-center cursor-pointer ${
                                        modalAction === "Approve" 
                                            ? "bg-emerald-600 hover:bg-emerald-700" 
                                            : "bg-[#a32626] hover:bg-red-800"
                                    }`}
                                >
                                    {isProcessing ? "Processing..." : `Confirm ${modalAction}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}