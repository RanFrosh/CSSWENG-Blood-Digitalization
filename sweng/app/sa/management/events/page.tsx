"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/HeaderSA";
import { executeQueryAllEvents, executeCreateEvent, executeDeleteEvent } from "@/app/event_records/event_action";
import { ViewEventsWithProvince } from "@/types/event_type";

const formatEventId = (event: ViewEventsWithProvince): string => {
    const year = event.event_date.split("-")[0];
    return `EVT-${year}-${event.id}`;
};

type TabFilter = "All" | ViewEventsWithProvince["status"];
type SortOption =
    | "Default"
    | "Date: Earliest"
    | "Date: Latest"
    | "Target Bags: High to Low"
    | "Target Bags: Low to High"
    | "Name: A-Z";

export function SAEventsPage() {
    const router = useRouter();

    const [events, setEvents] = useState<ViewEventsWithProvince[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState("");

    const [activeTab, setActiveTab] = useState<TabFilter>("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("Default");

    // Refetch the event list from the DB (mirrors sa/management/users loadUsers pattern).
    const loadEvents = useCallback(async () => {
        setEventsLoading(true);
        setEventsError("");
        const result = await executeQueryAllEvents();
        if (result.success && result.data) {
            setEvents(result.data);
        } else {
            setEventsError(result.message);
            setEvents([]);
        }
        setEventsLoading(false);
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    // Save state for the create modal
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState("");

    // State for the delete modal
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<ViewEventsWithProvince | null>(null);
    const [eventToDelete, setEventToDelete] = useState<ViewEventsWithProvince | null>(null);

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
                evt.province.toLowerCase().includes(query) ||
                formatEventId(evt).toLowerCase().includes(query)
        );
    }

    // Sorting logic
    filteredEvents.sort((a, b) => {
        if (sortBy === "Date: Earliest") {
            return a.event_date.localeCompare(b.event_date);
        } else if (sortBy === "Date: Latest") {
            return b.event_date.localeCompare(a.event_date);
        } else if (sortBy === "Target Bags: High to Low") {
            return Number(b.target_blood) - Number(a.target_blood);
        } else if (sortBy === "Target Bags: Low to High") {
            return Number(a.target_blood) - Number(b.target_blood);
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

    const openEditModal = (evt: ViewEventsWithProvince) => {
        setEventToEdit(evt);
        setFormName(evt.name);
        setFormPartner(evt.partner);
        setFormCity(evt.city);
        setFormProvince(evt.province);
        setFormDate(evt.event_date);
        setFormTargetBags(evt.target_blood.toString());
        setIsCreateModalOpen(true);
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveError("");

        const today = new Date().toISOString().split("T")[0];
        let calculatedStatus: ViewEventsWithProvince["status"] = "Upcoming";
        if (formDate === today) {
            calculatedStatus = "Ongoing";
        } else if (formDate < today) {
            calculatedStatus = "Completed";
        }

        if (eventToEdit) {
            // EDIT: no backend update method exists yet, so keep existing local-only behavior.
            setEvents((prev) =>
                prev.map((item) =>
                    item.id === eventToEdit.id
                        ? {
                              ...item,
                              name: formName,
                              partner: formPartner,
                              city: formCity,
                              province: formProvince,
                              event_date: formDate,
                              status: calculatedStatus,
                              target_blood: BigInt(parseInt(formTargetBags) || 100),
                          }
                        : item
                )
            );
            setIsCreateModalOpen(false);
            return;
        }

        // CREATE: validate then delegate to the orchestrator server action.
        if (
            !formName.trim() ||
            !formPartner.trim() ||
            !formProvince.trim() ||
            !formCity.trim() ||
            !formDate
        ) {
            setSaveError("All fields except the image are required.");
            return;
        }

        setSaveLoading(true);
        try {
            const result = await executeCreateEvent({
                name: formName.trim(),
                partner: formPartner.trim(),
                provinceName: formProvince.trim(),
                cityName: formCity.trim(),
                eventDate: formDate,
                targetBags: formTargetBags || "100",
                imgUrl: formImageLink.trim() ? formImageLink.trim() : null,
            });

            if (!result.success) {
                setSaveError(result.message);
                return;
            }

            setIsCreateModalOpen(false);
            setFormName("");
            setFormPartner("");
            setFormCity("");
            setFormProvince("");
            setFormDate("");
            setFormTargetBags("100");
            setFormImageLink("");
            loadEvents();
        } finally {
            setSaveLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        setDeleteLoading(true);
        setDeleteError("");
        try {
            const result = await executeDeleteEvent(eventToDelete.id);
            if (!result.success) {
                setDeleteError(result.message);
                return;
            }
            setEventToDelete(null);
            loadEvents();
        } finally {
            setDeleteLoading(false);
        }
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

    const getStatusPill = (status: ViewEventsWithProvince["status"]) => {
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

    const manageStaff = (evt: ViewEventsWithProvince) => {
        router.push(`/sa/management/events/${evt.id}/staff`);
    };

    if (eventsLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading events...</p>
                </div>
            </main>
        );
    }

    if (eventsError) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-red-500">{eventsError}</p>
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

                    <div className="mt-[0.25in] text-[16px]">
                        <p>
                            Showing {filteredEvents.length} result/s
                        </p>
                    </div>

                    <div className="mt-[0.25in] flex flex-col gap-[0.25in]">
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

                                        <div className="flex flex-row gap-[10px] flex-wrap">
                                            <button
                                                onClick={() => manageStaff(evt)}
                                                className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:bg-[#f0f0f0]"
                                            >
                                                Manage Staff
                                            </button>

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
                                                    {formatEventId(evt)}
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
                                                    {evt.event_date}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Target Collection:
                                                    </span>{" "}
                                                    {Number(evt.target_blood)} Bags
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-[#002940]">
                                                        Current Collected:
                                                    </span>{" "}
                                                    {Number(evt.produced_bags)} Bags
                                                </p>
                                            </div>

                                            <div className="w-full h-[1.6in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={evt.img_url ?? "/images/event.png"}
                                                    alt={evt.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/event.png"; }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

                            {saveError !== "" && (
                                <div className="mt-[0.1in] bg-[#f5e4e4] border-2 border-[#a32626] rounded-[10px] px-[12px] py-[10px]">
                                    <p className="text-[16px] font-semibold text-[#a32626]">
                                        {saveError}
                                    </p>
                                </div>
                            )}

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
                                    disabled={saveLoading}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saveLoading
                                        ? "Creating..."
                                        : eventToEdit
                                        ? "Save Changes"
                                        : "Deploy Event"}
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

                        {deleteError !== "" && (
                            <div className="mt-[0.15in] bg-[#f5e4e4] border-2 border-[#a32626] rounded-[10px] px-[12px] py-[10px]">
                                <p className="text-[16px] font-semibold text-[#a32626]">
                                    {deleteError}
                                </p>
                            </div>
                        )}

                        <div className="mt-[0.35in] flex flex-row justify-end gap-[10px]">
                            <button
                                onClick={() => setEventToDelete(null)}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                                className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#a32626] text-white cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleteLoading ? "Deleting..." : "Delete Event"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default SAEventsPage;