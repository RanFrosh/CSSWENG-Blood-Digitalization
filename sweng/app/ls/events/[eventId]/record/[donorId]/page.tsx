"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/HeaderLS";
import { retrieveDonor } from "@/app/queue/queue_action";
import { ViewDonor } from "@/types/donor_type";

export default function RecordPage() {
    
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;
    const donorId = params.donorId as string;

    const [donorInfo, setDonorInfo] = useState<ViewDonor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [bloodBagId, setBloodBagId] = useState("");
    const [volumeCollected, setVolumeCollected] = useState("");
    const [completionTime, setCompletionTime] = useState("");
    const [collectionOutcome, setCollectionOutcome] = useState("");
    const [bloodQuality, setBloodQuality] = useState("");
    const [observations, setObservations] = useState("");

    const [showModal, setShowModal] = useState(false);

    // Fetch the donor data when the page loads
    useEffect(() => {
        const fetchDonor = async () => {

            if (!donorId) 
                return;

            setIsLoading(true);
            
            try {
                const res = await retrieveDonor(BigInt(donorId));
                if (res.success && res.data) {
                    setDonorInfo(res.data);
                } else {
                    setErrorMessage(res.message || "Failed to load donor data.");
                }
            } catch (err) {
                setErrorMessage("Database connection error.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonor();
    }, [donorId]);

    // Helper to calculate age if your DB stores DOB
    const calculateAge = (dob: string | Date) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleConfirmRecord = async () => {
        // TODO: Call your Server Action here to save the blood bag 
        // and update the queue status to 'Completed'!
        
        // Example payload ready for the backend:
        /*
        const payload = {
            blood_bag_id: bloodBagId,
            volume: volumeCollected,
            time: completionTime,
            outcome: collectionOutcome,
            quality: bloodQuality,
            observations: observations
        }
        */

        setShowModal(false);
        router.push(`/ls/events/${eventId}`);
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
                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Basic Donor Information
                        </h2>
                        <div>
                            <span className="bg-[#002940] text-white border-2 border-[#002940] px-5 py-3 rounded-full text-[18px] font-semibold">
                                Donor ID: {donorInfo.id.toString()}
                            </span>
                        </div>
                    </div>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-4 gap-[0.25in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Name</p>
                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donorInfo.first_name} {donorInfo.last_name}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Age</p>
                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {/* Using calculateAge assuming you have a dob field */}
                                {donorInfo.birthdate ? calculateAge(donorInfo.birthdate) : "N/A"}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Sex</p>
                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donorInfo.sex || "N/A"}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">Blood Type</p>
                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donorInfo.blood || "Unknown"}
                            </p>
                        </div>
                    </div>
                </section>

                <form className="mt-[0.35in] flex flex-col gap-[0.35in]" onSubmit={(e) => e.preventDefault()}>
                    {/* Donation Details Section */}
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Donation Details
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[0.25in]">
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
                            
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">Completion Time</label>
                                <input
                                    type="time"
                                    value={completionTime}
                                    onChange={(e) => setCompletionTime(e.target.value)}
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Collection Outcome Section */}
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Collection Outcome
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                                disabled={!bloodBagId || !collectionOutcome}
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
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
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
