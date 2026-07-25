"use client";

import { useState } from "react";
import Header from "@/components/HeaderSA";

type RequestStatus = "Pending" | "Approved" | "Rejected";
type UserRole = "SA" | "RBD" | "RS" | "LS" | "MP" | "OA" | "D";
type StatusTab = "All" | RequestStatus;

type RequestType =
    | "Blood Test Result Change"
    | "Account Role Upgrade"
    | "Data Correction";

type SARequest = {
    id: string;
    requesterName: string;
    requesterEmail: string;
    role: UserRole;
    requestType: RequestType;
    details: string;
    status: RequestStatus;
    dateSubmitted: string;
    facility?: string;
    rejectionReason?: string; // Optional field for rejection feedback
};

const initialRequests: SARequest[] = [
    {
        id: "REQ-001",
        requesterName: "John Doe",
        requesterEmail: "john.doe@example.com",
        role: "LS",
        requestType: "Blood Test Result Change",
        details: "Requesting update to Hemoglobin count from 11.2 g/dL to 13.5 g/dL for Sample #BT-8842 following secondary lab re-test.",
        status: "Pending",
        dateSubmitted: "2026-07-24",
        facility: "Central Red Cross Lab",
    },
    {
        id: "REQ-002",
        requesterName: "Jane Doe",
        requesterEmail: "jane.doe@example.com",
        role: "LS",
        requestType: "Blood Test Result Change",
        details: "Amend Infectious Disease Screening status for Unit #B-9021 from 'Inconclusive' to 'Passed' after confirmatory testing.",
        status: "Pending",
        dateSubmitted: "2026-07-23",
        facility: "Regional Blood Center Lab",
    },
    {
        id: "REQ-003",
        requesterName: "Jean Doe",
        requesterEmail: "jean.doe@example.com",
        role: "MP",
        requestType: "Account Role Upgrade",
        details: "Requesting elevation from Medical Professional to Onsite Admin privileges for new station duty.",
        status: "Approved",
        dateSubmitted: "2026-07-20",
        facility: "City General Hospital",
    },
    {
        id: "REQ-004",
        requesterName: "Johnny Doe",
        requesterEmail: "johnny.doe@example.com",
        role: "LS",
        requestType: "Blood Test Result Change",
        details: "Correction of Blood Grouping typo from A- to A+ for Donor Record #D-005 following standard verification protocol.",
        status: "Rejected",
        dateSubmitted: "2026-07-18",
        facility: "Metro Health Lab",
        rejectionReason: "Missing signed secondary lab verification document from head pathologist.",
    },
];

type SortOption =
    | "Default"
    | "Name: A-Z"
    | "Date Submitted: Latest"
    | "Date Submitted: Earliest"
    | "Role: A-Z"
    | "Status";

export default function SARequestsPage() {
    const [requests, setRequests] = useState<SARequest[]>(initialRequests);
    const [activeTab, setActiveTab] = useState<StatusTab>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");

    // Modal state for Approval / Rejection
    const [selectedRequest, setSelectedRequest] = useState<SARequest | null>(null);
    const [modalAction, setModalAction] = useState<"Approve" | "Reject" | null>(null);
    const [rejectionReasonInput, setRejectionReasonInput] = useState("");

    const tabs: StatusTab[] = ["All", "Pending", "Approved", "Rejected"];

    const sortOptions: SortOption[] = [
        "Default",
        "Name: A-Z",
        "Date Submitted: Latest",
        "Date Submitted: Earliest",
        "Role: A-Z",
        "Status",
    ];

    // Filter Logic
    let filteredRequests = [...requests];

    if (activeTab !== "All") {
        filteredRequests = filteredRequests.filter((req) => req.status === activeTab);
    }

    if (search.trim() !== "") {
        const query = search.trim().toLowerCase();
        filteredRequests = filteredRequests.filter(
            (req) =>
                req.requesterName.toLowerCase().includes(query) ||
                req.requesterEmail.toLowerCase().includes(query) ||
                req.role.toLowerCase().includes(query) ||
                req.requestType.toLowerCase().includes(query) ||
                req.details.toLowerCase().includes(query) ||
                req.id.toLowerCase().includes(query) ||
                (req.facility && req.facility.toLowerCase().includes(query)) ||
                (req.rejectionReason && req.rejectionReason.toLowerCase().includes(query))
        );
    }

    // Sort Logic
    filteredRequests.sort((a, b) => {
        if (sortBy === "Name: A-Z") {
            return a.requesterName.localeCompare(b.requesterName);
        } else if (sortBy === "Date Submitted: Earliest") {
            return a.dateSubmitted.localeCompare(b.dateSubmitted);
        } else if (sortBy === "Date Submitted: Latest") {
            return b.dateSubmitted.localeCompare(a.dateSubmitted);
        } else if (sortBy === "Role: A-Z") {
            return a.role.localeCompare(b.role);
        } else if (sortBy === "Status") {
            return a.status.localeCompare(b.status);
        }
        return 0;
    });

    const handleActionClick = (req: SARequest, action: "Approve" | "Reject") => {
        setSelectedRequest(req);
        setModalAction(action);
        setRejectionReasonInput("");
    };

    const confirmAction = () => {
        if (!selectedRequest || !modalAction) return;

        const updatedStatus: RequestStatus = modalAction === "Approve" ? "Approved" : "Rejected";

        setRequests((prev) =>
            prev.map((req) =>
                req.id === selectedRequest.id
                    ? {
                        ...req,
                        status: updatedStatus,
                        rejectionReason:
                            modalAction === "Reject"
                                ? rejectionReasonInput.trim() || "No specific reason provided."
                                : undefined,
                    }
                    : req
            )
        );

        setSelectedRequest(null);
        setModalAction(null);
        setRejectionReasonInput("");
    };

    const getTabClass = (tab: StatusTab) => {
        let className =
            "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

        if (activeTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className += "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };

    const getStatusPill = (status: RequestStatus) => {
        let className = "px-[12px] py-[6px] rounded-full text-[14px] font-semibold ";

        if (status === "Approved") {
            className += "bg-[#e4f5ea] text-[#1a7a3f]";
        } else if (status === "Pending") {
            className += "bg-[#fef9c3] text-[#854d0e]";
        } else {
            className += "bg-[#f5e4e4] text-[#a32626]";
        }

        return className;
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Super Admin
                    </p>

                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        Requests
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                System Requests
                            </h2>
                        </div>

                        <div className="flex flex-row items-center flex-wrap gap-[10px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={getTabClass(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                        <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                            Filters
                        </h3>

                        <div className="flex flex-row items-center justify-between flex-wrap gap-[0.2in]">
                            <div className="flex-1 min-w-[3in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Search by
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Input name, email, ID, details, or facility"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                />
                            </div>

                            <div className="w-full sm:w-[3in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Sort By
                                </label>

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value as SortOption)
                                    }
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {filteredRequests.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No requests found
                                </p>

                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different search term, sort option, or tab filter.
                                </p>
                            </div>
                        ) : (
                            filteredRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                                >
                                    {/* Header Banner - Bubble Removed */}
                                    <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                        <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                            {req.requesterName}
                                        </h2>

                                        {req.status === "Pending" && (
                                            <div className="flex flex-row gap-[10px]">
                                                <button
                                                    onClick={() => handleActionClick(req, "Approve")}
                                                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-[#e4f5ea] text-[#1a7a3f] cursor-pointer hover:bg-white"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleActionClick(req, "Reject")}
                                                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#a32626] cursor-pointer hover:bg-[#fef2f2]"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Body Details */}
                                    <div className="p-[0.35in]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Request ID:
                                                </span>{" "}
                                                {req.id}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Email:
                                                </span>{" "}
                                                {req.requesterEmail}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Role:
                                                </span>{" "}
                                                {req.role}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Request Type:
                                                </span>{" "}
                                                {req.requestType}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Facility:
                                                </span>{" "}
                                                {req.facility || "N/A"}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Date Submitted:
                                                </span>{" "}
                                                {req.dateSubmitted}
                                            </p>

                                            <p className="flex items-center gap-[10px]">
                                                <span className="font-semibold text-[#002940]">
                                                    Status:
                                                </span>{" "}
                                                <span className={getStatusPill(req.status)}>
                                                    {req.status}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Request Description / Details */}
                                        <div className="mt-[0.2in] p-[0.15in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[10px]">
                                            <p className="text-[14px] font-semibold text-[#002940] mb-1">
                                                Request Details & Justification:
                                            </p>
                                            <p className="text-[16px] text-[#002940]">
                                                {req.details}
                                            </p>
                                        </div>

                                        {/* Rejection Reason Display Box */}
                                        {req.status === "Rejected" && req.rejectionReason && (
                                            <div className="mt-[0.15in] p-[0.15in] bg-[#fef2f2] border-2 border-[#f5c6c6] rounded-[10px]">
                                                <p className="text-[14px] font-semibold text-[#a32626] mb-1">
                                                    Reason for Rejection:
                                                </p>
                                                <p className="text-[16px] text-[#002940]">
                                                    {req.rejectionReason}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Action Confirmation Modal */}
            {selectedRequest && modalAction && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            {modalAction} Request?
                        </h2>

                        <p className="mt-[0.15in] text-[16px] text-[#002940]">
                            Are you sure you want to {modalAction.toLowerCase()}{" "}
                            <span className="font-semibold">{selectedRequest.requesterName}</span>'s request ({selectedRequest.requestType})?
                        </p>

                        {/* Rejection Reason Input Field */}
                        {modalAction === "Reject" && (
                            <div className="mt-[0.2in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Reason for Rejection <span className="text-[#a32626]">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={rejectionReasonInput}
                                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                                    placeholder="Type the reason for rejecting this request..."
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] p-[12px] text-[15px] outline-none bg-white text-[#002940] focus:border-[#a32626] resize-none"
                                />
                            </div>
                        )}

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                onClick={() => {
                                    setSelectedRequest(null);
                                    setModalAction(null);
                                    setRejectionReasonInput("");
                                }}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmAction}
                                className={`px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold text-white cursor-pointer hover:opacity-90 ${
                                    modalAction === "Approve" ? "bg-[#1a7a3f]" : "bg-[#a32626]"
                                }`}
                            >
                                Confirm {modalAction}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}