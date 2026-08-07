"use client";

import { useState } from "react";
import {
    UserPlus,
    UserMinus,
    CalendarClock,
    FileText,
    ChevronRight,
} from "lucide-react";

import Header from "@/components/HeaderSA";

type ActorType = "Super Admin" | "Lab Staff" | "Donor";

type LogCategory =
    | "Event Management"
    | "User Management"
    | "Edit Requests";

type LogAction =
    | "User Registration"
    | "User Deletion"
    | "Event Creation"
    | "Event Update"
    | "Event Deletion"
    | "Staff Assignment"
    | "Staff Removal"
    | "Edit Request Submission"
    | "Edit Request Approval"
    | "Edit Request Rejection";

type DatabaseLog = {
    id: string;
    category: LogCategory;
    action: LogAction;
    actor: string;
    actorType: ActorType;
    target: string;
    targetType?: string;
    eventName?: string;
    requestId?: string;
    timestamp: string;
};

const initialLogs: DatabaseLog[] = [
    {
        id: "LOG-2001",
        category: "User Management",
        action: "User Registration",
        actor: "John Doe",
        actorType: "Donor",
        target: "John Doe",
        targetType: "Donor",
        timestamp: "14/07/2026 - 8:12 AM",
    },
    {
        id: "LOG-2002",
        category: "User Management",
        action: "User Registration",
        actor: "June Doe",
        actorType: "Donor",
        target: "June Doe",
        targetType: "Donor",
        timestamp: "14/07/2026 - 8:45 AM",
    },
    {
        id: "LOG-2003",
        category: "User Management",
        action: "User Registration",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Liza Fernandez",
        targetType: "Recovery Staff",
        timestamp: "14/07/2026 - 9:05 AM",
    },
    {
        id: "LOG-2004",
        category: "User Management",
        action: "User Registration",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Lance Garcia",
        targetType: "Lab Staff",
        timestamp: "14/07/2026 - 9:20 AM",
    },
    {
        id: "LOG-2005",
        category: "User Management",
        action: "User Deletion",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Jason Doe",
        targetType: "Medical Professional",
        timestamp: "14/07/2026 - 10:40 AM",
    },
    {
        id: "LOG-2006",
        category: "User Management",
        action: "User Deletion",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Old Chapter Admin",
        targetType: "Onsite Admin",
        timestamp: "14/07/2026 - 11:15 AM",
    },
    {
        id: "LOG-2007",
        category: "Event Management",
        action: "Event Creation",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Quezon City Blood Drive",
        eventName: "Quezon City Blood Drive",
        timestamp: "15/07/2026 - 8:30 AM",
    },
    {
        id: "LOG-2008",
        category: "Event Management",
        action: "Event Update",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Quezon City Blood Drive",
        eventName: "Quezon City Blood Drive",
        timestamp: "15/07/2026 - 9:10 AM",
    },
    {
        id: "LOG-2009",
        category: "Event Management",
        action: "Staff Assignment",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Maria Santos",
        targetType: "Onsite Admin",
        eventName: "Quezon City Blood Drive",
        timestamp: "15/07/2026 - 9:35 AM",
    },
    {
        id: "LOG-2010",
        category: "Event Management",
        action: "Staff Assignment",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Jane Doe",
        targetType: "Medical Professional",
        eventName: "Quezon City Blood Drive",
        timestamp: "15/07/2026 - 9:40 AM",
    },
    {
        id: "LOG-2011",
        category: "Event Management",
        action: "Event Deletion",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Pasig City Blood Drive",
        eventName: "Pasig City Blood Drive",
        timestamp: "15/07/2026 - 10:25 AM",
    },
    {
        id: "LOG-2012",
        category: "Edit Requests",
        action: "Edit Request Submission",
        actor: "Lance Garcia",
        actorType: "Lab Staff",
        target: "Blood Test Result Change",
        requestId: "REQ-001",
        timestamp: "16/07/2026 - 1:05 PM",
    },
    {
        id: "LOG-2013",
        category: "Edit Requests",
        action: "Edit Request Approval",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Blood Test Result Change",
        requestId: "REQ-001",
        timestamp: "16/07/2026 - 1:40 PM",
    },
    {
        id: "LOG-2014",
        category: "Edit Requests",
        action: "Edit Request Submission",
        actor: "June Cruz",
        actorType: "Lab Staff",
        target: "Blood Type Correction",
        requestId: "REQ-002",
        timestamp: "16/07/2026 - 2:15 PM",
    },
    {
        id: "LOG-2015",
        category: "Edit Requests",
        action: "Edit Request Rejection",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Blood Type Correction",
        requestId: "REQ-002",
        timestamp: "16/07/2026 - 2:45 PM",
    },
    {
        id: "LOG-2016",
        category: "Event Management",
        action: "Staff Removal",
        actor: "Alex Cruz",
        actorType: "Super Admin",
        target: "Maria Santos",
        targetType: "Onsite Admin",
        eventName: "Quezon City Blood Drive",
        timestamp: "15/07/2026 - 9:55 AM",
    },
];

type ActorTypeFilter = ActorType | "All Staff Types";
type CategoryFilter = LogCategory | "All Categories";
type ActionFilter = LogAction | "All Actions";

const actorTypeOptions: ActorTypeFilter[] = [
    "All Staff Types",
    "Super Admin",
    "Lab Staff",
    "Donor",
];

const categoryOptions: CategoryFilter[] = [
    "All Categories",
    "Event Management",
    "User Management",
    "Edit Requests",
];

const actionOptions: ActionFilter[] = [
    "All Actions",
    "User Registration",
    "User Deletion",
    "Event Creation",
    "Event Update",
    "Event Deletion",
    "Staff Assignment",
    "Staff Removal",
    "Edit Request Submission",
    "Edit Request Approval",
    "Edit Request Rejection",
];

export default function SADatabaseLogsPage() {
    const [logs] = useState<DatabaseLog[]>(initialLogs);

    const [actorTypeFilter, setActorTypeFilter] =
        useState<ActorTypeFilter>("All Staff Types");

    const [categoryFilter, setCategoryFilter] =
        useState<CategoryFilter>("All Categories");

    const [actionFilter, setActionFilter] =
        useState<ActionFilter>("All Actions");

    const [expandedId, setExpandedId] = useState<string | null>(null);

    let filteredLogs = [...logs];

    if (actorTypeFilter !== "All Staff Types") {
        filteredLogs = filteredLogs.filter(
            (log) => log.actorType === actorTypeFilter
        );
    }

    if (categoryFilter !== "All Categories") {
        filteredLogs = filteredLogs.filter(
            (log) => log.category === categoryFilter
        );
    }

    if (actionFilter !== "All Actions") {
        filteredLogs = filteredLogs.filter(
            (log) => log.action === actionFilter
        );
    }

    const getActionIcon = (action: LogAction) => {
        if (action === "User Registration") {
            return UserPlus;
        } else if (action === "User Deletion") {
            return UserMinus;
        } else if (
            action === "Event Creation" ||
            action === "Event Update" ||
            action === "Event Deletion" ||
            action === "Staff Assignment" ||
            action === "Staff Removal"
        ) {
            return CalendarClock;
        } else {
            return FileText;
        }
    };

    const getIconColors = (log: DatabaseLog) => {
        if (
            log.action === "User Registration" ||
            log.action === "Event Creation" ||
            log.action === "Staff Assignment" ||
            log.action === "Edit Request Approval"
        ) {
            return "bg-[#e4f5ea] text-[#1a7a3f]";
        }

        if (
            log.action === "Event Update" ||
            log.action === "Edit Request Submission"
        ) {
            return "bg-[#e4edf5] text-[#1a4d7a]";
        }

        return "bg-[#f5e4e4] text-[#a32626]";
    };

    const getSentence = (log: DatabaseLog) => {
        const actor = <span className="font-bold">{log.actor}</span>;
        const target = <span className="font-bold">{log.target}</span>;
        const eventName = <span className="font-bold">{log.eventName}</span>;
        const requestId = <span className="font-bold">{log.requestId}</span>;

        if (log.action === "User Registration") {
            if (log.actor === log.target) {
                return (
                    <>
                        {actor} manually registered an account
                    </>
                );
            }

            return (
                <>
                    {actor} registered a new account for {target}
                </>
            );
        }

        if (log.action === "User Deletion") {
            return (
                <>
                    {actor} deleted the account of {target}
                </>
            );
        }

        if (log.action === "Event Creation") {
            return (
                <>
                    {actor} created event {target}
                </>
            );
        }

        if (log.action === "Event Update") {
            return (
                <>
                    {actor} updated event {target}
                </>
            );
        }

        if (log.action === "Event Deletion") {
            return (
                <>
                    {actor} deleted event {target}
                </>
            );
        }

        if (log.action === "Staff Assignment") {
            return (
                <>
                    {actor} assigned {target} to {eventName}
                </>
            );
        }

        if (log.action === "Staff Removal") {
            return (
                <>
                    {actor} removed {target} from {eventName}
                </>
            );
        }

        if (log.action === "Edit Request Submission") {
            return (
                <>
                    {actor} submitted edit request {requestId} for {target}
                </>
            );
        }

        if (log.action === "Edit Request Approval") {
            return (
                <>
                    {actor} approved edit request {requestId} for {target}
                </>
            );
        }

        return (
            <>
                {actor} rejected edit request {requestId} for {target}
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
                        Database Logs
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-start justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Audit Log
                        </h2>
                    </div>

                    <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                        <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                            Filters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.2in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Filter by Staff Type
                                </label>

                                <select
                                    value={actorTypeFilter}
                                    onChange={(event) =>
                                        setActorTypeFilter(
                                            event.target.value as ActorTypeFilter
                                        )
                                    }
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer outline-none focus:border-[#002940]"
                                >
                                    {actorTypeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Filter by Category
                                </label>

                                <select
                                    value={categoryFilter}
                                    onChange={(event) =>
                                        setCategoryFilter(
                                            event.target.value as CategoryFilter
                                        )
                                    }
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer outline-none focus:border-[#002940]"
                                >
                                    {categoryOptions.map((option) => (
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

                    <div className="mt-[0.25in] flex flex-col">
                        {filteredLogs.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No logs found
                                </p>

                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different staff type, category, or action filter.
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
                                                            Category:
                                                        </span>{" "}
                                                        {log.category}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            Action:
                                                        </span>{" "}
                                                        {log.action}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            Staff Type:
                                                        </span>{" "}
                                                        {log.actorType}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            User:
                                                        </span>{" "}
                                                        {log.actor}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold">
                                                            Target:
                                                        </span>{" "}
                                                        {log.target}
                                                    </p>

                                                    {log.targetType && (
                                                        <p>
                                                            <span className="font-semibold">
                                                                Target Type:
                                                            </span>{" "}
                                                            {log.targetType}
                                                        </p>
                                                    )}

                                                    {log.eventName && (
                                                        <p>
                                                            <span className="font-semibold">
                                                                Event:
                                                            </span>{" "}
                                                            {log.eventName}
                                                        </p>
                                                    )}

                                                    {log.requestId && (
                                                        <p>
                                                            <span className="font-semibold">
                                                                Request ID:
                                                            </span>{" "}
                                                            {log.requestId}
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