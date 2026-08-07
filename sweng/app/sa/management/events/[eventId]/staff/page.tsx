"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/HeaderSA";

type EventStatus = "Ongoing" | "Upcoming" | "Completed";

type BloodEvent = {
    id: string;
    name: string;
    partner: string;
    city: string;
    province: string;
    date: string;
    status: EventStatus;
    targetBags: number;
    collectedBags: number;
    imageLink: string;
};

type StaffType =
    | "Onsite Admin"
    | "Medical Professional"
    | "Lab Staff"
    | "Recovery Staff";

type StaffTypeFilter = StaffType | "All Staff Types";
type StaffTab = "Assigned Staff" | "Available Staff";

type StaffMember = {
    id: string;
    name: string;
    email: string;
    staffType: StaffType;
};

const events: BloodEvent[] = [
    {
        id: "EVT-2026-001",
        name: "Blood Donation Drive",
        partner: "Manila Doctors Hospital",
        city: "Manila",
        province: "Metro Manila",
        date: "2026-07-15",
        status: "Ongoing",
        targetBags: 100,
        collectedBags: 72,
        imageLink: "/images/event.png",
    },
];

const staffMembers: StaffMember[] = [
    {
        id: "OA-001",
        name: "Maria Santos",
        email: "maria.santos@example.com",
        staffType: "Onsite Admin",
    },
    {
        id: "OA-002",
        name: "Carlo Reyes",
        email: "carlo.reyes@example.com",
        staffType: "Onsite Admin",
    },
    {
        id: "OA-003",
        name: "Bianca Lopez",
        email: "bianca.lopez@example.com",
        staffType: "Onsite Admin",
    },
    {
        id: "OA-004",
        name: "Daniel Ramos",
        email: "daniel.ramos@example.com",
        staffType: "Onsite Admin",
    },
    {
        id: "OA-005",
        name: "Catherine Lim",
        email: "catherine.lim@example.com",
        staffType: "Onsite Admin",
    },
    {
        id: "MP-001",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        staffType: "Medical Professional",
    },
    {
        id: "MP-002",
        name: "Jason Doe",
        email: "jason.doe@example.com",
        staffType: "Medical Professional",
    },
    {
        id: "MP-003",
        name: "Angela Cruz",
        email: "angela.cruz@example.com",
        staffType: "Medical Professional",
    },
    {
        id: "MP-004",
        name: "Michael Santos",
        email: "michael.santos@example.com",
        staffType: "Medical Professional",
    },
    {
        id: "MP-005",
        name: "Patricia Gomez",
        email: "patricia.gomez@example.com",
        staffType: "Medical Professional",
    },
    {
        id: "LS-001",
        name: "June Cruz",
        email: "june.cruz@example.com",
        staffType: "Lab Staff",
    },
    {
        id: "LS-002",
        name: "Lance Garcia",
        email: "lance.garcia@example.com",
        staffType: "Lab Staff",
    },
    {
        id: "LS-003",
        name: "Rafael Torres",
        email: "rafael.torres@example.com",
        staffType: "Lab Staff",
    },
    {
        id: "LS-004",
        name: "Sofia Mendoza",
        email: "sofia.mendoza@example.com",
        staffType: "Lab Staff",
    },
    {
        id: "LS-005",
        name: "Martin Reyes",
        email: "martin.reyes@example.com",
        staffType: "Lab Staff",
    },
    {
        id: "RS-001",
        name: "Liza Fernandez",
        email: "liza.fernandez@example.com",
        staffType: "Recovery Staff",
    },
    {
        id: "RS-002",
        name: "Nico Lim",
        email: "nico.lim@example.com",
        staffType: "Recovery Staff",
    },
    {
        id: "RS-003",
        name: "Andrea Reyes",
        email: "andrea.reyes@example.com",
        staffType: "Recovery Staff",
    },
    {
        id: "RS-004",
        name: "Paolo Dizon",
        email: "paolo.dizon@example.com",
        staffType: "Recovery Staff",
    },
    {
        id: "RS-005",
        name: "Clarissa Tan",
        email: "clarissa.tan@example.com",
        staffType: "Recovery Staff",
    },
];

const assignedStaffSampleIds = [
    "OA-001",
    "OA-002",
    "MP-001",
    "MP-002",
    "LS-001",
    "LS-002",
    "RS-001",
    "RS-002",
];

const resultsPerPage = 5;

export default function SAEventStaffManagementPage() {
    const params = useParams();
    const router = useRouter();

    const eventId = params.eventId as string;
    const selectedEvent = events.find((event) => event.id === eventId);

    const [activeStaffTab, setActiveStaffTab] =
        useState<StaffTab>("Assigned Staff");

    const [staffSearch, setStaffSearch] = useState("");
    const [staffTypeFilter, setStaffTypeFilter] =
        useState<StaffTypeFilter>("All Staff Types");

    const [selectedAssignedStaffIds, setSelectedAssignedStaffIds] =
        useState<string[]>([]);
    const [selectedAvailableStaffIds, setSelectedAvailableStaffIds] =
        useState<string[]>([]);

    const staffTypeOptions: StaffTypeFilter[] = [
        "All Staff Types",
        "Onsite Admin",
        "Medical Professional",
        "Lab Staff",
        "Recovery Staff",
    ];

    const staffTabs: StaffTab[] = ["Assigned Staff", "Available Staff"];

    const assignedStaff = staffMembers.filter((staff) =>
        assignedStaffSampleIds.includes(staff.id)
    );

    const availableStaff = staffMembers.filter(
        (staff) => !assignedStaffSampleIds.includes(staff.id)
    );

    const filterStaffList = (list: StaffMember[]) => {
        let filteredList = [...list];

        if (staffTypeFilter !== "All Staff Types") {
            filteredList = filteredList.filter(
                (staff) => staff.staffType === staffTypeFilter
            );
        }

        if (staffSearch.trim() !== "") {
            const query = staffSearch.trim().toLowerCase();

            filteredList = filteredList.filter(
                (staff) =>
                    staff.name.toLowerCase().includes(query) ||
                    staff.email.toLowerCase().includes(query) ||
                    staff.id.toLowerCase().includes(query) ||
                    staff.staffType.toLowerCase().includes(query)
            );
        }

        return filteredList;
    };

    const filteredAssignedStaff = filterStaffList(assignedStaff);
    const filteredAvailableStaff = filterStaffList(availableStaff);

    const assignedStaffToDisplay = filteredAssignedStaff.slice(0, resultsPerPage);
    const availableStaffToDisplay = filteredAvailableStaff.slice(0, resultsPerPage);

    const countByStaffType = (staffType: StaffType) => {
        return assignedStaff.filter((staff) => staff.staffType === staffType).length;
    };

    const goBack = () => {
        router.push("/sa/management/events");
    };

    const getStaffTypePill = (staffType: StaffType) => {
        let className =
            "px-[10px] py-[4px] rounded-full text-[13px] font-semibold ";

        if (staffType === "Onsite Admin") {
            className += "bg-[#e4eff5] text-[#002940]";
        } else if (staffType === "Medical Professional") {
            className += "bg-[#e4f5ea] text-[#1a7a3f]";
        } else if (staffType === "Lab Staff") {
            className += "bg-[#f7edda] text-[#9a6200]";
        } else {
            className += "bg-[#f5e4e4] text-[#a32626]";
        }

        return className;
    };

    const getStaffTabClass = (tab: StaffTab) => {
        let className =
            "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";

        if (activeStaffTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className +=
                "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };

    const switchStaffTab = (tab: StaffTab) => {
        setActiveStaffTab(tab);
        setStaffSearch("");
        setStaffTypeFilter("All Staff Types");
        setSelectedAssignedStaffIds([]);
        setSelectedAvailableStaffIds([]);
    };

    const toggleAssignedStaffSelection = (staffId: string) => {
        setSelectedAssignedStaffIds((prev) => {
            if (prev.includes(staffId)) {
                return prev.filter((id) => id !== staffId);
            }

            return [...prev, staffId];
        });
    };

    const toggleAvailableStaffSelection = (staffId: string) => {
        setSelectedAvailableStaffIds((prev) => {
            if (prev.includes(staffId)) {
                return prev.filter((id) => id !== staffId);
            }

            return [...prev, staffId];
        });
    };

    const assignSelectedStaff = () => {
        if (selectedAvailableStaffIds.length === 0) {
            alert("Please select at least one staff member.");
            return;
        }

        alert(
            `${selectedAvailableStaffIds.length} staff successfully assigned to the event.`
        );

        setSelectedAvailableStaffIds([]);
    };

    const removeSelectedStaff = () => {
        if (selectedAssignedStaffIds.length === 0) {
            alert("Please select at least one assigned staff member.");
            return;
        }

        alert(
            `${selectedAssignedStaffIds.length} staff successfully removed from the event.`
        );

        setSelectedAssignedStaffIds([]);
    };

    if (!selectedEvent) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />

                <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Not Found
                        </h1>

                        <p className="mt-[0.1in] text-[18px] text-[#002940]">
                            The selected event could not be found.
                        </p>

                        <button
                            type="button"
                            onClick={goBack}
                            className="mt-[0.25in] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90"
                        >
                            Back to Event Management
                        </button>
                    </section>
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
                        Event Staff Management
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.name}
                            </h2>

                            <div className="mt-[0.15in] grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.1in] text-[18px] text-black">
                                <p>
                                    <span className="font-semibold">Event ID:</span>{" "}
                                    {selectedEvent.id}
                                </p>

                                <p>
                                    <span className="font-semibold">Partner:</span>{" "}
                                    {selectedEvent.partner}
                                </p>

                                <p>
                                    <span className="font-semibold">Location:</span>{" "}
                                    {selectedEvent.city}, {selectedEvent.province}
                                </p>

                                <p>
                                    <span className="font-semibold">Date:</span>{" "}
                                    {selectedEvent.date}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={goBack}
                            className="px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                        >
                            Back
                        </button>
                    </div>
                </section>

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                            Staff Assignment
                        </h2>

                        <div className="flex flex-row gap-[10px] flex-wrap">
                            {staffTabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => switchStaffTab(tab)}
                                    className={getStaffTabClass(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeStaffTab === "Assigned Staff" && (
                        <>
                            <div className="mt-[0.25in] flex flex-row flex-wrap text-[16px] text-[#002940] gap-x-[0.25in] gap-y-[8px]">
                                <p>
                                    <span className="font-semibold">
                                        Total Assigned:
                                    </span>{" "}
                                    {assignedStaff.length}
                                </p>

                                <p>
                                    <span className="font-semibold">
                                        Onsite Admin:
                                    </span>{" "}
                                    {countByStaffType("Onsite Admin")}
                                </p>

                                <p>
                                    <span className="font-semibold">
                                        Medical Professional:
                                    </span>{" "}
                                    {countByStaffType("Medical Professional")}
                                </p>

                                <p>
                                    <span className="font-semibold">Lab Staff:</span>{" "}
                                    {countByStaffType("Lab Staff")}
                                </p>

                                <p>
                                    <span className="font-semibold">
                                        Recovery Staff:
                                    </span>{" "}
                                    {countByStaffType("Recovery Staff")}
                                </p>
                            </div>

                            <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                                <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                    Filters
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.2in]">
                                    <div>
                                        <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                            Search Staff
                                        </label>

                                        <input
                                            type="text"
                                            value={staffSearch}
                                            onChange={(event) =>
                                                setStaffSearch(event.target.value)
                                            }
                                            placeholder="Input name, email, or ID"
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                        />
                                    </div>

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
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                        >
                                            {staffTypeOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                <div>
                                    <p>
                                        Showing {filteredAssignedStaff.length} result/s
                                    </p>
                                </div>

                                <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                    <p className="text-[16px] text-[#002940]">
                                        Selected: {selectedAssignedStaffIds.length}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedAssignedStaffIds([])}
                                        className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                    >
                                        Clear Selection
                                    </button>

                                    <button
                                        type="button"
                                        onClick={removeSelectedStaff}
                                        className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-[#a32626] text-white cursor-pointer hover:opacity-90"
                                    >
                                        Remove Staff
                                    </button>
                                </div>
                            </div>

                            <div className="mt-[0.15in] flex flex-col gap-[0.15in]">
                                {filteredAssignedStaff.length === 0 ? (
                                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                        <p className="text-[18px] font-semibold text-[#002940]">
                                            No assigned staff found
                                        </p>

                                        <p className="mt-1 text-[16px] text-[#5c6b73]">
                                            Try a different search term or staff type
                                            filter.
                                        </p>
                                    </div>
                                ) : (
                                    assignedStaffToDisplay.map((staff) => (
                                        <label
                                            key={staff.id}
                                            className="bg-white border-2 border-[#002940] rounded-[14px] p-[0.2in] flex flex-row items-center gap-[14px] cursor-pointer hover:bg-[#f9fdff]"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedAssignedStaffIds.includes(
                                                    staff.id
                                                )}
                                                onChange={() =>
                                                    toggleAssignedStaffSelection(
                                                        staff.id
                                                    )
                                                }
                                                className="w-[18px] h-[18px] cursor-pointer"
                                            />

                                            <div className="flex-1">
                                                <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                                    <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940]">
                                                        {staff.name}
                                                    </h3>

                                                    <span
                                                        className={getStaffTypePill(
                                                            staff.staffType
                                                        )}
                                                    >
                                                        {staff.staffType}
                                                    </span>
                                                </div>

                                                <div className="mt-[8px] grid grid-cols-1 md:grid-cols-2 gap-x-[0.4in] gap-y-[4px] text-[16px] text-black">
                                                    <p>
                                                        <span className="font-semibold text-[#002940]">
                                                            Staff ID:
                                                        </span>{" "}
                                                        {staff.id}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold text-[#002940]">
                                                            Email:
                                                        </span>{" "}
                                                        {staff.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))
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
                        </>
                    )}

                    {activeStaffTab === "Available Staff" && (
                        <>
                            <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                                <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">
                                    Filters
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.2in]">
                                    <div>
                                        <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                            Search Staff
                                        </label>

                                        <input
                                            type="text"
                                            value={staffSearch}
                                            onChange={(event) =>
                                                setStaffSearch(event.target.value)
                                            }
                                            placeholder="Input name, email, or ID"
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                        />
                                    </div>

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
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                        >
                                            {staffTypeOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                <div>
                                    <p>
                                        Showing {filteredAvailableStaff.length} result/s
                                    </p>
                                </div>

                                <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                    <p className="text-[16px] text-[#002940]">
                                        Selected: {selectedAvailableStaffIds.length}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedAvailableStaffIds([])}
                                        className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                    >
                                        Clear Selection
                                    </button>

                                    <button
                                        type="button"
                                        onClick={assignSelectedStaff}
                                        className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90"
                                    >
                                        Assign Staff
                                    </button>
                                </div>
                            </div>

                            <div className="mt-[0.15in] flex flex-col gap-[0.15in]">
                                {filteredAvailableStaff.length === 0 ? (
                                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                        <p className="text-[18px] font-semibold text-[#002940]">
                                            No available staff found
                                        </p>

                                        <p className="mt-1 text-[16px] text-[#5c6b73]">
                                            Try a different search term or staff type
                                            filter.
                                        </p>
                                    </div>
                                ) : (
                                    availableStaffToDisplay.map((staff) => (
                                        <label
                                            key={staff.id}
                                            className="bg-white border-2 border-[#002940] rounded-[14px] p-[0.2in] flex flex-row items-center gap-[14px] cursor-pointer hover:bg-[#f9fdff]"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedAvailableStaffIds.includes(
                                                    staff.id
                                                )}
                                                onChange={() =>
                                                    toggleAvailableStaffSelection(
                                                        staff.id
                                                    )
                                                }
                                                className="w-[18px] h-[18px] cursor-pointer"
                                            />

                                            <div className="flex-1">
                                                <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                                    <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940]">
                                                        {staff.name}
                                                    </h3>

                                                    <span
                                                        className={getStaffTypePill(
                                                            staff.staffType
                                                        )}
                                                    >
                                                        {staff.staffType}
                                                    </span>
                                                </div>

                                                <div className="mt-[8px] grid grid-cols-1 md:grid-cols-2 gap-x-[0.4in] gap-y-[4px] text-[16px] text-[#5c6b73]">
                                                    <p>
                                                        <span className="font-semibold text-[#002940]">
                                                            Staff ID:
                                                        </span>{" "}
                                                        {staff.id}
                                                    </p>

                                                    <p>
                                                        <span className="font-semibold text-[#002940]">
                                                            Email:
                                                        </span>{" "}
                                                        {staff.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))
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
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}