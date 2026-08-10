"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
    UserPlus,
    ClipboardCheck,
    UserX,
    Droplets,
    Gift,
    ChevronRight,
} from "lucide-react";

import Header from "@/components/HeaderSA";

type StaffType = "Onsite Admin" | "Medical Professional" | "Lab Staff" | "Recovery Staff";

type LogAction =
    | "Registration"
    | "Check-In"
    | "Deferral"
    | "Donation Outcome"
    | "Perk Claiming";

type DonationOutcome = "Successful" | "Incomplete";

type EventInfo = {
    id: string;
    name: string;
};

const events: EventInfo[] = [
    {
        id: "EVT-2026-001",
        name: "DLSU Blood Donation Drive",
    },
    {
        id: "EVT-2026-002",
        name: "Quezon City Blood Drive",
    },
];

type OnsiteLog = {
    id: string;
    staffType: StaffType;
    action: LogAction;
    staff: string;
    donor: string;
    eventName: string;
    timestamp: string;
    donationOutcome?: DonationOutcome;
};

const initialLogs: OnsiteLog[] = [
    {
        id: "LOG-1001",
        staffType: "Onsite Admin",
        action: "Registration",
        staff: "Maria Santos",
        donor: "John Doe",
        eventName: "DLSU Blood Donation Drive",
        timestamp: "15/07/2026 - 8:45 AM",
    },
    {
        id: "LOG-1002",
        staffType: "Onsite Admin",
        action: "Check-In",
        staff: "Maria Santos",
        donor: "John Doe",
        eventName: "DLSU Blood Donation Drive",
        timestamp: "15/07/2026 - 9:02 AM",
    },
    {
        id: "LOG-1003",
        staffType: "Medical Professional",
        action: "Deferral",
        staff: "Jane Doe",
        donor: "Paolo Reyes",
        eventName: "DLSU Blood Donation Drive",
        timestamp: "15/07/2026 - 9:25 AM",
    },
    {
        id: "LOG-1004",
        staffType: "Lab Staff",
        action: "Donation Outcome",
        staff: "Jason Cruz",
        donor: "John Doe",
        eventName: "DLSU Blood Donation Drive",
        timestamp: "15/07/2026 - 10:10 AM",
        donationOutcome: "Successful",
    },
    {
        id: "LOG-1005",
        staffType: "Recovery Staff",
        action: "Perk Claiming",
        staff: "Liza Fernandez",
        donor: "John Doe",
        eventName: "DLSU Blood Donation Drive",
        timestamp: "15/07/2026 - 10:28 AM",
    },
    {
        id: "LOG-1006",
        staffType: "Onsite Admin",
        action: "Registration",
        staff: "Carlo Reyes",
        donor: "June Doe",
        eventName: "Quezon City Blood Drive",
        timestamp: "16/07/2026 - 8:35 AM",
    },
    {
        id: "LOG-1007",
        staffType: "Onsite Admin",
        action: "Check-In",
        staff: "Carlo Reyes",
        donor: "June Doe",
        eventName: "Quezon City Blood Drive",
        timestamp: "16/07/2026 - 8:50 AM",
    },
    {
        id: "LOG-1008",
        staffType: "Lab Staff",
        action: "Donation Outcome",
        staff: "Jason Cruz",
        donor: "June Doe",
        eventName: "Quezon City Blood Drive",
        timestamp: "16/07/2026 - 10:05 AM",
        donationOutcome: "Incomplete",
    },
    {
        id: "LOG-1009",
        staffType: "Recovery Staff",
        action: "Perk Claiming",
        staff: "Liza Fernandez",
        donor: "June Doe",
        eventName: "Quezon City Blood Drive",
        timestamp: "16/07/2026 - 10:20 AM",
    },
];

type StaffTypeFilter = StaffType | "All Staff Types";
type EventFilter = string;
type ActionFilter = LogAction | "All Actions";

const staffTypeOptions: StaffTypeFilter[] = [
    "All Staff Types",
    "Onsite Admin",
    "Medical Professional",
    "Lab Staff",
    "Recovery Staff",
];

const actionOptions: ActionFilter[] = [
    "All Actions",
    "Registration",
    "Check-In",
    "Deferral",
    "Donation Outcome",
    "Perk Claiming",
];

export default function SAOnsiteLogsPage() {
    const [logs] = useState<OnsiteLog[]>(initialLogs);

    const params = useParams();
    const eventId = params.eventId as string;

    const selectedEvent = events.find((event) => event.id === eventId);
    const selectedEventName = selectedEvent?.name || "Selected Event";

    const [staffTypeFilter, setStaffTypeFilter] =
        useState<StaffTypeFilter>("All Staff Types");

    const [actionFilter, setActionFilter] = useState<ActionFilter>("All Actions");

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const eventOptions = [
        "All Events",
        ...Array.from(new Set(logs.map((log) => log.eventName))),
    ];

    let filteredLogs = [...logs];

    if (staffTypeFilter !== "All Staff Types") {
        filteredLogs = filteredLogs.filter(
            (log) => log.staffType === staffTypeFilter
        );
    }

    if (actionFilter !== "All Actions") {
        filteredLogs = filteredLogs.filter((log) => log.action === actionFilter);
    }

    const getActionIcon = (action: LogAction) => {
        if (action === "Registration") {
            return UserPlus;
        } else if (action === "Check-In") {
            return ClipboardCheck;
        } else if (action === "Deferral") {
            return UserX;
        } else if (action === "Donation Outcome") {
            return Droplets;
        } else {
            return Gift;
        }
    };

    const getIconColors = (log: OnsiteLog) => {
        if (log.action === "Deferral") {
            return "bg-[#f5e4e4] text-[#a32626]";
        }

        if (
            log.action === "Donation Outcome" &&
            log.donationOutcome === "Incomplete"
        ) {
            return "bg-[#f7edda] text-[#9a6200]";
        }

        if (log.action === "Donation Outcome") {
            return "bg-[#e4edf5] text-[#1a4d7a]";
        }

        return "bg-[#e4f5ea] text-[#1a7a3f]";
    };

    const getSentence = (log: OnsiteLog) => {
        const actor = <span className="font-bold">{log.staff}</span>;
        const donor = <span className="font-bold">{log.donor}</span>;
        const eventName = <span className="font-bold">{log.eventName}</span>;

        if (log.action === "Registration") {
            return (
                <>
                    {actor} registered donor {donor} at {eventName}
                </>
            );
        }

        if (log.action === "Check-In") {
            return (
                <>
                    {actor} scanned and checked in donor {donor} at {eventName}
                </>
            );
        }

        if (log.action === "Deferral") {
            return (
                <>
                    {actor} deferred donor {donor} after medical screening at{" "}
                    {eventName}
                </>
            );
        }

        if (log.action === "Donation Outcome") {
            return (
                <>
                    {actor} recorded donor {donor}&apos;s donation as{" "}
                    <span className="font-bold">
                        {log.donationOutcome || "Recorded"}
                    </span>{" "}
                    at {eventName}
                </>
            );
        }

        return (
            <>
                {actor} confirmed perk claim for donor {donor} at {eventName}
            </>
        );
    };

    const toggleExpanded = (id: string) => {
        setExpandedId((prev) => {
            if (prev === id) {
                return null;
            }

            return id;
        });
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
                        {selectedEventName}
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-start justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Audit Log
                        </h2>
                    </div>

                    {/* Filters */}
                    <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                        <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                            Filters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-[0.2in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Filter by Staff Type
                                </label>

                                <select
                                    value={staffTypeFilter}
                                    onChange={(event) =>
                                        setStaffTypeFilter(
                                            event.target.value as StaffTypeFilter
                                        )
                                    }
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer outline-none focus:border-[#002940]"
                                >
                                    {staffTypeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Filter by Action
                                </label>

                                <select
                                    value={actionFilter}
                                    onChange={(event) =>
                                        setActionFilter(
                                            event.target.value as ActionFilter
                                        )
                                    }
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer outline-none focus:border-[#002940]"
                                >
                                    {actionOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[0.25in] text-[16px]">
                        <p>
                            Showing {filteredLogs.length} result/s
                        </p>
                    </div>

                    <div className="mt-[0.3in] flex flex-col">
                        {filteredLogs.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No logs found
                                </p>

                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different event, staff type, user, or action
                                    filter.
                                </p>
                            </div>
                        ) : (
                            filteredLogs.map((log) => {
                                const Icon = getActionIcon(log.action);
                                const isExpanded = expandedId === log.id;

                                return (
                                    <div
                                        key={log.id}
                                        className="border-b border-[#e5eaee] last:border-b-0"
                                    >
                                        <button
                                            onClick={() => toggleExpanded(log.id)}
                                            className="w-full flex flex-row items-center gap-[16px] py-[16px] text-left cursor-pointer"
                                        >
                                            <span
                                                className={`flex items-center justify-center w-[40px] h-[40px] rounded-full shrink-0 ${getIconColors(
                                                    log
                                                )}`}
                                            >
                                                <Icon size={20} />
                                            </span>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-[16px] text-[#002940] truncate">
                                                    {getSentence(log)}
                                                </p>

                                                <p className="mt-[2px] text-[13px] text-[#5c6b73]">
                                                    {log.timestamp}
                                                </p>
                                            </div>

                                            <ChevronRight
                                                size={20}
                                                className={`text-[#5c6b73] shrink-0 transition-transform ${
                                                    isExpanded ? "rotate-90" : ""
                                                }`}
                                            />
                                        </button>

                                        {isExpanded && (
                                            <div className="pb-[16px] pl-[56px] pr-[10px]">
                                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[12px] p-[16px] grid grid-cols-1 md:grid-cols-2 gap-x-[0.4in] gap-y-[8px] text-[15px] text-[#002940]">
                                                    <p>
                                                        <span className="font-semibold">
                                                            Log ID:
                                                        </span>{" "}
                                                        {log.id}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            Action:
                                                        </span>{" "}
                                                        {log.action}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            User:
                                                        </span>{" "}
                                                        {log.staff}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            Donor:
                                                        </span>{" "}
                                                        {log.donor}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            Event:
                                                        </span>{" "}
                                                        {log.eventName}
                                                    </p>

                                                    {log.donationOutcome && (
                                                        <p>
                                                            <span className="font-semibold">
                                                                Donation Outcome:
                                                            </span>{" "}
                                                            {log.donationOutcome}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-5 flex flex-row items-center justify-between gap-5">
                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Previous
                        </button>

                        <p className="text-[18px] text-[#002940]">
                            Page 1
                        </p>

                        <button
                            type="button"
                            className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448]"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}