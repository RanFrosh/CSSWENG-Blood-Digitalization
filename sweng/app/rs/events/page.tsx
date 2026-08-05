import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { orm } from "@/db/drizzle";
import { serverSupa } from "@/db/supaserver";

import { event_log } from "@/db/models/event_log";
import { assigned_staff } from "@/db/models/assigned_staff";

import RSClient, { AssignedEvent } from "./client";

export default async function RSEventsPage() {
    const supabase = await serverSupa();

    const {
        data: { user },
    } = await supabase.auth.getUser();

<<<<<<< HEAD
    if (!user) {
        redirect("/login");
=======
// Sample events
const assignedEvents: AssignedEvent[] = [
    {
        id: "1",
        name: "Name 1",
        location: "Location 1",
        date: "Date 1",
        time: "Time 1",
        partner: "Partner 1",
        status: "Ongoing",
    },
    {
        id: "2",
        name: "Name 2",
        location: "Location 2",
        date: "Date 2",
        time: "Time 2",
        partner: "Partner 2",
        status: "Upcoming",
    },
    {
        id: "3",
        name: "Name 3",
        location: "Location 3",
        date: "Date 3",
        time: "Time 3",
        partner: "Partner 3",
        status: "Completed",
    },
];

export default function RSEventsPage() {
    const router = useRouter();

    // Set the initial active tab to "Ongoing"
    const [activeTab, setActiveTab] = useState<EventTab>("Ongoing");

    // For join event popup
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [eventCode, setEventCode] = useState("");
    
    // Status filters
    const tabs: EventTab[] = ["Ongoing", "Upcoming", "Completed", "All"];

    // Initialize filtered events
    let filteredEvents: AssignedEvent[] = [];

    // Filter events based on selected filter
    if (activeTab === "All") {
        filteredEvents = assignedEvents;
    } else {
        filteredEvents = assignedEvents.filter((event) => event.status === activeTab);
>>>>>>> e10d50f (added join event)
    }

    const eventsFromDb = await orm
        .select()
        .from(assigned_staff)
        .innerJoin(event_log, eq(assigned_staff.event_log_id, event_log.id))
        .where(eq(assigned_staff.staff_id, user.id));

    const assignedEvents: AssignedEvent[] = eventsFromDb.map((row) => ({
        id: row.event_log.id.toString(),
        name: row.event_log.name,
        location: `${row.event_log.street}, ${row.event_log.zip_code}`,
        date: row.event_log.event_date ?? "No date",
        time: `${row.event_log.start_time} - ${row.event_log.end_time ?? ""}`,
        partner: row.event_log.partner,
        status: row.event_log.status,
    }));

<<<<<<< HEAD
    return <RSClient assignedEvents={assignedEvents} />;
=======
        if (activeTab === tab) {
            // selected tab
            className += "bg-[#002940] border-[#002940] text-white font-bold";
        } else {
            // unselected tab
            className += "bg-white border-[#002940] text-[#002940] hover:bg-[#002940] hover:text-white";
        }

        return className;
    };
    
    // Create button to open event if it is ongoing
    const createActionButton = (event: AssignedEvent) => {
        if (event.status === "Ongoing") {
            return (
                <button
                    onClick={() => openEvent(event)}
                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] cursor-pointer hover:underline"
                >
                    Open Event
                </button>
            );
        } else {
            return null;
        }
    };

    const openJoinModal = () => {
        setEventCode("");
        setIsJoinModalOpen(true);
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff]">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        Welcome, {RSUser.name}!
                    </h1>
                </section>

                {/* Staff Details */}
                <section className="mt-[0.15in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Staff Details
                        </h2>

                        <div className="mt-[0.15in] flex flex-col gap-[5px] text-[18px]">
                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Name:
                                </span>{" "}
                                {RSUser.name}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Role:
                                </span>{" "}
                                {RSUser.role}
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Staff ID:
                                </span>{" "}
                                {RSUser.id}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Assigned Events */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <div className="flex flex-row items-center justify-between flex-wrap gap-[0.25in]">
                        <div>
                            <h2 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">
                                Assigned Events
                            </h2>
                        </div>

                        {/* Tabs and Join Event */}
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

                            <button
                                type="button"
                                onClick={openJoinModal}
                                className="px-[20px] py-[10px] rounded-full bg-[#002940] border-2 border-[#002940] text-white font-bold text-[16px] cursor-pointer hover:bg-white hover:text-[#002940] transition"
                            >
                                + Join Event
                            </button>
                        </div>
                    </div>

                    {/* Event Cards */}
                    <div className="mt-[0.35in] flex flex-col gap-[0.25in]">
                        {filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm"
                            >
                                {/* Event Header */}
                                <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center gap-[0.15in]">
                                        <h2 className="text-[24px] font-['Montserrat'] font-bold">
                                            {event.name}
                                        </h2>

                                        <span className="px-[12px] py-[6px] rounded-full text-[16px] font-semibold bg-white text-[#002940]">
                                            {event.status}
                                        </span>
                                    </div>

                                    {createActionButton(event)}
                                </div>

                                {/* Event Details */}
                                <div className="p-[0.35in]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Partner:
                                            </span>{" "}
                                            {event.partner}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Location:
                                            </span>{" "}
                                            {event.location}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Date:
                                            </span>{" "}
                                            {event.date}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-[#002940]">
                                                Time:
                                            </span>{" "}
                                            {event.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {isJoinModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-[0.35in] z-50">
                    <div className="bg-white rounded-[16px] p-[0.35in] max-w-[4.5in] w-full shadow-lg">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Join Event
                        </h2>

                        <form className="mt-[0.2in] flex flex-col gap-[0.15in]">
                            <div>
                                <label className="block text-[14px] font-semibold text-[#002940] mb-1">
                                    Event Code
                                </label>

                                <input
                                    type="text"
                                    value={eventCode}
                                    onChange={(event) => setEventCode(event.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[16px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="mt-[0.2in] flex flex-row justify-end gap-[10px]">
                                <button
                                    type="button"
                                    onClick={() => setIsJoinModalOpen(false)}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-white border-2 border-[#002940] text-[#002940] cursor-pointer hover:bg-[#002940] hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsJoinModalOpen(false)}
                                    className="px-[20px] py-[10px] rounded-[10px] text-[16px] font-semibold bg-[#002940] text-white cursor-pointer hover:opacity-90"
                                >
                                    Join Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
>>>>>>> e10d50f (added join event)
}