"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/HeaderLS";

type RealDonorRecord = {
    id: string;
    name: string;
    sex: string;
    bloodType: string;
    bloodBagId: string | null;
    volumeCollected: string | number | null;
    completionTime: string | null;
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
    const [bagIdInput, setBagIdInput] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!donorRecord.bloodBagId) {
            setErrorMsg("No blood bag ID was assigned during the event.");
            return;
        }
        
        if (bagIdInput.trim().toUpperCase() === donorRecord.bloodBagId.toUpperCase()) {
            setIsUnlocked(true);
            setErrorMsg("");
        } else {
            setErrorMsg("Invalid Blood Bag ID for this donor.");
        }
    };

    const submitEditRequest = () => {
        const isConfirmed = confirm(
            `Donor ID: ${donorRecord.id}\nName: ${donorRecord.name}\n\nBlood Bag ID: ${donorRecord.bloodBagId}\n\nSubmit edit request?`
        );

        if (isConfirmed) {
            alert("Edit request successfully sent for review");
            router.push(`/ls/events/${eventId}`);
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#f9fdff]">
            <Header />

            <div className="flex-1 bg-[#f9fdff] p-[0.35in]">

                {!isUnlocked ? (
                    <div className="mt-[0.5in] flex justify-center">
                        <form 
                            onSubmit={handleUnlock}
                            className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.5in] shadow-sm max-w-[500px] w-full flex flex-col items-center gap-4 text-center"
                        >
                            <div className="w-16 h-16 bg-[#e2e8ec] text-[#002940] rounded-full flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            
                            <h2 className="text-[28px] font-['Montserrat'] font-bold text-[#002940]">
                                Enter Blood Bag Serial Number
                            </h2>
                            <p className="text-[16px] text-[#5c6b73]">
                                Enter the blood bag serial number to access this lab record.
                            </p>

                            <input
                                type="text"
                                value={bagIdInput}
                                onChange={(e) => setBagIdInput(e.target.value)}
                                placeholder="Enter serial number..."
                                className="mt-4 w-full border-2 border-[#c0cad0] rounded-[10px] px-[16px] py-[12px] text-[18px] text-center font-bold outline-none focus:border-[#002940]"
                            />

                            {errorMsg && <p className="text-red-500 font-semibold">{errorMsg}</p>}

                            <button
                                type="submit"
                                className="mt-2 w-full bg-[#002940] text-white px-[20px] py-[12px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:opacity-90"
                            >
                                Unlock Record
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                            <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Basic Donor Information
                                </h2>
                                <div>
                                    <span className="bg-[#002940] text-white border-2 border-[#002940] px-5 py-3 rounded-full text-[18px] font-semibold">
                                        Donor ID: {donorRecord.id}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-3 gap-[0.25in]">
                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <p className="text-[18px] font-semibold text-[#002940]">Name</p>
                                    <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">{donorRecord.name}</p>
                                </div>

                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <p className="text-[18px] font-semibold text-[#002940]">Sex</p>
                                    <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">{donorRecord.sex}</p>
                                </div>

                                <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                    <p className="text-[18px] font-semibold text-[#002940]">Blood Type</p>
                                    <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">{donorRecord.bloodType}</p>
                                </div>
                            </div>
                        </section>

                        <form className="mt-[0.35in] flex flex-col gap-[0.35in]">
                            <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Donation Details
                                </h2>

                                <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-1 xl:grid-cols-4 gap-[0.25in]">
                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Blood Bag ID</label>
                                        <input
                                            type="text"
                                            defaultValue={donorRecord.bloodBagId || ""}
                                            disabled
                                            className="w-full border-2 border-[#c0cad0] bg-gray-100 rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Volume Collected (mL)</label>
                                        <input
                                            type="text"
                                            defaultValue={donorRecord.volumeCollected || ""}
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Completion Time</label>
                                        <input
                                            type="time"
                                            defaultValue={donorRecord.completionTime || ""}
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[5px]">
                                        <label className="text-[18px] font-semibold text-[#002940]">Blood Type Verification</label>
                                        <input
                                            type="text"
                                            defaultValue={donorRecord.bloodType}
                                            className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Collection Outcome
                                </h2>

                                <div className="mt-[0.25in] grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                        <p className="text-[18px] font-semibold text-[#002940]">Donation Outcome</p>
                                        <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                            <label><input type="radio" name="collection-outcome" defaultChecked className="mr-2"/>Successful</label>
                                            <label><input type="radio" name="collection-outcome" className="mr-2"/>Incomplete</label>
                                        </div>
                                    </div>

                                    <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                        <p className="text-[18px] font-semibold text-[#002940]">Blood Quality</p>
                                        <div className="mt-5 flex flex-row gap-5 flex-wrap text-[18px] text-[#002940]">
                                            <label><input type="radio" name="blood-quality" defaultChecked className="mr-2"/>Pass</label>
                                            <label><input type="radio" name="blood-quality" className="mr-2"/>Fail</label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                                <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                                    Observations
                                </h2>
                                <textarea
                                    className="mt-[0.25in] w-full min-h-[0.25in] border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                                <div className="mt-[0.25in] flex justify-end">
                                    <button
                                        type="button"
                                        onClick={submitEditRequest}
                                        className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:opacity-90"
                                    >
                                        Submit Record
                                    </button>
                                </div>
                            </section>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}