import Header from "@/components/headers/HeaderMP";
import { retrieveDonor } from "@/app/queue/queue_action";
import ScreeningClient from "./client";

export default async function ScreeningPage({
    params,
}: {
    params: Promise<{ donorId: string; eventId: string }>;
}) {
    const resolvedParams = await params;
    const { donorId, eventId } = resolvedParams;

    const result = await retrieveDonor(BigInt(donorId));

    if (!result.success || !result.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <p className="mt-[10px] text-[18px] text-red-600 font-semibold">
                            {result.message || "Failed to load donor data."}
                        </p>

                        <a 
                            href={`/mp/events/${eventId}`}
                            className="inline-block mt-[0.25in] px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold cursor-pointer hover:underline"
                        >
                            Back to Event
                        </a>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <ScreeningClient 
                donor={result.data} 
                eventId={eventId} 
                donorId={donorId} 
            />
        </main>
    );
}