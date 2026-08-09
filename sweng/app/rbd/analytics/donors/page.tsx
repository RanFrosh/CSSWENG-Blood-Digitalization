import Header from "@/components/HeaderRBD";
import { fetchFilteredDonors } from "@/actions/rbd_action";
import DonorAnalyticsClient from "./client";

export default async function DonorAnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const resolvedParams = await searchParams;
    
    const activeSearch = resolvedParams.search || "";
    const bloodFilter = resolvedParams.blood || "All";
    const sexFilter = resolvedParams.sex || "All";
    const eligibilityFilter = resolvedParams.eligibility || "All";
    const sortBy = resolvedParams.sortBy || "Default";

    const result = await fetchFilteredDonors({
        search: activeSearch,
        bloodFilter,
        sexFilter,
        eligibilityFilter,
        sortBy
    });

    if (!result.success) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center p-[0.35in]">
                    <div className="bg-white border-2 border-red-200 rounded-[16px] p-[0.5in] text-center shadow-sm max-w-lg w-full">
                        <p className="text-[24px] font-bold text-red-500 font-['Montserrat']">
                            Error Loading Donors
                        </p>
                        <p className="mt-2 text-[18px] font-semibold text-[#002940]">
                            {result.message || "Failed to load donor data."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <DonorAnalyticsClient 
                initialDonors={result.data || []}
                currentSearch={activeSearch}
                currentBlood={bloodFilter}
                currentSex={sexFilter}
                currentEligibility={eligibilityFilter}
                currentSort={sortBy}
            />
        </main>
    );
}