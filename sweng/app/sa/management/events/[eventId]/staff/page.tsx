import Header from "@/components/HeaderSA";
import EventStaffClient from "./client";
import { getEventSummaryAction, getEventStaffAction } from "@/actions/sa_action"

export default async function SAEventStaffManagementPage({ 
    params 
}: { 
    params: Promise<{ eventId: string }> 
}) {
    const { eventId } = await params;

    const [eventRes, staffRes] = await Promise.all([
        getEventSummaryAction(eventId),
        getEventStaffAction(eventId)
    ]);
    
    if (!eventRes.success || !eventRes.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-red-200 rounded-[16px] p-[0.5in] text-center shadow-sm">
                        <h1 className="text-[32px] font-['Montserrat'] font-bold text-[#002940]">Event Not Found</h1>
                        <p className="mt-[0.1in] text-[18px]">{eventRes.message || "The selected event could not be loaded."}</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <EventStaffClient 
                event={eventRes?.data as any} 
                assignedStaff={(staffRes.data as any)?.assignedStaff || []}
                availableStaff={(staffRes.data as any)?.availableStaff || []}
            />
        </main>
    );
}