"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    UserPlus,
    ClipboardCheck,
    UserX,
    Droplets,
    Gift,
    ChevronRight,
} from "lucide-react";

import Header from "@/components/HeaderSA";
import { executeQueryEventRecords } from "@/app/event_records/event_action";
import { ViewEventRecords } from "@/types/event_type";
import { AccessType } from "@/db/enums/access_level";
import { EventRecordAction } from "@/db/enums/event_action";

type OnsiteLog = {
    id: string;
    staffType: string;
    action: string;
    rawAction: EventRecordAction;
    staff: string;
    donor: string;
    eventName: string;
    timestamp: string;
};

type DonationOutcome = "Successful" | "Incomplete";

type StaffTypeFilter =
    | "Onsite Admin"
    | "Medical Professional"
    | "Lab Staff"
    | "Recovery Staff"
    | "All Staff Types";

type ActionFilter =
    | "Registration"
    | "Check-In"
    | "Deferral"
    | "Donation Outcome"
    | "Perk Claiming"
    | "All Actions";

const roleLabels: Record<AccessType, string> = {
    donor: "Donor",
    onsite_admin: "Onsite Admin",
    med_prof: "Medical Professional",
    director: "Director",
    super_admin: "Super Admin",
    lab_staff: "Lab Staff",
    recov_staff: "Recovery Staff",
};

const actionLabels: Record<EventRecordAction, string> = {
    register: "Registration",
    check_in: "Check-In",
    deferral: "Deferral",
    perk_claim: "Perk Claiming",
    donate_success: "Donation Outcome",
    donate_fail: "Donation Outcome",
};

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

const getDonationOutcome = (
    action: EventRecordAction
): DonationOutcome | undefined => {
    if (action === "donate_success") return "Successful";
    if (action === "donate_fail") return "Incomplete";
    return undefined;
};

const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export default function SAOnsiteLogsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId as string;

    const PAGE_SIZE = 8;

    const [logs, setLogs] = useState<OnsiteLog[]>([]);
    const [logsLoading, setLogsLoading] = useState(true);
    const [logsError, setLogsError] = useState("");
    const [eventName, setEventName] = useState("Event Logs");

    const [staffTypeFilter, setStaffTypeFilter] =
        useState<StaffTypeFilter>("All Staff Types");

    const [actionFilter, setActionFilter] = useState<ActionFilter>("All Actions");

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadLogs = async () => {
            setLogsLoading(true);
            setLogsError("");
            setPage(1);

            try {
                const result = await executeQueryEventRecords(BigInt(eventId));

                if (result.success && result.data) {
                    const mapped: OnsiteLog[] = result.data.map(
                        (record, index) => ({
                            id: `LOG-${index + 1}`,
                            staffType: roleLabels[record.staff_role],
                            action: actionLabels[record.action],
                            rawAction: record.action,
                            staff: record.staff_name,
                            donor:
                                `${record.donor_first_name} ${record.donor_last_name}`.trim(),
                            eventName: record.event_name,
                            timestamp: formatTime(record.time),
                        })
                    );

                    setLogs(mapped);

                    if (result.data.length > 0) {
                        setEventName(result.data[0].event_name);
                    }
                } else {
                    setLogsError(result.message);
                    setLogs([]);
                }
            } catch (err: any) {
                setLogsError(err?.message ?? "Failed to load event logs.");
                setLogs([]);
            }

            setLogsLoading(false);
        };

        loadLogs();
    }, [eventId]);

    let filteredLogs = [...logs];

    if (staffTypeFilter !== "All Staff Types") {
        filteredLogs = filteredLogs.filter(
            (log) => log.staffType === staffTypeFilter
        );
    }

    if (actionFilter !== "All Actions") {
        filteredLogs = filteredLogs.filter((log) => log.action === actionFilter);
    }

    const pageCount = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const pagedLogs = filteredLogs.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const getActionIcon = (action: EventRecordAction) => {
        if (action === "register") {
            return UserPlus;
        } else if (action === "check_in") {
            return ClipboardCheck;
        } else if (action === "deferral") {
            return UserX;
        } else if (action === "perk_claim") {
            return Gift;
        }

        return Droplets;
    };

    const getIconColors = (log: OnsiteLog) => {
        if (log.action === "Deferral") {
            return "bg-[#f5e4e4] text-[#a32626]";
        }

        if (
            log.action === "Donation Outcome" &&
            getDonationOutcome(log.rawAction) === "Incomplete"
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

        if (log.rawAction === "register") {
            return (
                <>
                    {actor} registered donor {donor} at {eventName}
                </>
            );
        }

        if (log.rawAction === "check_in") {
            return (
                <>
                    {actor} scanned and checked in donor {donor} at {eventName}
                </>
            );
        }

        if (log.rawAction === "deferral") {
            return (
                <>
                    {actor} deferred donor {donor} after medical screening at{" "}
                    {eventName}
                </>
            );
        }

        if (
            log.rawAction === "donate_success" ||
            log.rawAction === "donate_fail"
        ) {
            return (
                <>
                    {actor} recorded donor {donor}&apos;s donation as{" "}
                    <span className="font-bold">
                        {getDonationOutcome(log.rawAction) || "Recorded"}
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

    const goBack = () => {
        router.push("/sa/management/logs/events");
    };

    if (logsLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading logs...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Super Admin
                    </p>

                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        {eventName}
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-start justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Audit Log
                        </h2>

                        <button
                            type="button"
                            onClick={goBack}
                            className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                        >
                            Back
                        </button>
                    </div>

                    {logsError && (
                        <div className="mt-[0.25in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-[0.35in] text-center">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                {logsError}
                            </p>
                        </div>
                    )}

                    {!logsError && (
                        <>
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
                                                    event.target
                                                        .value as StaffTypeFilter
                                                )
                                            }
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer outline-none focus:border-[#002940]"
                                        >
                                            {staffTypeOptions.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
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
                                                    event.target
                                                        .value as ActionFilter
                                                )
                                            }
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer outline-none focus:border-[#002940]"
                                        >
                                            {actionOptions.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
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
                                {pagedLogs.length === 0 ? (
                                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                        <p className="text-[18px] font-semibold text-[#002940]">
                                            No logs found
                                        </p>

                                        <p className="mt-1 text-[16px] text-[#5c6b73]">
                                            Try a different staff type or action
                                            filter.
                                        </p>
                                    </div>
                                ) : (
                                    pagedLogs.map((log) => {
                                        const Icon = getActionIcon(log.rawAction);
                                        const isExpanded = expandedId === log.id;

                                        return (
                                            <div
                                                key={log.id}
                                                className="border-b border-[#e5eaee] last:border-b-0"
                                            >
                                                <button
                                                    onClick={() =>
                                                        toggleExpanded(log.id)
                                                    }
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
                                                            isExpanded
                                                                ? "rotate-90"
                                                                : ""
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

                                                            {getDonationOutcome(
                                                                log.rawAction
                                                            ) && (
                                                                <p>
                                                                    <span className="font-semibold">
                                                                        Donation
                                                                        Outcome:
                                                                    </span>{" "}
                                                                    {getDonationOutcome(
                                                                        log.rawAction
                                                                    )}
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
                                    onClick={() => setPage(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <p className="text-[18px] text-[#002940]">
                                    Page {currentPage} of {pageCount}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setPage(currentPage + 1)}
                                    disabled={currentPage >= pageCount}
                                    className="px-[5px] py-[5px] w-[1in] rounded-[10px] bg-white text-[#002940] text-[18px] font-semibold cursor-pointer hover:underline hover:text-[#fd5448] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
