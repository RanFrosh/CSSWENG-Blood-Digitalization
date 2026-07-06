"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderRBD";

type BloodTypeData = {
    bloodType: string;
    count: number;
};

type EventAnalyticsDetails = {
    id: string;
    name: string;
    location: string;
    date: string;
    time: string;
    partner: string;
    totalDonors: number;
    bloodDonated: string;
    totalBagsProduced: number;
    showUpRate: string;
    extractionGoal: number;
    extractionProgress: number;
    bloodTypes: BloodTypeData[];
};

const events: EventAnalyticsDetails[] = [
    {
        id: "1",
        name: "Blood Donation Drive",
        location: "DLSU",
        date: "2026-07-15",
        time: "9:00 AM - 4:00 PM",
        partner: "Manila Doctors Hospital",
        totalDonors: 120,
        bloodDonated: "25200 mL",
        totalBagsProduced: 72,
        showUpRate: "85%",
        extractionGoal: 100,
        extractionProgress: 72,
        bloodTypes: [
            { bloodType: "O+", count: 24 },
            { bloodType: "A+", count: 16 },
            { bloodType: "B+", count: 14 },
            { bloodType: "AB+", count: 8 },
            { bloodType: "O-", count: 5 },
            { bloodType: "A-", count: 3 },
            { bloodType: "B-", count: 1 },
            { bloodType: "AB-", count: 1 },
        ],
    }
];

export default function EventAnalyticsDetailsPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    const selectedEvent = events.find((event) => {
        return event.id === eventId;
    });

    const goBack = () => {
        router.push("/rbd/analytics/events");
    };

    if (selectedEvent === undefined) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />

                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h1 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                            Event Analytics Not Found
                        </h1>

                        <p className="mt-[10px] text-[18px] text-[#002940]">
                            The selected event does not have available analytics.
                        </p>

                        <button
                            type="button"
                            onClick={goBack}
                            className="mt-[0.25in] px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold cursor-pointer hover:bg-[#fd5448] transition"
                        >
                            Back to Event Analytics
                        </button>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                        Red Bank Director
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Event Analytics
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <div>
                            <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.name}
                            </h2>
                        </div>

                        <span className="bg-[#002940] text-white px-5 py-3 rounded-full text-[18px] font-semibold">
                            Event ID: {selectedEvent.id}
                        </span>
                    </div>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">
                        <p>
                            <span className="font-semibold text-[#002940]">
                                Partner:
                            </span>{" "}
                            {selectedEvent.partner}
                        </p>

                        <p>
                            <span className="font-semibold text-[#002940]">
                                Location:
                            </span>{" "}
                            {selectedEvent.location}
                        </p>

                        <p>
                            <span className="font-semibold text-[#002940]">
                                Date:
                            </span>{" "}
                            {selectedEvent.date}
                        </p>

                        <p>
                            <span className="font-semibold text-[#002940]">
                                Time:
                            </span>{" "}
                            {selectedEvent.time}
                        </p>
                    </div>
                </section>

                <section className="mt-[0.35in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Analytics Summary
                    </h2>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Total Donors
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.totalDonors}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Blood Donated
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.bloodDonated}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Total Bags Produced
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.totalBagsProduced}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Show-up Rate
                            </p>

                            <p className="mt-2 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.showUpRate}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-[0.35in] grid grid-cols-1 xl:grid-cols-2 gap-[0.35in]">
                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Blood Type Distribution
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedEvent.bloodTypes.map((bloodType) => (
                                <div
                                    key={bloodType.bloodType}
                                    className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-row items-center justify-between"
                                >
                                    <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                        {bloodType.bloodType}
                                    </p>

                                    <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                        {bloodType.count}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Extraction Goal Progress
                        </h2>

                        <div className="mt-[0.25in] bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Target Bags
                                </p>

                                <p className="text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                    {selectedEvent.totalBagsProduced} / {selectedEvent.extractionGoal}
                                </p>
                            </div>

                            <div className="mt-5 w-full h-[24px] bg-white border-2 border-[#c0cad0] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#002940]"
                                    style={{
                                        width: `${selectedEvent.extractionProgress}%`,
                                    }}
                                ></div>
                            </div>

                            <p className="mt-4 text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                {selectedEvent.extractionProgress}%
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={goBack}
                            className="mt-[0.35in] bg-white text-[#002940] border-2 border-[#002940] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#fd5448] hover:border-[#fd5448] hover:text-white transition"
                        >
                            Back to Event List
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}