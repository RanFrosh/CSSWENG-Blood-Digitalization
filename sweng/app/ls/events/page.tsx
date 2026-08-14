import Header from "@/components/headers/HeaderLS";
import StaffDetails from "@/components/StaffDetails";
import { getLabStaffEvents } from "@/actions/ls_action";
import LSEventsClient from "./client";

export default async function LSEventsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const resolvedParams = await searchParams;
    
    const search = resolvedParams.search || "";
    const partner = resolvedParams.partner || "All Partners";
    const city = resolvedParams.city || "All Cities";
    const sortBy = resolvedParams.sortBy || "Default";

    const [filteredRes, allRes] = await Promise.all([
        getLabStaffEvents({
            search: search || undefined,
            partner: partner !== "All Partners" ? partner : undefined,
            selectedCity: city !== "All Cities" ? city : undefined,
            sortBy
        }),
        getLabStaffEvents({ sortBy: "Default" })
    ]);

    if (!filteredRes.success) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            Error Loading Events
                        </p>
                        <p className="mt-2 text-[18px] font-semibold text-[#002940]">
                            {filteredRes.message || "Access Denied"}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const allEvents = allRes.data || [];
    const availableCities = Array.from(new Set(allEvents.map((e: any) => e.city).filter(Boolean))) as string[];
    const availablePartners = Array.from(new Set(allEvents.map((e: any) => e.partner).filter(Boolean))) as string[];

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <StaffDetails />
                <LSEventsClient 
                    initialEvents={filteredRes.data || []}
                    availableCities={availableCities}
                    availablePartners={availablePartners}
                    currentSearch={search}
                    currentPartner={partner}
                    currentCity={city}
                    currentSort={sortBy}
                />
            </div>
        </main>
    );
}