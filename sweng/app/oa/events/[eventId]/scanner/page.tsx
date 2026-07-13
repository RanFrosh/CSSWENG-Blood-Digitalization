"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

import Header from "@/components/HeaderOA";

import { verifyDonorAction } from "@/app/actions/donor-verification";
import { checkInDonorAction } from "@/app/actions/oa-checkin";

export default function ScannerPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    const [isScanning, setIsScanning] = useState(false);
    const [donor, setDonor] = useState<any>(null);

    const scannerRef = useRef<Html5Qrcode | null>(null);

    const startScanner = async () => {
        if (scannerRef.current) return;

        setIsScanning(true);

        // Give React time to render the #reader div
        setTimeout(async () => {
            const scanner = new Html5Qrcode("reader");
            scannerRef.current = scanner;

            try {
                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: {
                            width: 250,
                            height: 250,
                        },
                    },
                    async (decodedText) => {
                        await scanner.stop();
                        await scanner.clear();

                        scannerRef.current = null;
                        setIsScanning(false);

                        try {
                            const result = await verifyDonorAction(decodedText);

                            if (!result.success) {
                                alert(result.message);
                                return;
                            }

                            setDonor(result.donor);
                        } catch (error) {
                            console.error(error);
                            alert("Failed to verify QR code.");
                        }
                    },
                    () => {
                        // Ignore scan errors
                    }
                );
            } catch (err) {
                console.error(err);
                setIsScanning(false);
                alert("Unable to access the camera.");
            }
        }, 100);
    };

    const stopScanner = async () => {
        if (!scannerRef.current) return;

        await scannerRef.current.stop();
        await scannerRef.current.clear();

        scannerRef.current = null;
        setIsScanning(false);
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
                try {
                    scannerRef.current.clear();
                } catch {}
            }
        };
    }, []);

    const checkin = async () => {
        if (!donor) return;

        try {
            const result = await checkInDonorAction(
                eventId,
                donor.qr_token
            );

            if (!result.success) {
                alert(result.message);
                return;
            }

            alert("Donor successfully checked in!");

            setDonor(null);

            router.push(`/oa/events/${eventId}`);
        } catch (error) {
            console.error(error);
            alert("Failed to check in donor.");
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                {/* Page Title */}
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <div>
                        <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                            Onsite Admin
                        </p>

                        <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                            Scan Donor QR
                        </h1>
                    </div>
                </section>

                {/* Instructions */}
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Instructions
                    </h2>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Ask the donor to open their RedBank profile.
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Ask the donor to show their account QR code.
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Scan the QR code using the scanner area.
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[16px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Confirm the donor details before check-in.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Scanner */}
                <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            QR Scanner
                        </h2>

                        <span className="bg-[#002940] text-white px-5 py-3 rounded-full text-[18px] font-semibold">
                            Event ID: {eventId}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={isScanning ? stopScanner : startScanner}
                        className="mt-5 w-full min-h-[540px] bg-[#002940] rounded-[18px] border-2 border-[#002940] flex flex-col items-center justify-center cursor-pointer hover:opacity-95 transition overflow-hidden"
                    >
                        {!isScanning ? (
                            <>
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
                            </>
                        ) : (
                            <div
                                id="reader"
                                className="w-full h-[540px]"
                            />
                        )}
                    </button>
                </section>

                {/* Donor Information */}
                {donor && (
                    <section className="mt-8 bg-white border-2 border-[#c0cad0] rounded-[18px] p-5 shadow-sm">
                        <h2 className="text-[30px] font-bold text-[#002940]">
                            Donor Information
                        </h2>

                        <div className="mt-4 space-y-2 text-lg">
                            <p>
                                <strong>Name:</strong>{" "}
                                {donor.first_name}{" "}
                                {donor.middle_name ? donor.middle_name + " " : ""}
                                {donor.last_name}
                            </p>

                            <p>
                                <strong>Blood Type:</strong> {donor.blood}
                            </p>

                            <p>
                                <strong>Age:</strong> {donor.age}
                            </p>

                            <p>
                                <strong>Email:</strong> {donor.email}
                            </p>

                            <p>
                                <strong>Mobile:</strong> {donor.mobile_no}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={checkin}
                                className="bg-[#002940] text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
                            >
                                Confirm Check-in
                            </button>

                            <button
                                onClick={() => setDonor(null)}
                                className="bg-gray-300 px-8 py-3 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}