import Header from "@/components/headers/HeaderRBD";
import { fetchFilteredEvents } from "@/actions/rbd_action";
import SearchEventsClient from "./client";

export default async function SearchEventsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const resolvedParams = await searchParams;

    const activeSearch = resolvedParams.search || "";
    const statusFilter = resolvedParams.status || "All";
    const partner = resolvedParams.partner || "All Partners";
    const city = resolvedParams.city || "All Cities";
    const sortBy = resolvedParams.sortBy || "Default";

    const [filteredRes, baseRes] = await Promise.all([
        fetchFilteredEvents({
            search: activeSearch || undefined,
            status: statusFilter,
            partner: partner !== "All Partners" ? partner : undefined,
            selectedCity: city !== "All Cities" ? city : undefined,
            sortBy
        }),
        fetchFilteredEvents({}) 
    ]);

    if (!filteredRes.success || !filteredRes.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-red-200 rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            Error Loading Events
                        </p>
                        <p className="mt-2 text-[18px] font-semibold text-[#002940]">
                            {filteredRes.message || "Failed to load event data."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const allEvents = baseRes.data || [];
    const availableCities = Array.from(new Set(allEvents.map((e: any) => e.city).filter(Boolean))) as string[];
    const availablePartners = Array.from(new Set(allEvents.map((e: any) => e.partner).filter(Boolean))) as string[];

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <SearchEventsClient 
                initialEvents={filteredRes.data}
                availableCities={availableCities}
                availablePartners={availablePartners}
                currentSearch={activeSearch}
                currentStatus={statusFilter}
                currentPartner={partner}
                currentCity={city}
                currentSort={sortBy}
            />
        </main>
    );
}