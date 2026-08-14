import Link from "next/link";
import { fetchDonorAnalytics } from "@/actions/rbd_action";
import Header from "@/components/headers/HeaderRBD";
import DonorAnalyticsClient from "./client";

export default async function DonorAnalyticsDetailsPage({
    params,
}: {
    params: Promise<{ donorId: string }> | { donorId: string };
}) {
    const resolvedParams = await params;
    const { donorId } = resolvedParams;

    const result = await fetchDonorAnalytics(donorId);
    
    if (!result.success || !result.data) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Donor Analytics Not Found
                        </h1>
                        <p className="mt-[10px] text-[18px] text-[#002940]">
                            {result.message || "The selected donor does not have available analytics."}
                        </p>
                        <Link
                            href="/rbd/analytics/donors"
                            className="mt-[0.25in] inline-block px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold hover:underline"
                        >
                            Back to Donor Analytics
                        </Link>
                    </section>
                </div>
            </main>
        );
    }

    return <DonorAnalyticsClient selectedDonor={result.data} />;
}