"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderOA";

// Sample queue donor structure
type QueueDonor = {
    queueNumber: string;
    donorId: string;
    name: string;
};

// Sample queue MP structure
type MedicalProfessional = {
    id: string;
    name: string;
    currentDonor?: QueueDonor; // Optional since MP can be handling a donor or not
};

// Sample last added donor structure
type LatestAddition = {
    queueNumber: string;
    donorId: string;
    name: string;
    position: number;
};

// Sample medical professionals
const medicalProfessionals: MedicalProfessional[] = [
    {
        id: "MP-001",
        name: "Janet Doe",
        currentDonor: {
            queueNumber: "001",
            donorId: "D-001",
            name: "John Doe",
        },
    },
    {
        id: "MP-002",
        name: "Jason Doe",
    },
    {
        id: "MP-003",
        name: "Jean Doe",
        currentDonor: {
            queueNumber: "003",
            donorId: "D-003",
            name: "Joan Doe",
        },
    },
    {
        id: "MP-004",
        name: "Jack Doe",
    },
];

// Sample waitlist
const waitlist: QueueDonor[] = [
    {
        queueNumber: "005",
        donorId: "D-005",
        name: "June Doe",
    },
    {
        queueNumber: "006",
        donorId: "D-006",
        name: "Janice Doe",
    }
];

// Sample last added donor
const latestAddition: LatestAddition | null = {
    queueNumber: "006",
    donorId: "D-006",
    name: "Janice Doe",
    position: 2,
};

export default function QueuePage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    // Get the current donor being handled by a medical professional
    const getCurrentDonor = (medicalProfessional: MedicalProfessional) => {
        // MP is currently free
        if (medicalProfessional.currentDonor === undefined) {
            return (
                <div className="mt-5 bg-white rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Ready for next donor
                    </p>
                </div>
            );
        // MP is currently handling a donor
        } else {
            return (
                <div className="mt-5 bg-white rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Currently Handling
                    </p>

                    <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        #{medicalProfessional.currentDonor.queueNumber}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        {medicalProfessional.currentDonor.name}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        Donor ID: {medicalProfessional.currentDonor.donorId}
                    </p>
                </div>
            );
        }
    };

    const getLatestAddition = () => {
        if (latestAddition === null) {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Latest Addition
                    </p>

                    <p className="mt-2.5 text-[18px] text-[#002940]">
                        No recent check-in available.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        Latest Addition
                    </p>

                    <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        #{latestAddition.queueNumber}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        {latestAddition.name}
                    </p>

                    <p className="mt-1 text-[18px] text-[#002940]">
                        Donor ID: {latestAddition.donorId}
                    </p>
                </div>
            );
        }
    };

    const getWaitlist = () => {
        if (waitlist.length === 0) {
            return (
                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                    <p className="text-[18px] font-semibold text-[#002940]">
                        No donors are currently waiting.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col gap-4">
                    {waitlist.map((donor, index) => (
                        <div
                            key={donor.queueNumber}
                            className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5"
                        >
                            <div className="flex flex-row items-start justify-between gap-5 flex-wrap">
                                <div>
                                    <p className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                        #{donor.queueNumber}
                                    </p>

                                    <p className="mt-2.5 text-[18px] font-semibold text-[#002940]">
                                        {donor.name}
                                    </p>

                                    <p className="mt-1 text-[18px] text-[#002940]">
                                        Donor ID: {donor.donorId}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[18px] font-semibold text-[#002940]">
                                        Position
                                    </p>

                                    <p className="mt-1 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                        {index + 1}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff]">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Page Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <div>
                        <div>
                            <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                                Onsite Admin
                            </p>

                            <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                                Queue View
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Queue Summary */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Current Queue Status
                        </h2>

                        <span className="bg-[#002940] text-white px-5 py-3.5 rounded-full text-[18px] font-semibold">
                            Event ID: {eventId}
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Donors Waiting
                            </p>

                            <p className="mt-2.5 text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                {waitlist.length}
                            </p>
                        </div>

                        {getLatestAddition()}
                    </div>
                </section>

                {/* Medical Professional Status */}
                <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Medical Professional Status
                    </h2>

                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5">
                        {medicalProfessionals.map((medicalProfessional) => (
                            <div
                                key={medicalProfessional.id}
                                className="bg-[#002940] rounded-[18px] p-5"
                            >
                                <div>
                                    <h3 className="text-[24px] font-['Montserrat'] font-bold text-white">
                                        {medicalProfessional.name}
                                    </h3>
                                </div>

                                {getCurrentDonor(medicalProfessional)}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Waitlist */}
                <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Waitlist
                    </h2>

                    <div className="mt-5">
                        {getWaitlist()}
                    </div>
                </section>
            </div>
        </main>
    );
}
