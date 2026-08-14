"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/headers/HeaderLS";
import { retrieveDonor } from "@/actions/ls_action";
import { ViewDonor } from "@/types/donor_type";
import DonorDetails from "@/components/DonorDetails";
import { submitDonationRecordAction } from "@/actions/ls_action";

export default function RecordClient() {
    
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;
    const donorId = params.donorId as string;

    const [selectedDonor, setSelectedDonor] = useState<any>(null);
    const [donorInfo, setDonorInfo] = useState<ViewDonor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [volumeCollected, setVolumeCollected] = useState("");
    const [collectionOutcome, setCollectionOutcome] = useState("");
    const [bloodQuality, setBloodQuality] = useState("");
    const [observations, setObservations] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [toast, setToast] = useState({ visible: false, message: "", type: "error" });

    const showToast = (message: string, type: "success" | "error" = "error") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    };

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

    const isValidVolume = volumeCollected !== "" && Number(volumeCollected) >= 0 && Number(volumeCollected) <= 450;

    const isFormValid = 
        isValidVolume && 
        collectionOutcome !== "" && 
        (collectionOutcome === "Incomplete" ? true : bloodQuality !== "");

    const handleConfirmRecord = async () => {

        if (Number(volumeCollected) > 450) {
            showToast("Donation volume cannot exceed 450 mL.", "error");
            return; 
        }

        setIsSubmitting(true);

        const exactDate = new Date();

        try {
            const payload = {
                donor_id: donorId,
                event_id: eventId,
                blood_type: donorInfo?.blood,
                volume: Number(volumeCollected), 
                outcome: collectionOutcome,
                quality: bloodQuality,
                observations: observations,
                collection_date: exactDate.toISOString()
            };

            const res = await submitDonationRecordAction(payload);
            
            if (res.success) {
                showToast("Donation record saved successfully!", "success");
                setShowModal(false);
                setTimeout(() => {
                    router.push(`/ls/events/${eventId}`);
                }, 1000);
            } else {
                showToast(res.message || "Failed to save record.", "error");
            }

        } catch (error) {
            console.error("Failed to submit record:", error);
            showToast("An unexpected error occurred. Please try again.", "error");
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

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[0.25in]">
                            
                            {/* Volume */}
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5 flex flex-col">
                                <label className="text-[18px] font-semibold text-[#002940]">Volume Collected (mL)</label>
                                <div className="mt-5 flex-1 flex items-center">
                                    <input
                                        type="number"
                                        min="0"
                                        max="450"
                                        value={volumeCollected}
                                        onChange={(e) => setVolumeCollected(e.target.value)}
                                        className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] transition-colors"
                                        placeholder="e.g. 450"
                                    />
                                </div>
                            </div>

                            {/* Outcome */}
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">Donation Outcome</p>
                                <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                    <label className="cursor-pointer flex items-center">
                                        <input
                                            type="radio"
                                            name="collection-outcome"
                                            value="Successful"
                                            checked={collectionOutcome === "Successful"}
                                            onChange={(e) => setCollectionOutcome(e.target.value)}
                                            className="mr-2 cursor-pointer w-5 h-5 accent-[#002940]"
                                        />
                                        Successful
                                    </label>
                                    <label className="cursor-pointer flex items-center">
                                        <input
                                            type="radio"
                                            name="collection-outcome"
                                            value="Incomplete"
                                            checked={collectionOutcome === "Incomplete"}
                                            onChange={(e) => setCollectionOutcome(e.target.value)}
                                            className="mr-2 cursor-pointer w-5 h-5 accent-[#002940]"
                                        />
                                        Incomplete
                                    </label>
                                </div>
                            </div>

                            {/* Quality */}
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">Blood Quality</p>
                                <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                    <label className="cursor-pointer flex items-center">
                                        <input
                                            type="radio"
                                            name="blood-quality"
                                            value="Pass"
                                            checked={bloodQuality === "Pass"}
                                            onChange={(e) => setBloodQuality(e.target.value)}
                                            className="mr-2 cursor-pointer w-5 h-5 accent-[#002940]"
                                        />
                                        Pass
                                    </label>
                                    <label className="cursor-pointer flex items-center">
                                        <input
                                            type="radio"
                                            name="blood-quality"
                                            value="Fail"
                                            checked={bloodQuality === "Fail"}
                                            onChange={(e) => setBloodQuality(e.target.value)}
                                            className="mr-2 cursor-pointer w-5 h-5 accent-[#002940]"
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
                                    (!isFormValid || isSubmitting)
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
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header */}
                        <div className="bg-[#002940] p-6 text-white text-center">
                            <h3 className="text-3xl font-bold font-['Montserrat']">Confirm Record</h3>
                            <p className="text-blue-200 mt-2 font-medium">Verify details before proceeding</p>
                        </div>
                        
                        <div className="p-6">

                            <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-y-4 gap-x-2">
                                
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Donor ID</p>
                                    <p className="font-bold text-[#002940]">{donorInfo.id}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Donated Volume</p>
                                    <p className="font-bold text-[#002940]">{volumeCollected} mL</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Collection Outcome</p>
                                    <p className="font-bold text-[#002940]">{collectionOutcome}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Blood Quality</p>
                                    <p className="font-bold text-[#002940]">{bloodQuality}</p>
                                </div>

                            </div>
                            
                            {/* Buttons block */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmRecord}
                                    className="flex-1 px-6 py-4 rounded-xl bg-emerald-600 text-white text-lg font-bold hover:bg-emerald-700 transition-colors shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center items-center cursor-pointer"
                                >
                                    Confirm & Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}