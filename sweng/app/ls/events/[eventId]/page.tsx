import Header from "@/components/headers/HeaderLS";
import { verifyLabStaffEventAccess, getLabStaffQueue, getStaffStatus } from "@/actions/ls_action";
import LSEventClient from "./client";

export default async function LSEventPage({
    params,
}: {
    params: Promise<{ eventId: string }> | { eventId: string };
}) {
    const resolvedParams = await params;
    const { eventId } = resolvedParams;

    const eventRes = await verifyLabStaffEventAccess(eventId);

    if (!eventRes.success || !eventRes.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            Access Denied
                        </p>
                        <p className="mt-2 text-[18px] font-semibold text-[#002940]">
                            {eventRes.message || "Event not found or not assigned to you."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const [queueRes, staffRes] = await Promise.all([
        getLabStaffQueue(eventId),
        getStaffStatus(eventId)
    ]);

    const waitlist = queueRes.success && queueRes.data ? queueRes.data.queue : [];
    const myStation = staffRes.success && staffRes.data ? staffRes.data : null;

    return (
        <LSEventClient 
            eventId={eventId}
            selectedEvent={eventRes.data}
            initialWaitlist={waitlist}
            initialStation={myStation}
        />
    );
}