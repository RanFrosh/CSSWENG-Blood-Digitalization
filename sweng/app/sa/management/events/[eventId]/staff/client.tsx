"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type StaffType = "Onsite Admin" | "Medical Professional" | "Lab Staff" | "Recovery Staff";
type StaffTypeFilter = StaffType | "All Staff Types";
type StaffTab = "Assigned Staff" | "Available Staff";

export type StaffMember = {
    id: string;
    name: string;
    email: string;
    staffType: StaffType;
};

export type EventSummary = {
    id: string;
    name: string;
    partner: string;
    city: string;
    province: string;
    date: string;
};

type EventStaffClientProps = {
    event: EventSummary;
    assignedStaff: StaffMember[];
    availableStaff: StaffMember[];
};

export default function EventStaffClient({ event, assignedStaff, availableStaff }: EventStaffClientProps) {
    
    const router = useRouter();

    const [activeStaffTab, setActiveStaffTab] = useState<StaffTab>("Assigned Staff");
    const [staffSearch, setStaffSearch] = useState("");
    const [staffTypeFilter, setStaffTypeFilter] = useState<StaffTypeFilter>("All Staff Types");

    const [selectedAssignedStaffIds, setSelectedAssignedStaffIds] = useState<string[]>([]);
    const [selectedAvailableStaffIds, setSelectedAvailableStaffIds] = useState<string[]>([]);
    
    const resultsPerPage = 5;
    const staffTypeOptions: StaffTypeFilter[] = [
        "All Staff Types",
        "Onsite Admin",
        "Medical Professional",
        "Lab Staff",
        "Recovery Staff",
    ];
    const staffTabs: StaffTab[] = ["Assigned Staff", "Available Staff"];

    const filterStaffList = (list: StaffMember[]) => {
        let filteredList = [...list];

        if (staffTypeFilter !== "All Staff Types") {
            filteredList = filteredList.filter((staff) => staff.staffType === staffTypeFilter);
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

    const goBack = () => router.push("/sa/management/events");

    const switchStaffTab = (tab: StaffTab) => {
        setActiveStaffTab(tab);
        setStaffSearch("");
        setStaffTypeFilter("All Staff Types");
        setSelectedAssignedStaffIds([]);
        setSelectedAvailableStaffIds([]);
    };

    const toggleAssignedStaffSelection = (staffId: string) => {
        setSelectedAssignedStaffIds((prev) =>
            prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
        );
    };

    const toggleAvailableStaffSelection = (staffId: string) => {
        setSelectedAvailableStaffIds((prev) =>
            prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
        );
    };

    // --- Server Action Placeholders ---
    const assignSelectedStaff = async () => {
        if (selectedAvailableStaffIds.length === 0) {
            alert("Please select at least one staff member.");
            return;
        }
        // TODO: Call Server Action to INSERT into event_staff table here!
        alert(`Simulated: ${selectedAvailableStaffIds.length} staff assigned to the event.`);
        setSelectedAvailableStaffIds([]);
    };

    const removeSelectedStaff = async () => {
        if (selectedAssignedStaffIds.length === 0) {
            alert("Please select at least one assigned staff member.");
            return;
        }
        // TODO: Call Server Action to DELETE from event_staff table here!
        alert(`Simulated: ${selectedAssignedStaffIds.length} staff removed from the event.`);
        setSelectedAssignedStaffIds([]);
    };

    const getStaffTypePill = (staffType: StaffType) => {
        let className = "px-[10px] py-[4px] rounded-full text-[13px] font-semibold ";
        if (staffType === "Onsite Admin") 
            className += "bg-[#e4eff5] text-[#002940]";
        else if (staffType === "Medical Professional") className += "bg-[#e4f5ea] text-[#1a7a3f]";
        else if (staffType === "Lab Staff") className += "bg-[#f7edda] text-[#9a6200]";
        else className += "bg-[#f5e4e4] text-[#a32626]";
        return className;
    };

    const getStaffTabClass = (tab: StaffTab) => {
        let className = "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";
        if (activeStaffTab === tab) className += "bg-[#002940] border-[#002940] text-white font-bold";
        else className += "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        return className;
    };

    return (
        <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
            {/* Header Titles */}
            <section className="bg-[#f9fdff] p-[0.25in]">
                <p className="text-[18px] font-['Montserrat'] text-[#002940]">Super Admin</p>
                <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">Event Staff Management</h1>
            </section>

            {/* Event Summary Card */}
            <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                    <div>
                        <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">{event.name}</h2>
                        <div className="mt-[0.15in] grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.1in] text-[18px] text-black">
                            <p><span className="font-semibold">Event ID:</span> {event.id}</p>
                            <p><span className="font-semibold">Partner:</span> {event.partner}</p>
                            <p><span className="font-semibold">Location:</span> {event.city}, {event.province}</p>
                            <p><span className="font-semibold">Date:</span> {event.date}</p>
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

            {/* Staff Management Section */}
            <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                    <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">Staff Assignment</h2>
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

                {/* Assigned Staff Tab Content */}
                {activeStaffTab === "Assigned Staff" && (
                    <>
                        <div className="mt-[0.25in] flex flex-row flex-wrap text-[16px] text-[#002940] gap-x-[0.25in] gap-y-[8px]">
                            <p><span className="font-semibold">Total Assigned:</span> {assignedStaff.length}</p>
                            <p><span className="font-semibold">Onsite Admin:</span> {countByStaffType("Onsite Admin")}</p>
                            <p><span className="font-semibold">Medical Professional:</span> {countByStaffType("Medical Professional")}</p>
                            <p><span className="font-semibold">Lab Staff:</span> {countByStaffType("Lab Staff")}</p>
                            <p><span className="font-semibold">Recovery Staff:</span> {countByStaffType("Recovery Staff")}</p>
                        </div>

                        {/* Filters */}
                        <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                            <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">Filters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.2in]">
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">Search Staff</label>
                                    <input
                                        type="text"
                                        value={staffSearch}
                                        onChange={(e) => setStaffSearch(e.target.value)}
                                        placeholder="Input name, email, or ID"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">Filter by Staff Type</label>
                                    <select
                                        value={staffTypeFilter}
                                        onChange={(e) => setStaffTypeFilter(e.target.value as StaffTypeFilter)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                    >
                                        {staffTypeOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Selection Actions */}
                        <div className="mt-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                            <div><p>Showing {filteredAssignedStaff.length} result/s</p></div>
                            <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                <p className="text-[16px] text-[#002940]">Selected: {selectedAssignedStaffIds.length}</p>
                                <button
                                    onClick={() => setSelectedAssignedStaffIds([])}
                                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                >
                                    Clear Selection
                                </button>
                                <button
                                    onClick={removeSelectedStaff}
                                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-[#a32626] text-white cursor-pointer hover:opacity-90"
                                >
                                    Remove Staff
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="mt-[0.15in] flex flex-col gap-[0.15in]">
                            {filteredAssignedStaff.length === 0 ? (
                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                    <p className="text-[18px] font-semibold text-[#002940]">No assigned staff found</p>
                                    <p className="mt-1 text-[16px] text-[#5c6b73]">Try a different search term or staff type filter.</p>
                                </div>
                            ) : (
                                assignedStaffToDisplay.map((staff) => (
                                    <label key={staff.id} className="bg-white border-2 border-[#002940] rounded-[14px] p-[0.2in] flex flex-row items-center gap-[14px] cursor-pointer hover:bg-[#f9fdff]">
                                        <input
                                            type="checkbox"
                                            checked={selectedAssignedStaffIds.includes(staff.id)}
                                            onChange={() => toggleAssignedStaffSelection(staff.id)}
                                            className="w-[18px] h-[18px] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                                <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940]">{staff.name}</h3>
                                                <span className={getStaffTypePill(staff.staffType)}>{staff.staffType}</span>
                                            </div>
                                            <div className="mt-[8px] grid grid-cols-1 md:grid-cols-2 gap-x-[0.4in] gap-y-[4px] text-[16px] text-black">
                                                <p><span className="font-semibold text-[#002940]">Staff ID:</span> {staff.id}</p>
                                                <p><span className="font-semibold text-[#002940]">Email:</span> {staff.email}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* Available Staff Tab Content */}
                {activeStaffTab === "Available Staff" && (
                    <>
                        {/* Filters */}
                        <div className="mt-[0.25in] border-2 border-[#c0cad0] rounded-[14px] p-[0.2in] bg-[#f9fdff]">
                            <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940] mb-[0.15in]">Filters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.2in]">
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">Search Staff</label>
                                    <input
                                        type="text"
                                        value={staffSearch}
                                        onChange={(e) => setStaffSearch(e.target.value)}
                                        placeholder="Input name, email, or ID"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">Filter by Staff Type</label>
                                    <select
                                        value={staffTypeFilter}
                                        onChange={(e) => setStaffTypeFilter(e.target.value as StaffTypeFilter)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white cursor-pointer focus:border-[#002940]"
                                    >
                                        {staffTypeOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Selection Actions */}
                        <div className="mt-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                            <div><p>Showing {filteredAvailableStaff.length} result/s</p></div>
                            <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                <p className="text-[16px] text-[#002940]">Selected: {selectedAvailableStaffIds.length}</p>
                                <button
                                    onClick={() => setSelectedAvailableStaffIds([])}
                                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                >
                                    Clear Selection
                                </button>
                                <button
                                    onClick={assignSelectedStaff}
                                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90"
                                >
                                    Assign Staff
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="mt-[0.15in] flex flex-col gap-[0.15in]">
                            {filteredAvailableStaff.length === 0 ? (
                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                    <p className="text-[18px] font-semibold text-[#002940]">No available staff found</p>
                                    <p className="mt-1 text-[16px] text-[#5c6b73]">Try a different search term or staff type filter.</p>
                                </div>
                            ) : (
                                availableStaffToDisplay.map((staff) => (
                                    <label key={staff.id} className="bg-white border-2 border-[#002940] rounded-[14px] p-[0.2in] flex flex-row items-center gap-[14px] cursor-pointer hover:bg-[#f9fdff]">
                                        <input
                                            type="checkbox"
                                            checked={selectedAvailableStaffIds.includes(staff.id)}
                                            onChange={() => toggleAvailableStaffSelection(staff.id)}
                                            className="w-[18px] h-[18px] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="flex flex-row items-center gap-[10px] flex-wrap">
                                                <h3 className="text-[20px] font-['Montserrat'] font-bold text-[#002940]">{staff.name}</h3>
                                                <span className={getStaffTypePill(staff.staffType)}>{staff.staffType}</span>
                                            </div>
                                            <div className="mt-[8px] grid grid-cols-1 md:grid-cols-2 gap-x-[0.4in] gap-y-[4px] text-[16px] text-[#5c6b73]">
                                                <p><span className="font-semibold text-[#002940]">Staff ID:</span> {staff.id}</p>
                                                <p><span className="font-semibold text-[#002940]">Email:</span> {staff.email}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}