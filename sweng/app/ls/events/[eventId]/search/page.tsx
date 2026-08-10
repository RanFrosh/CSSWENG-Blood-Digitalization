import Header from "@/components/HeaderLS";
import DonorSearchClient from "./client";
import { getEventDonorsAction } from "@/actions/ls_action";

export default async function DonorSearchPage({ params }: { params: { eventId: string } }) {
    
    const response = await getEventDonorsAction(params.eventId);
    
    const realDonors = response.data || [];

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <DonorSearchClient 
                eventId={params.eventId} 
                initialDonors={realDonors} 
            />
        </main>
    );
}