import Header from "@/components/HeaderSA";
import EventStaffClient from "./client";
// import { getEventDetailsAction, getEventStaffAction } from "@/actions/sa_actions";

export default async function SAEventStaffManagementPage({ 
    params 
}: { 
    params: Promise<{ eventId: string }> 
}) {
    const { eventId } = await params;

    // 1. Fetch real data from your database orchestrator
    // const eventRes = await getEventDetailsAction(eventId);
    // const staffRes = await getEventStaffAction(eventId);

    // Placeholder until we wire up the DB
    const eventRes = { success: true, data: null }; // Replace with real fetch
    
    if (!eventRes.success || !eventRes.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-red-200 rounded-[16px] p-[0.5in] text-center shadow-sm">
                        <h1 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">Event Not Found</h1>
                        <p className="mt-[0.1in] text-[18px]">The selected event could not be found.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <EventStaffClient 
                event={eventRes.data} 
                // staff={staffRes.data} 
            />
        </main>
    );
}