"use client";
import { useState } from "react";
import {
    UserPlus,
    ShieldPlus,
    CalendarClock,
    ChevronDown,
    ChevronRight,
    ListFilter,
} from "lucide-react";

import Header from "@/components/HeaderSA";

type LogCategory = "Donor Registration" | "Staff Admin Registration" | "Event Update";
type LogAction = "Created" | "Updated" | "Approved" | "Rejected" | "Deleted";

type OffsiteLog = {
    id: string;
    category: LogCategory;
    action: LogAction;
    actor: string;
    subject: string;
    site: string;
    timestamp: string;
    details: string;
};

const initialLogs: OffsiteLog[] = [
    {
        id: "LOG-1001",
        category: "Donor Registration",
        action: "Created",
        actor: "Red Cross Chapter",
        subject: "Maria Santos",
        site: "Quezon City Blood Drive",
        timestamp: "14/07/2026 - 9:14 AM",
        details: "New donor registered onsite ahead of scheduled donation.",
    },
    {
        id: "LOG-1002",
        category: "Staff Admin Registration",
        action: "Created",
        actor: "Alex Cruz",
        subject: "Red Cross Chapter",
        site: "Quezon City Blood Drive",
        timestamp: "13/07/2026 - 8:02 AM",
        details: "Onsite Admin account created for chapter staff ahead of event.",
    },
    {
        id: "LOG-1003",
        category: "Event Update",
        action: "Updated",
        actor: "Jane Doe",
        subject: "Quezon City Blood Drive",
        site: "Quezon City Blood Drive",
        timestamp: "13/07/2026 - 4:47 PM",
        details: "Updated event capacity from 80 to 100 donor slots.",
    },
    {
        id: "LOG-1004",
        category: "Donor Registration",
        action: "Rejected",
        actor: "Red Cross Chapter",
        subject: "Paolo Reyes",
        site: "Marikina Barangay Hall",
        timestamp: "13/07/2026 - 1:20 PM",
        details: "Registration rejected due to failed health screening.",
    },
    {
        id: "LOG-1005",
        category: "Event Update",
        action: "Created",
        actor: "Alex Cruz",
        subject: "Marikina Barangay Hall",
        site: "Marikina Barangay Hall",
        timestamp: "13/07/2026 - 10:05 AM",
        details: "New donation event scheduled for August 2026.",
    },
    {
        id: "LOG-1006",
        category: "Staff Admin Registration",
        action: "Updated",
        actor: "Alex Cruz",
        subject: "June Doe",
        site: "N/A",
        timestamp: "13/07/2026 - 3:33 PM",
        details: "Staff admin contact email updated per chapter request.",
    },
    {
        id: "LOG-1007",
        category: "Event Update",
        action: "Deleted",
        actor: "Alex Cruz",
        subject: "Pasig City Blood Drive",
        site: "Pasig City Blood Drive",
        timestamp: "13/07/2026 - 11:52 AM",
        details: "Event cancelled and removed due to venue conflict.",
    },
    {
        id: "LOG-1008",
        category: "Donor Registration",
        action: "Approved",
        actor: "Jason Doe",
        subject: "Liza Fernandez",
        site: "Quezon City Blood Drive",
        timestamp: "13/07/2026 - 2:10 PM",
        details: "Donor cleared after screening and approved for donation.",
    },
];

type CategoryFilter = LogCategory | "All Types";
type ActionFilter = LogAction | "All Actions";

const categoryOptions: CategoryFilter[] = [
    "All Types",
    "Donor Registration",
    "Staff Admin Registration",
    "Event Update",
];

const actionOptions: ActionFilter[] = [
    "All Actions",
    "Created",
    "Updated",
    "Approved",
    "Rejected",
    "Deleted",
];

export default function SAOffsiteLogsPage() {
    const [logs] = useState<OffsiteLog[]>(initialLogs);

    const [userFilter, setUserFilter] = useState<string>("All Users");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All Types");
    const [actionFilter, setActionFilter] = useState<ActionFilter>("All Actions");

    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const userOptions = ["All Users", ...Array.from(new Set(logs.map((log) => log.actor)))];

    let filteredLogs = logs;

    if (userFilter !== "All Users") {
        filteredLogs = filteredLogs.filter((log) => log.actor === userFilter);
    }

    if (categoryFilter !== "All Types") {
        filteredLogs = filteredLogs.filter((log) => log.category === categoryFilter);
    }

    if (actionFilter !== "All Actions") {
        filteredLogs = filteredLogs.filter((log) => log.action === actionFilter);
    }

    const getCategoryIcon = (category: LogCategory) => {
        if (category === "Donor Registration") return UserPlus;
        if (category === "Staff Admin Registration") return ShieldPlus;
        return CalendarClock;
    };

    const getIconColors = (action: LogAction) => {
        if (action === "Created" || action === "Approved") {
            return "bg-[#e4f5ea] text-[#1a7a3f]";
        }
        if (action === "Updated") {
            return "bg-[#e4edf5] text-[#1a4d7a]";
        }
        return "bg-[#f5e4e4] text-[#a32626]";
    };

    const getSentence = (log: OffsiteLog) => {
        const actor = <span className="font-bold">{log.actor}</span>;
        const subject = <span className="font-bold">{log.subject}</span>;
        const site = <span className="font-bold">{log.site}</span>;

        if (log.category === "Donor Registration") {
            if (log.action === "Created") {
                return <>{actor} registered a new donor {subject} at {site}</>;
            }
            if (log.action === "Approved") {
                return <>{actor} approved donor registration for {subject} at {site}</>;
            }
            if (log.action === "Rejected") {
                return <>{actor} rejected donor registration for {subject} at {site}</>;
            }
            return <>{actor} updated donor registration for {subject} at {site}</>;
        }

        if (log.category === "Staff Admin Registration") {
            if (log.action === "Created") {
                return <>{actor} created a staff admin account for {subject}</>;
            }
            if (log.action === "Updated") {
                return <>{actor} updated staff admin details for {subject}</>;
            }
            return <>{actor} {log.action.toLowerCase()} staff admin account for {subject}</>;
        }

        if (log.action === "Created") {
            return <>{actor} created a new event {subject}</>;
        }
        if (log.action === "Updated") {
            return <>{actor} updated event {subject}</>;
        }
        if (log.action === "Deleted") {
            return <>{actor} deleted event {subject}</>;
        }
        return <>{actor} {log.action.toLowerCase()} event {subject}</>;
    };

    const toggleExpanded = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
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
                        Offsite Logs
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-start justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Audit Log
                        </h2>

                        <div className="flex flex-row flex-wrap gap-[20px]">
                            <div className="relative">
                                <p className="mb-[6px] text-[14px] font-semibold text-[#002940]">
                                    Filter by User
                                </p>

                                <button
                                    onClick={() => {
                                        setUserDropdownOpen((prev) => !prev);
                                        setCategoryDropdownOpen(false);
                                    }}
                                    className="w-[220px] flex flex-row items-center justify-between border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer"
                                >
                                    {userFilter}
                                    <ChevronDown size={18} />
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute z-10 mt-[6px] w-[220px] bg-white border-2 border-[#c0cad0] rounded-[10px] shadow-md overflow-hidden max-h-[220px] overflow-y-auto">
                                        {userOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setUserFilter(option);
                                                    setUserDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-[14px] py-[10px] text-[15px] text-[#002940] hover:bg-[#f9fdff] cursor-pointer"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <p className="mb-[6px] text-[14px] font-semibold text-[#002940]">
                                    Filter by Type
                                </p>

                                <button
                                    onClick={() => {
                                        setCategoryDropdownOpen((prev) => !prev);
                                        setUserDropdownOpen(false);
                                    }}
                                    className="w-[240px] flex flex-row items-center justify-between border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer"
                                >
                                    {categoryFilter}
                                    <ChevronDown size={18} />
                                </button>

                                {categoryDropdownOpen && (
                                    <div className="absolute z-10 mt-[6px] w-[240px] bg-white border-2 border-[#c0cad0] rounded-[10px] shadow-md overflow-hidden">
                                        {categoryOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setCategoryFilter(option);
                                                    setCategoryDropdownOpen(false);
                                                }}
                                                className="w-full flex flex-row items-center gap-[10px] text-left px-[14px] py-[10px] text-[15px] text-[#002940] hover:bg-[#f9fdff] cursor-pointer"
                                            >
                                                <ListFilter size={16} className="text-[#5c6b73]" />
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="mb-[6px] text-[14px] font-semibold text-[#002940]">
                                    Filter by Action
                                </p>

                                <select
                                    value={actionFilter}
                                    onChange={(event) => setActionFilter(event.target.value as ActionFilter)}
                                    className="w-[180px] border-2 border-[#c0cad0] rounded-[10px] px-[14px] py-[10px] text-[16px] text-[#002940] bg-white cursor-pointer outline-none focus:border-[#002940]"
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

                    <div className="mt-[0.3in] flex flex-col">
                        {filteredLogs.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No logs found
                                </p>
                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different filter.
                                </p>
                            </div>
                        ) : (
                            filteredLogs.map((log) => {
                                const Icon = getCategoryIcon(log.category);
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
                                                    log.action
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
                                                        <span className="font-semibold">Log ID:</span> {log.id}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Category:</span> {log.category}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Action:</span> {log.action}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Site / Event:</span> {log.site}
                                                    </p>
                                                    <p className="md:col-span-2 text-[#5c6b73]">
                                                        {log.details}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
