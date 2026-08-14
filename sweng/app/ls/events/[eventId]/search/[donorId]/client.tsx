"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/headers/HeaderLS";
import { submitEditRequestAction } from "@/actions/ls_action";

type RealDonorRecord = {
    id: string;
    bloodType: string;
    bloodBagId: string | null;
    volumeCollected: string | number | null;
    completionTime: string | null;
    outcome?: string | null;
    quality?: string | null;
    observations?: string | null;
};

export default function EditPageClient({ 
    eventId, 
    donorRecord 
}: { 
    eventId: string; 
    donorRecord: RealDonorRecord;
}) {
    const router = useRouter();
    
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [unlockError, setUnlockError] = useState("");
    const [submitError, setSubmitError] = useState("");
    
    const [showModal, setShowModal] = useState(false);

    const [volume, setVolume] = useState(donorRecord.volumeCollected || "");
    const [time, setTime] = useState(donorRecord.completionTime || "");
    const [outcome, setOutcome] = useState(donorRecord.outcome || "Successful");
    const [quality, setQuality] = useState(donorRecord.quality || "Pass");
    const [observations, setObservations] = useState(donorRecord.observations || "");
    const [verifiedBloodType, setVerifiedBloodType] = useState(donorRecord.bloodType || "");

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!donorRecord.bloodBagId) {
            setUnlockError("No blood bag ID was assigned during the event.");
            return;
        }
        
        if (bagIdInput.trim().toUpperCase() === donorRecord.bloodBagId.toUpperCase()) {
            setIsUnlocked(true);
            setUnlockError("");
        } else {
            setUnlockError("Invalid Blood Bag ID.");
        }
    };
    
    const [bagIdInput, setBagIdInput] = useState("");

    const handleConfirmRecord = async () => {
        setIsSubmitting(true);
        setSubmitError("");

        const payload = {
            blood_type: verifiedBloodType,
            volume_ml: volume,
            completion_time: time,
            outcome: outcome,
            quality: quality,
            observations: observations,
        };

        const response = await submitEditRequestAction({
            blood_bag_serial: donorRecord.bloodBagId as string,
            donor_id: donorRecord.id,
            event_id: eventId,
            payload: payload
        });

        if (response.success) {
            setShowModal(false);
            setIsSuccess(true);
        } else {
            setSubmitError(response.message || "An unknown error occurred.");
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff] relative">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">

                {!isUnlocked && !isSuccess && (
                    <div className="mt-[0.5in] flex justify-center">
                        <form onSubmit={handleUnlock} className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.5in] shadow-sm max-w-[500px] w-full flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 bg-[#e2e8ec] text-[#002940] rounded-full flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            
                            <h2 className="text-[28px] font-['Montserrat'] font-bold text-[#002940]">Verify Blood Bag</h2>
                            <p className="text-[16px] text-[#5c6b73]">Enter the blood bag serial number to access the lab record.</p>

                            <input
                                type="text"
                                value={bagIdInput}
                                onChange={(e) => setBagIdInput(e.target.value)}
                                placeholder="e.g. BAG-2026-50"
                                className="mt-4 w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[12px] text-[18px] text-center font-bold outline-none focus:border-[#002940] uppercase"
                            />

                            {unlockError && <p className="text-red-500 font-semibold">{unlockError}</p>}

                            <button type="submit" className="mt-2 w-full bg-[#002940] text-white px-[20px] py-[12px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:opacity-90">
                                Enter
                            </button>
                        </form>
                    </div>
                )}

                {isUnlocked && !isSuccess && (
                    <div className="animate-in fade-in duration-500">

                        <div className="mt-[0.35in] flex flex-col gap-[0.35in]">
                            <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">Lab Verification Details</h2>
                                <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Blood Bag ID</label>
                                        <input type="text" defaultValue={donorRecord.bloodBagId || ""} disabled className="w-full border-2 border-[#c0cad0] bg-gray-100 rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none font-bold"/>
                                    </div>
                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Verified Blood Type</label>
                                        <select value={verifiedBloodType} onChange={(e) => setVerifiedBloodType(e.target.value)} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940] bg-white cursor-pointer">
                                            <option value="">Select...</option>
                                            <option value="O+">O+</option><option value="O-">O-</option>
                                            <option value="A+">A+</option><option value="A-">A-</option>
                                            <option value="B+">B+</option><option value="B-">B-</option>
                                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Volume Collected (mL)</label>
                                        <input type="number" min="0" max="450" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"/>
                                    </div>
                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Completion Time</label>
                                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"/>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">Collection Outcome</h2>
                                <div className="mt-[0.25in] grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                        <p className="text-[18px] font-semibold text-[#002940]">Donation Outcome</p>
                                        <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                            <label className="cursor-pointer"><input type="radio" name="collection-outcome" value="Successful" checked={outcome === "Successful"} onChange={(e) => setOutcome(e.target.value)} className="mr-2"/>Successful</label>
                                            <label className="cursor-pointer"><input type="radio" name="collection-outcome" value="Incomplete" checked={outcome === "Incomplete"} onChange={(e) => setOutcome(e.target.value)} className="mr-2"/>Incomplete</label>
                                        </div>
                                    </div>
                                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                        <p className="text-[18px] font-semibold text-[#002940]">Blood Quality</p>
                                        <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                            <label className="cursor-pointer"><input type="radio" name="blood-quality" value="Pass" checked={quality === "Pass"} onChange={(e) => setQuality(e.target.value)} className="mr-2"/>Pass</label>
                                            <label className="cursor-pointer"><input type="radio" name="blood-quality" value="Fail" checked={quality === "Fail"} onChange={(e) => setQuality(e.target.value)} className="mr-2"/>Fail</label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">Observations</h2>
                                <textarea value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Add any medical notes, complications, or observations here..." className="mt-[0.25in] w-full min-h-[1.5in] border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"/>
                                <div className="mt-[0.25in] flex justify-end">
                                    <button type="button" onClick={() => setShowModal(true)} className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                                        Submit Record
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {isSuccess && (
                    <div className="mt-[1in] flex justify-center animate-in zoom-in-95 duration-500">
                        <div className="bg-white border-2 border-emerald-200 rounded-[24px] p-[0.5in] shadow-xl max-w-[600px] w-full flex flex-col items-center gap-6 text-center">
                            
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                            
                            <div>
                                <h2 className="text-[36px] font-['Montserrat'] font-bold text-[#002940]">
                                    Request Submitted
                                </h2>
                                <p className="text-[18px] text-[#5c6b73] mt-2">
                                    The edit request for Blood Bag <span className="font-bold text-[#002940]">#{donorRecord.bloodBagId}</span> has been sent for review.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                                <button 
                                    onClick={() => router.push(`/ls/events/${eventId}/search`)}
                                    className="flex-1 bg-emerald-600 text-white px-[20px] py-[16px] rounded-[12px] text-[18px] font-bold cursor-pointer hover:bg-emerald-700 transition-colors shadow-md"
                                >
                                    Process Next Bag
                                </button>
                                <button 
                                    onClick={() => router.push(`/ls/events`)}
                                    className="flex-1 bg-white border-2 border-[#002940] text-[#002940] px-[20px] py-[16px] rounded-[12px] text-[18px] font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    Return Home
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="bg-[#002940] p-6 text-white text-center">
                            <h3 className="text-3xl font-bold font-['Montserrat']">Confirm Record</h3>
                            <p className="text-blue-200 mt-2 font-medium">Verify lab details before proceeding</p>
                        </div>
                        
                        <div className="p-6">
                            {submitError && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-semibold text-red-800">{submitError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-y-4 gap-x-2">
                                <div className="col-span-2 border-b border-gray-200 pb-2 mb-2">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Blood Bag ID</p>
                                    <p className="font-bold text-[#002940] text-xl">{donorRecord.bloodBagId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Verified Blood Type</p>
                                    <p className="font-bold text-[#fd5448]">{verifiedBloodType || "Not Set"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Donated Volume</p>
                                    <p className="font-bold text-[#002940]">{volume} mL</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Collection Outcome</p>
                                    <p className="font-bold text-[#002940]">{outcome}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Blood Quality</p>
                                    <p className="font-bold text-[#002940]">{quality}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleConfirmRecord}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-4 rounded-xl bg-emerald-600 text-white text-lg font-bold hover:bg-emerald-700 transition-colors shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center items-center cursor-pointer"
                                >
                                    {isSubmitting ? "Submitting..." : "Confirm & Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}