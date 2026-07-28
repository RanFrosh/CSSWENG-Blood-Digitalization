"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/HeaderLS";
import { retrieveDonor } from "../../../ls_action";
import { ViewDonor } from "@/types/donor_type";
import DonorDetails from "@/components/DonorDetails";
import { submitDonationRecordAction } from "../../../ls_action";

export default function RecordPage() {
    
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;
    const donorId = params.donorId as string;

    const [selectedDonor, setSelectedDonor] = useState<any>(null);
    const [donorInfo, setDonorInfo] = useState<ViewDonor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [bloodBagId, setBloodBagId] = useState("");
    const [volumeCollected, setVolumeCollected] = useState("");
    const [collectionOutcome, setCollectionOutcome] = useState("");
    const [bloodQuality, setBloodQuality] = useState("");
    const [observations, setObservations] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchDonor = async () => {

            if (!donorId) 
                return;

            setIsLoading(true);
            
            try {
                const res = await retrieveDonor(donorId as string);

                if (res.success && res.data) {
                    setDonorInfo(res.data);
                    setSelectedDonor(res.data);
                } else {
                    setErrorMessage(res.message || "Failed to load donor data.");
                    setSelectedDonor(undefined);
                }
            } catch (err) {
                setErrorMessage("Database connection error.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonor();
    }, [donorId]);

    const isFormValid = 
        bloodBagId && 
        collectionOutcome && 
        (collectionOutcome === "Incomplete" || (volumeCollected && bloodQuality));

    const handleConfirmRecord = async () => {

        setIsSubmitting(true);

        const exactDate = new Date();
        const currentYear = exactDate.getFullYear();
        
        const formattedSerialNumber = `BAG-${currentYear}-${bloodBagId}`;
        
        try {
            const payload = {
                donor_id: donorId,
                event_id: eventId,
                blood_bag_id: formattedSerialNumber,
                blood_type: donorInfo?.blood,
                volume: Number(volumeCollected), 
                outcome: collectionOutcome,
                quality: bloodQuality,
                observations: observations,
                collection_date: exactDate.toISOString()
            };

            const res = await submitDonationRecordAction(payload);
            
            if (res.success) {
                setShowModal(false);
                router.push(`/ls/events/${eventId}`);
            } else {
                alert(res.message);
            }

        } catch (error) {
            console.error("Failed to submit record:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[24px] text-[#002940]">Loading donor record...</p>
                </div>
            </main>
        );
    }

    if (errorMessage || !donorInfo) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 p-[0.35in] text-red-500 font-bold">
                    Error: {errorMessage}
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black relative">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
                <section className="bg-[#f9fdff] p-[0.25in]">
                    <p className="text-[18px] font-['Montserrat'] text-[#002940]">Lab Staff</p>
                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Blood Donation Record
                    </h1>
                </section>

                {/* Donor Info Section */}
                <DonorDetails donor={{
                    ...selectedDonor,
                    bloodType: selectedDonor.blood
                }}/>

                <form className="mt-[0.35in] flex flex-col gap-[0.35in]" onSubmit={(e) => e.preventDefault()}>

                    {/* Donation Details Section */}
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Donation Details & Outcome
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 gap-[0.25in]">
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">Blood Bag ID</label>
                                <input
                                    type="text"
                                    value={bloodBagId}
                                    onChange={(e) => setBloodBagId(e.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">Volume Collected (mL)</label>
                                <input
                                    type="number"
                                    value={volumeCollected}
                                    onChange={(e) => setVolumeCollected(e.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>
                        </div>

                        <hr className="my-[0.35in] border-t-2 border-dashed border-[#c0cad0]/50" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[0.25in]">
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">Donation Outcome</p>
                                <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="collection-outcome"
                                            value="Successful"
                                            checked={collectionOutcome === "Successful"}
                                            onChange={(e) => setCollectionOutcome(e.target.value)}
                                            className="mr-2 cursor-pointer"
                                        />
                                        Successful
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="collection-outcome"
                                            value="Incomplete"
                                            checked={collectionOutcome === "Incomplete"}
                                            onChange={(e) => setCollectionOutcome(e.target.value)}
                                            className="mr-2 cursor-pointer"
                                        />
                                        Incomplete
                                    </label>
                                </div>
                            </div>

                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">Blood Quality Assessment</p>
                                <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="blood-quality"
                                            value="Pass"
                                            checked={bloodQuality === "Pass"}
                                            onChange={(e) => setBloodQuality(e.target.value)}
                                            className="mr-2 cursor-pointer"
                                        />
                                        Pass
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="blood-quality"
                                            value="Fail"
                                            checked={bloodQuality === "Fail"}
                                            onChange={(e) => setBloodQuality(e.target.value)}
                                            className="mr-2 cursor-pointer"
                                        />
                                        Fail
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Observations Section */}
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Observations
                        </h2>

                        <textarea
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            placeholder="Enter any observations or complications during collection."
                            className="mt-[0.25in] w-full min-h-[100px] border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                        />

                        <div className="mt-[0.25in] flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowModal(true)}
                                // Disable button if crucial fields are missing
                                disabled={!isFormValid || isSubmitting}
                                className={`min-w-[1.5in] px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold transition ${
                                    !bloodBagId || !collectionOutcome 
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                        : "bg-[#002940] text-white hover:bg-blue-900 cursor-pointer"
                                }`}
                            >
                                Submit Record
                            </button>
                        </div>
                    </section>
                </form>
            </div>

            {/* The Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-[16px] shadow-2xl max-w-md w-full border-2 border-[#002940]">
                        <h2 className="text-2xl font-['Montserrat'] font-bold text-[#002940] mb-4">
                            Confirm Record
                        </h2>
                        
                        <div className="mb-6 text-lg bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="mb-2"><span className="font-bold text-[#002940]">Donor:</span> {donorInfo.first_name} {donorInfo.last_name}</p>
                            <p className="mb-2"><span className="font-bold text-[#002940]">Bag ID:</span> {bloodBagId}</p>
                            <p><span className="font-bold text-[#002940]">Outcome:</span> {collectionOutcome}</p>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 font-semibold border-2 border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmRecord}
                                className="px-5 py-2 font-semibold bg-[#002940] text-white rounded-lg hover:bg-blue-900 transition"
                            >
                                Confirm & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
