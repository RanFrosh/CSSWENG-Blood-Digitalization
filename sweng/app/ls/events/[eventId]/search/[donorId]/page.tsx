import Header from "@/components/HeaderLS";
import EditPageClient from "./client";
import { getDonorEventRecord } from "@/actions/ls_action"; 

export default async function EditDonorPage({ 
    params 
}: { 
    params: Promise<{ eventId: string; donorId: string }> 
}) {
    const { eventId, donorId } = await params;

    const result = await getDonorEventRecord(eventId, donorId);

    if (!result.success || !result.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-red-200 rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            Record Locked or Not Found
                        </p>
                        <p className="mt-2 text-[18px] font-semibold text-[#002940]">
                            {result.message || "This donor has no recorded blood bag for this event."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return <EditPageClient eventId={eventId} donorRecord={result.data} />;
}