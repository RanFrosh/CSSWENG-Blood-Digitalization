"use client";
import { useRouter } from "next/navigation";

import Header from "@/components/HeaderRBD";

export default function AnalyticsPage() {
    const router = useRouter();

    const goEvents = () => {
        router.push(`/rbd/analytics/events`);
    };

    const goDonor = () => {
        router.push(`/rbd/analytics/donors`);
    };

    const goOverall = () => {
        router.push(`/rbd/analytics/overall`);
    };

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
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                        <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                            Staff Details
                        </h2>

                        <div className="mt-[0.15in] flex flex-col gap-[5px] text-[18px]">
                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Name:
                                </span>{" "}
                                Jillian Doe
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Role:
                                </span>{" "}
                                Red Bank Director
                            </p>

                            <p>
                                <span className="font-semibold text-[#002940]">
                                    Staff ID:
                                </span>{" "}
                                RBD-001
                            </p>
                        </div>
                    </div>
                </section>

                {/* Action Cards */}
                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.25in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Actions
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[0.25in]">
                        <button
                            onClick={goEvents}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                View Event Analytics
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                View event-specific analytics.
                            </p>
                        </button>

                        <button
                            onClick={goDonor}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                View Donor Analytics
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                View donor-specific analytics.
                            </p>
                        </button>

                        <button
                            onClick={goOverall}
                            className="bg-white border-2 border-[#002940] rounded-[16px] p-[0.25in] text-left cursor-pointer hover:bg-[#002940] hover:text-white transition"
                        >
                            <h3 className="text-[24px] font-['Montserrat'] font-bold">
                                View Overall Analytics
                            </h3>

                            <p className="mt-[8px] text-[16px]">
                                View overall analytics with filter settings.
                            </p>
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}