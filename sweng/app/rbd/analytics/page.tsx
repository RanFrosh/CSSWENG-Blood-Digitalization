import Link from "next/link";
import Header from "@/components/HeaderRBD";
import StaffDetails from "@/components/StaffDetails";

export default async function AnalyticsPage() {

    return (

        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <h1 className="text-[50px] font-['Montserrat'] font-bold text-[#002940]">
                        Welcome, Director.
                    </h1>
                </section>

                {/* Staff Details */}
                <section className="mt-[0.15in]">
                    <StaffDetails />
                </section>

                {/* Action Cards */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Actions
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[0.25in]">
                        <Link
                            href="/rbd/analytics/events"
                            className="block bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition group"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                View Event Analytics
                            </h3>
                            <p className="mt-[8px] text-[16px]">
                                View event-specific analytics.
                            </p>
                        </Link>

                        <Link
                            href="/rbd/analytics/donors"
                            className="block bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition group"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                View Donor Analytics
                            </h3>
                            <p className="mt-[8px] text-[16px]">
                                View donor-specific analytics.
                            </p>
                        </Link>

                        <Link
                            href="/rbd/analytics/overall"
                            className="block bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition group"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                View Overall Analytics
                            </h3>
                            <p className="mt-[8px] text-[16px]">
                                View overall analytics with filter settings.
                            </p>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}