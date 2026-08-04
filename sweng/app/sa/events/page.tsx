"use client";
import { useState } from "react";
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

const initialEvents: BloodEvent[] = [
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
    {
        id: "EVT-2026-002",
        name: "Corporate CSR Bloodletting",
        partner: "BPO Partner Inc.",
        city: "Taguig",
        province: "Metro Manila",
        date: "2026-08-10",
        status: "Upcoming",
        targetBags: 150,
        collectedBags: 0,
        imageLink: "/images/event.png",
    },
    {
        id: "EVT-2026-003",
        name: "Alumni Association Drive",
        partner: "DLSU Alumni Chapter",
        city: "Manila",
        province: "Metro Manila",
        date: "2026-05-20",
        status: "Completed",
        targetBags: 80,
        collectedBags: 85,
        imageLink: "/images/event.png",
    },
];

type TabFilter = "All" | EventStatus;
type SortOption = 
    | "Default" 
    | "Date: Earliest" 
    | "Date: Latest" 
    | "Target Bags: High to Low" 
    | "Target Bags: Low to High" 
    | "Name: A-Z";

export function SAEventsPage() {
    const [events, setEvents] = useState<BloodEvent[]>(initialEvents);
    const [activeTab, setActiveTab] = useState<TabFilter>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<BloodEvent | null>(null);
    const [eventToDelete, setEventToDelete] = useState<BloodEvent | null>(null);

    // Form Fields State
    const [formName, setFormName] = useState("");
    const [formPartner, setFormPartner] = useState("");
    const [formCity, setFormCity] = useState("");
    const [formProvince, setFormProvince] = useState("");
    const [formDate, setFormDate] = useState("");
    const [formTargetBags, setFormTargetBags] = useState("100");
    const [formImageLink, setFormImageLink] = useState("");

    const tabs: TabFilter[] = ["All", "Ongoing", "Upcoming", "Completed"];
    const sortOptions: SortOption[] = [
        "Default",
        "Date: Earliest",
        "Date: Latest",
        "Target Bags: High to Low",
        "Target Bags: Low to High",
        "Name: A-Z",
    ];

    let filteredEvents = [...events];
    if (activeTab !== "All") {
        filteredEvents = filteredEvents.filter((evt) => evt.status === activeTab);
    }
    if (search.trim() !== "") {
        const query = search.trim().toLowerCase();
        filteredEvents = filteredEvents.filter(
            (evt) =>
                evt.name.toLowerCase().includes(query) ||
                evt.partner.toLowerCase().includes(query) ||
                evt.city.toLowerCase().includes(query) ||
                evt.id.toLowerCase().includes(query)
        );
    }

    // Sorting logic
    filteredEvents.sort((a, b) => {
        if (sortBy === "Date: Earliest") {
            return a.date.localeCompare(b.date);
        } else if (sortBy === "Date: Latest") {
            return b.date.localeCompare(a.date);
        } else if (sortBy === "Target Bags: High to Low") {
            return b.targetBags - a.targetBags;
        } else if (sortBy === "Target Bags: Low to High") {
            return a.targetBags - b.targetBags;
        } else if (sortBy === "Name: A-Z") {
            return a.name.localeCompare(b.name);
        }
        return 0; // Default
    });

    const openCreateModal = () => {
        setFormName("");
        setFormPartner("");
        setFormCity("");
        setFormProvince("");
        setFormDate("");
        setFormTargetBags("100");
        setFormImageLink("");
        setEventToEdit(null);
        setIsCreateModalOpen(true);
    };

    const openEditModal = (evt: BloodEvent) => {
        setEventToEdit(evt);
        setFormName(evt.name);
        setFormPartner(evt.partner);
        setFormCity(evt.city);
        setFormProvince(evt.province);
        setFormDate(evt.date);
        setFormTargetBags(evt.targetBags.toString());
        setFormImageLink(evt.imageLink);
        setIsCreateModalOpen(true);
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        
        const today = new Date().toISOString().split("T")[0];
        let calculatedStatus: EventStatus = "Upcoming";
        if (formDate === today) {
            calculatedStatus = "Ongoing";
        } else if (formDate < today) {
            calculatedStatus = "Completed";
        }

        if (eventToEdit) {
            setEvents((prev) =>
                prev.map((item) =>
                    item.id === eventToEdit.id
                        ? {
                              ...item,
                              name: formName,
                              partner: formPartner,
                              city: formCity,
                              province: formProvince,
                              date: formDate,
                              status: calculatedStatus,
                              targetBags: parseInt(formTargetBags) || 100,
                              imageLink: formImageLink,
                          }
                        : item
                )
            );
        } else {
            const newEvent: BloodEvent = {
                id: `EVT-2026-00${events.length + 1}`,
                name: formName,
                partner: formPartner,
                city: formCity,
                province: formProvince,
                date: formDate,
                status: calculatedStatus,
                targetBags: parseInt(formTargetBags) || 100,
                collectedBags: 0,
                imageLink: formImageLink,
            };
            setEvents([newEvent, ...events]);
        }
        setIsCreateModalOpen(false);
    };

    const confirmDelete = () => {
        if (!eventToDelete) return;
        setEvents((prev) => prev.filter((item) => item.id !== eventToDelete.id));
        setEventToDelete(null);
    };

    const getTabClass = (tab: TabFilter) => {
        let className =
            "px-[20px] py-[10px] rounded-full border-2 font-['Montserrat'] text-[16px] cursor-pointer transition ";
        if (activeTab === tab) {
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            className += "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }
        return className;
    };

    const getStatusPill = (status: EventStatus) => {
        let className = "px-[12px] py-[6px] rounded-full text-[14px] font-semibold ";
        if (status === "Ongoing") {
            className += "bg-[#e4f5ea] text-[#1a7a3f]";
        } else if (status === "Upcoming") {
            className += "bg-[#e4eff5] text-[#002940]";
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
                        Event Management
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                Blood Drive Events
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
                            <button
                                onClick={openCreateModal}
                                className="px-[20px] py-[10px] rounded-full bg-[#002940] border-2 border-[#002940] text-white font-bold text-[16px] cursor-pointer hover:bg-white hover:text-[#002940] transition"
                            >
                                + Create Event
                            </button>
                        </div>
                    </div>

                    {/* Filters Container (Search Bar & Sort By) */}
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
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Input event name, partner, city, or ID"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[10px] text-[16px] outline-none bg-white focus:border-[#002940]"
                                />
                            </div>

                            <div className="w-full sm:w-[3in]">
                                <label className="block text-[14px] font-semibold text-[#002940] mb-[6px]">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                        {filteredEvents.length === 0 ? (
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] text-center">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    No events found
                                </p>
                                <p className="mt-1 text-[16px] text-[#5c6b73]">
                                    Try a different search term, sort option, or tab filter.
                                </p>
                            </div>
                        ) : (
                            filteredEvents.map((evt) => (
                                <div
                                    key={evt.id}
                                    className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                                >
                                    <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between flex-wrap gap-[0.15in]">
                                        <div className="flex flex-row items-center gap-[0.15in] flex-wrap">
                                            <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                                {evt.name}
                                            </h2>
                                            <span className={getStatusPill(evt.status)}>
                                                {evt.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-row gap-[10px]">
                                            <button
                                                onClick={() => openEditModal(evt)}
                                                className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:bg-[#f0f0f0]"
                                            >
                                                Edit Event
                                            </button>
                                            <button
                                                onClick={() => setEventToDelete(evt)}
                                                className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#a32626] cursor-pointer hover:bg-[#fef2f2]"
                                            >
                                                Delete Event
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-[0.35in]">
                                        <div className="grid grid-cols-1 xl:grid-cols-[1fr_2.6in] gap-[0.35in] items-start">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Event ID:
                                                    </span>{" "}
                                                    {evt.id}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Corporate Partner:
                                                    </span>{" "}
                                                    {evt.partner}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Location:
                                                    </span>{" "}
                                                    {evt.city}, {evt.province}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Scheduled Date:
                                                    </span>{" "}
                                                    {evt.date}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Target Collection:
                                                    </span>{" "}
                                                    {evt.targetBags} Bags
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Current Collected:
                                                    </span>{" "}
                                                    {evt.collectedBags} Bags
                                                </p>
                                            </div>

                                            <div className="w-full h-[1.6in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={evt.imageLink || "/images/event-placeholder.png"}
                                                    alt={evt.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Create / Edit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            {eventToEdit ? "Edit Event Parameters" : "Create New Blood Drive Event"}
                        </h2>
                        <form onSubmit={handleSaveEvent} className="mt-[0.2in] flex flex-col gap-[0.15in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g. Community Blood Donation"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Corporate Sponsor / Partner
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formPartner}
                                    onChange={(e) => setFormPartner(e.target.value)}
                                    placeholder="e.g. Acme Corporation"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Event Image Link
                                </label>

                                <input
                                    type="text"
                                    value={formImageLink}
                                    onChange={(e) => setFormImageLink(e.target.value)}
                                    placeholder="Paste image link here"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-[10px]">
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formCity}
                                        onChange={(e) => setFormCity(e.target.value)}
                                        placeholder="City"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                        Province
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formProvince}
                                        onChange={(e) => setFormProvince(e.target.value)}
                                        placeholder="Province"
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-[10px]">
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                        Target Bags
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formTargetBags}
                                        onChange={(e) => setFormTargetBags(e.target.value)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                    />
                                </div>
                            </div>

                            <div className="mt-[0.2in] flex flex-row justify-end gap-[10px]">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90"
                                >
                                    {eventToEdit ? "Save Changes" : "Deploy Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {eventToDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Delete this event?
                        </h2>
                        <p className="mt-[0.15in] text-[16px] text-[#002940]">
                            Are you sure you want to delete <span className="font-semibold">{eventToDelete.name}</span>? 
                            This action is permanent and cannot be undone.
                        </p>
                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                onClick={() => setEventToDelete(null)}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#a32626] text-white cursor-pointer hover:opacity-90"
                            >
                                Delete Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default SAEventsPage;