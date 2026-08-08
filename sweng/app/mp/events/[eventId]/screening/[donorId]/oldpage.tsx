"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { retrieveDonor } from "@/app/queue/queue_action";
import { ViewDonor } from "@/types/donor_type";
import Header from "@/components/HeaderMP";
import { completeScreening, failScreening } from "../../../mp_action";

export default function ScreeningPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const queueId = searchParams.get("queueId");
    const donorId = params.donorId as string;
    const eventId = params.eventId as string;
    const [eligibility, setEligibility] = useState<"fit" | "unfit" | null>(null);

    const [donor, setDonor] = useState<ViewDonor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setErrorMessage("");
        const load = async () => {
            if (!queueId) setErrorMessage("Missing queueId");
            const result = await retrieveDonor(BigInt(donorId));
            if (result.success && result.data) {
                setDonor(result.data);
            } else {
                setErrorMessage(result.message);
            }
            setIsLoading(false);
        };
        load();
    }, [donorId]);

    const screenDonor = async () => {
        if (!queueId) {
            alert("Missing queue information or eligibility selection");
            return;
        }
        
        const isConfirmed = confirm(
            `Donor ID: ${donor?.id}\nName: ${donor?.first_name} ${donor?.last_name}\n\nConfirm screening status ${eligibility}?`
        );

        if (isConfirmed) {
            if (eligibility === "fit") {
                const res = await completeScreening(BigInt(queueId!));
                if (!res.success) {
                    alert(res.message);
                } else {
                    alert(`Donor screened successfully!\nPlease direct them to the waiting area.\n\nQueue Number: #${queueId}`);
                }
                router.push(`/mp/events/${eventId}`);
            } else if (eligibility === "unfit") {
                const res = await failScreening(BigInt(queueId!));
                alert(res.message);
                router.push(`/mp/events/${eventId}`);
            } else {
                alert("Eligibility is null");
            }           
            
        }
    };

    if (isLoading) {
            return (
                <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                    <Header />
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-[24px] text-[#002940]">Loading screening...</p>
                    </div>
                </main>
            );
        }
    
    if (errorMessage) {
        return (
            <main className="flex flex-col min-h-screen bg-[#f9fdff] text-black">
                <Header />
                <div className="flex-1 p-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <p className="mt-[10px] text-[18px]">{errorMessage}</p>
                        <button onClick={() => router.back()}
                            className="mt-[0.25in] px-[18px] py-[10px] rounded-[10px] bg-[#002940] text-white text-[18px] font-semibold cursor-pointer hover:underline">
                            Back
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
                        Medical Professional
                    </p>

                    <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                        Donor Screening
                    </h1>
                </section>

                <section className="mt-[0.15in] bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Basic Donor Information
                        </h2>

                        <div>
                            <span className="bg-[#002940] text-white border-2 border-[#002940] px-5 py-3 rounded-full text-[18px] font-semibold">
                                Donor ID: {donor?.id}
                            </span>
                        </div>
                    </div>

                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-4 gap-[0.25in]">
                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Name
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donor?.first_name} {donor?.last_name}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Age
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donor?.age}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Sex
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donor?.sex}
                            </p>
                        </div>

                        <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                            <p className="text-[18px] font-semibold text-[#002940]">
                                Blood Type
                            </p>

                            <p className="mt-2 text-[24px] font-['Montserrat'] font-bold text-[#002940]">
                                {donor?.blood}
                            </p>
                        </div>
                    </div>
                </section>

                <form className="mt-[0.35in] flex flex-col gap-[0.35in]">
                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Vital Signs
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[0.25in]">
                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Temperature
                                </label>

                                <input
                                    type="text"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Blood Pressure
                                </label>

                                <input
                                    type="text"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Pulse Rate
                                </label>

                                <input
                                    type="text"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                <label className="text-[18px] font-semibold text-[#002940]">
                                    Weight
                                </label>

                                <input
                                    type="text"
                                    className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Medical History
                        </h2>

                        <div className="mt-[0.25in] grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Taken pain relievers within the past 48 hours
                                </p>

                                <div className="mt-4 flex flex-row gap-6 text-[18px] text-[#002940]">
                                    <label><input type="radio" name="pain-relievers" /> Yes</label>
                                    <label><input type="radio" name="pain-relievers" /> No</label>
                                </div>
                            </div>

                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Taken aspirin within the past 5 days
                                </p>

                                <div className="mt-4 flex flex-row gap-6 text-[18px] text-[#002940]">
                                    <label><input type="radio" name="aspirin" /> Yes</label>
                                    <label><input type="radio" name="aspirin" /> No</label>
                                </div>
                            </div>

                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Taken antibiotics within the past 2 weeks
                                </p>

                                <div className="mt-4 flex flex-row gap-6 text-[18px] text-[#002940]">
                                    <label><input type="radio" name="antibiotics" /> Yes</label>
                                    <label><input type="radio" name="antibiotics" /> No</label>
                                </div>
                            </div>

                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[14px] p-5">
                                <p className="text-[18px] font-semibold text-[#002940]">
                                    Taking anti-epileptic medication
                                </p>

                                <div className="mt-4 flex flex-row gap-6 text-[18px] text-[#002940]">
                                    <label><input type="radio" name="anti-epileptic" /> Yes</label>
                                    <label><input type="radio" name="anti-epileptic" /> No</label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                        <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                            Final Screening Decision
                        </h2>

                        <div className="mt-[0.25in]">
                            <div className="bg-[#f9fdff] border-2 border-[#c0cad0] rounded-[10px] p-5 text-[18px] text-[#002940]">
                                <div className="flex flex-row gap-6 flex-wrap">
                                    <label><input type="radio" onChange={() => setEligibility("fit")} name="eligibility-result" /> FIT</label>
                                    <label><input type="radio" onChange={() => setEligibility("unfit")} name="eligibility-result" /> UNFIT</label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[0.35in] flex justify-end">
                            <button
                                type="button"
                                onClick={screenDonor}
                                className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:underline"
                            >
                                Submit
                            </button>
                        </div>
                    </section>
                </form>
            </div>
        </main>
    );
}
