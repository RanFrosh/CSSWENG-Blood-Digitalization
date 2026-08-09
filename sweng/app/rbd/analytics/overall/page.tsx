import Header from "@/components/HeaderRBD";
import { fetchOverallAnalytics } from "@/actions/rbd_action";
import OverallAnalyticsClient from "./client";

export type BloodTypeData = {
    bloodType: string;
    count: number;
    pct: number;
    color: string;
};

export type EventCampaign = {
    id: string;
    name: string;
    partner: string;
    city: string;
    date: string;
    extractionGoal: number;
    totalBagsProduced: number;
};

export type OverallAnalytics = {
    totalDonors: number;
    bloodDonated: string;
    totalBagsProduced: number;
    extractionSuccessRate: string;
    extractionGoal: number;
    extractionProgress: number;
    malePct: number;
    femalePct: number;
    activeEngagementRate: number;
    bloodTypes: BloodTypeData[];
    bloodBags: BloodTypeData[];
    campaignEvents: EventCampaign[];
};

export default async function OverallAnalyticsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const resolvedParams = await searchParams;

    const startDate = resolvedParams.startDate || "";
    const endDate = resolvedParams.endDate || "";
    const partner = resolvedParams.partner || "All Partners";
    const city = resolvedParams.city || "All Cities";
    const sortBy = resolvedParams.sortBy || "recent";

    const [filteredRes, baseRes] = await Promise.all([
        fetchOverallAnalytics({
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            partner: partner !== "All Partners" ? partner : undefined,
            selectedCity: city !== "All Cities" ? city : undefined,
            sortBy
        }),
        fetchOverallAnalytics({})
    ]);

    if (!filteredRes.success || !filteredRes.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-[24px] font-bold text-red-500 mb-2">Backend Crash</p>
                    <p className="text-[18px] text-gray-700">{filteredRes.message || "Failed to load analytics"}</p>
                </div>
            </main>
        );
    }

    const allEvents = baseRes.data?.campaignEvents || [];
    const availableCities = Array.from(new Set(allEvents.map((e: any) => e.city).filter(Boolean))) as string[];
    const availablePartners = Array.from(new Set(allEvents.map((e: any) => e.partner).filter(Boolean))) as string[];

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />
            <OverallAnalyticsClient 
                analytics={filteredRes.data}
                availableCities={availableCities}
                availablePartners={availablePartners}
                currentStartDate={startDate}
                currentEndDate={endDate}
                currentPartner={partner}
                currentCity={city}
                currentSort={sortBy}
            />
        </main>
    );
}