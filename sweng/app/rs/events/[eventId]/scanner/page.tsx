"use client";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/HeaderRS";

// Sample donor structure
type DonorInfo = {
    id: string;
    name: string;
    donationStatus: string;
    claimStatus: string;
};

// Sample scanned donor
const scannedDonor: DonorInfo = {
    id: "D-005",
    name: "June Doe",
    donationStatus: "Complete",
    claimStatus: "Unclaimed"
};

type EventInfo = {
    id: string;
    name: string;
};

const events: EventInfo[] = [
    {
        id: "1",
        name: "Blood Donation Drive",
    },
    {
        id: "2",
        name: "Name 2",
    },
    {
        id: "3",
        name: "Name 3",
    },
];

export default function RSScannerPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;
    const selectedEvent = events.find((event) => event.id === eventId);

    const scanDonor = () => {
        const donor = scannedDonor;

        const isConfirmed = confirm(
            `Donor ID: ${donor.id}\nName: ${donor.name}\nDonation Status: ${donor.donationStatus}\nClaim Status: ${donor.claimStatus}\n\nClaim refreshment perks?`
        );

        if (isConfirmed) {
            alert("Donor successfully claimed perks!\nPlease hand out refreshments to the donor.");
            router.push(`/rs/events/${eventId}`);
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
                                Recovery Staff
                            </p>

                            <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                                Scan Perk QR
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Instructions */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Instructions
                    </h2>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Ask the donor to open their RedBank profile.
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Ask the donor to select sponsor perks.
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Ask the donor to show the perk QR code.
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Scan the QR code using the scanner area.
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Confirm the donor details before handing out refreshments.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Scanner */}
                <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <div>
                            <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                QR Scanner
                            </h2>
                        </div>

                        <span className="bg-[#002940] text-white px-5 py-3 rounded-full text-[18px] font-semibold">
                            {selectedEvent?.name}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={scanDonor}
                        className="mt-5 w-full min-h-[540px] bg-[#002940] rounded-[18px] border-2 border-[#002940] flex flex-col items-center justify-center cursor-pointer hover:opacity-95 transition"
                    >
                        <div className="bg-white rounded-[24px] p-8">
                            <img
                                src="/images/camera.png"
                                alt="Camera scanner placeholder"
                                className="w-[216px] h-auto object-contain"
                            />
                        </div>

                        <p className="mt-8 text-[30px] font-['Montserrat'] font-bold text-white">
                            (Tap to Scan QR Code)
                        </p>
                    </button>
                </section>
            </div>
        </main>
    );
}