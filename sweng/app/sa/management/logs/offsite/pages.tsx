"use client";
import { useState } from "react";

import Header from "@/components/HeaderSA";

type LogCategory = "Donor Registration" | "Staff Admin Registration" | "Event Update";
type CategoryTab = LogCategory | "All";
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
        actor: "Red Cross Chapter (Onsite Admin)",
        subject: "Maria Santos",
        site: "Quezon City Blood Drive",
        timestamp: "Jul 27, 2026 - 9:14 AM",
        details: "New donor registered onsite ahead of scheduled donation.",
    },
    {
        id: "LOG-1002",
        category: "Staff Admin Registration",
        action: "Created",
        actor: "Alex Cruz (Super Admin)",
        subject: "Red Cross Chapter",
        site: "Quezon City Blood Drive",
        timestamp: "Jul 27, 2026 - 8:02 AM",
        details: "Onsite Admin account created for chapter staff ahead of event.",
    },
    {
        id: "LOG-1003",
        category: "Event Update",
        action: "Updated",
        actor: "Jane Doe (Medical Professional)",
        subject: "Quezon City Blood Drive",
        site: "Quezon City Blood Drive",
        timestamp: "Jul 26, 2026 - 4:47 PM",
        details: "Updated event capacity from 80 to 100 donor slots.",
    },
    {
        id: "LOG-1004",
        category: "Donor Registration",
        action: "Rejected",
        actor: "Red Cross Chapter (Onsite Admin)",
        subject: "Paolo Reyes",
        site: "Marikina Barangay Hall",
        timestamp: "Jul 26, 2026 - 1:20 PM",
        details: "Registration rejected due to failed health screening.",
    },
    {
        id: "LOG-1005",
        category: "Event Update",
        action: "Created",
        actor: "Alex Cruz (Super Admin)",
        subject: "Marikina Barangay Hall",
        site: "Marikina Barangay Hall",
        timestamp: "Jul 25, 2026 - 10:05 AM",
        details: "New donation event scheduled for August 2026.",
    },
    {
        id: "LOG-1006",
        category: "Staff Admin Registration",
        action: "Updated",
        actor: "Alex Cruz (Super Admin)",
        subject: "June Doe",
        site: "N/A",
        timestamp: "Jul 24, 2026 - 3:33 PM",
        details: "Staff admin contact email updated per chapter request.",
    },
    {
        id: "LOG-1007",
        category: "Event Update",
        action: "Deleted",
        actor: "Alex Cruz (Super Admin)",
        subject: "Pasig City Blood Drive",
        site: "Pasig City Blood Drive",
        timestamp: "Jul 23, 2026 - 11:52 AM",
        details: "Event cancelled and removed due to venue conflict.",
    },
    {
        id: "LOG-1008",
        category: "Donor Registration",
        action: "Approved",
        actor: "Jason Doe (Medical Professional)",
        subject: "Liza Fernandez",
        site: "Quezon City Blood Drive",
        timestamp: "Jul 22, 2026 - 2:10 PM",
        details: "Donor cleared after screening and approved for donation.",
    },
];

export default function SAOffsiteLogsPage() {
    const [logs] = useState<OffsiteLog[]>(initialLogs);

    const [activeTab, setActiveTab] = useState<CategoryTab>("All");

    const [search, setSearch] = useState("");

    const tabs: CategoryTab[] = ["All", "Donor Registration", "Staff Admin Registration", "Event Update"];

    let filteredLogs: OffsiteLog[] = logs;

    if (activeTab !== "All") {
        filteredLogs = filteredLogs.filter((log) => log.category === activeTab);
    }

    if (search.trim() !== "") {
        const query = search.trim().toLowerCase();
        filteredLogs = filteredLogs.filter(
            (log) =>
                log.subject.toLowerCase().includes(query) ||
                log.actor.toLowerCase().includes(query) ||
                log.site.toLowerCase().includes(query) ||
                log.id.toLowerCase().includes(query)
        );
    }

    const getTab = (tab: CategoryTab) => {
        let className =
            "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

        if (activeTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className += "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };

    const getActionPill = (action: LogAction) => {
        let className =
            "px-[12px] py-[6px] rounded-full text-[14px] font-semibold ";

        if (action === "Created" || action === "Approved") {
            className += "bg-[#e4f5ea] text-[#1a7a3f]";
        } else if (action === "Updated") {
            className += "bg-[#e4edf5] text-[#1a4d7a]";
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
                        Offsite Logs
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                Activity Log
                            </h2>

                            <p className="mt-1 text-[16px] text-[#5c6b73]">
                                Donor registrations, staff admin registrations, and event updates from the field.
                            </p>
                        </div>

                        <div className="flex flex-row flex-wrap gap-[10px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                    }}
                                    className={getTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-[0.25in]">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name, staff, event, or log ID"
                            className="w-full max-w-[4in] border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none focus:border-[#002940]"
                        />
                    </div>

                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {filteredLogs.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No logs found
                                </p>
                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different search term or filter.
                                </p>
                            </div>
                        ) : (
                            filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                                >
                                    <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                        <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                            <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                                {log.subject}
                                            </h2>

                                            <span className="px-[12px] py-[6px] rounded-full text-[16px] font-semibold bg-white text-[#002940]">
                                                {log.category}
                                            </span>
                                        </div>

                                        <span className={getActionPill(log.action)}>
                                            {log.action}
                                        </span>
                                    </div>

                                    <div className="p-[0.35in]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Log ID:
                                                </span>{" "}
                                                {log.id}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Performed By:
                                                </span>{" "}
                                                {log.actor}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Site / Event:
                                                </span>{" "}
                                                {log.site}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#002940]">
                                                    Timestamp:
                                                </span>{" "}
                                                {log.timestamp}
                                            </p>
                                        </div>

                                        <p className="mt-[0.2in] text-[16px] text-[#5c6b73]">
                                            {log.details}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}