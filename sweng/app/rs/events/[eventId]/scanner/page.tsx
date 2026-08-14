"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

import Header from "@/components/headers/HeaderRS";

import { verifyDonorAction } from "@/utils/donor_verification";
import { claimPerkAction } from "@/app/rs/events/[eventId]/scanner/action";

export default function RSScannerPage() {
    const router = useRouter();
    const params = useParams();

    const eventId = params.eventId as string;

    const [isScanning, setIsScanning] = useState(false);

    const [donor, setDonor] = useState<any>(null);

    const [error, setError] = useState("");

    const scannerRef = useRef<Html5Qrcode | null>(null);

    const [toast, setToast] = useState({ visible: false, message: "", type: "error" });
    
    const showToast = (message: string, type: "success" | "error" = "error") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    };

    const startScanner = async () => {
        if (scannerRef.current) return;

        setError("");
        setIsScanning(true);

        // Wait for React to render the reader div
        setTimeout(async () => {
            const scanner = new Html5Qrcode("reader");
            scannerRef.current = scanner;

            try {
                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: (viewfinderWidth, viewfinderHeight) => {
                            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);

                            return {
                                width: minEdge * 0.8,
                                height: minEdge * 0.8,
                            };
                        },
                    },
                    async (decodedText) => {
                        console.log("QR Code:", decodedText);

                        await scanner.stop();
                        scanner.clear();

                        scannerRef.current = null;
                        setIsScanning(false);

                        try {
                            const result = await verifyDonorAction(decodedText);

                            if (!result.success) {
                                setError(result.message ?? "Failed to verify donor.");
                                return;
                            }

                            setDonor(result.donor);
                        } catch (error) {
                            console.error(error);
                            setError("Failed to verify QR code.");
                        }
                    },
                    () => {
                        // Ignore scan errors
                    }
                );

                setIsScanning(true);
            } catch (err) {
                console.error(err);
                setIsScanning(false);
                setError("Unable to access the camera.");
            }
        }, 100);
    };

    const stopScanner = async () => {
        if (!scannerRef.current) return;

        await scannerRef.current.stop();
        scannerRef.current.clear();

        scannerRef.current = null;
        setIsScanning(false);
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
                scannerRef.current.clear();
            }
        };
    }, []);

    const claimPerk = async () => {
        if (!donor) return;

        setError("");

        try {
            const result = await claimPerkAction(
                eventId,
                donor.qr_token
            );

            if (!result.success) {
                showToast(
                    result.message ?? "This donor cannot be checked in.", 
                    "error"
                );
                return;
            }

            showToast("Perk successfully claimed!", "success");

            setError("");
            setDonor(null);

            router.push(`/rs/events/${eventId}`);
        } catch (error) {
            console.error(error);
            showToast("Failed to claim perk.", "error");
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
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
                            Event ID: {eventId}
                        </span>
                    </div>

                    {error && (
                        <div className="mt-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700 font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={!isScanning ? startScanner : stopScanner}
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
                                onClick={claimPerk}
                                className="bg-[#002940] text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
                            >
                                Confirm Claim
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
