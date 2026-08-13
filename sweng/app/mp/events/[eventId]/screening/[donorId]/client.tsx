"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ViewDonor } from "@/types/donor_type";
import { completeScreening, failScreening } from "@/actions/mp_action";
import DonorDetails from "@/components/DonorDetails";

interface ScreeningClientProps {
    donor: ViewDonor;
    eventId: string;
    donorId: string;
}

export default function ScreeningClient({ donor, eventId, donorId }: ScreeningClientProps) {
    const router = useRouter();
    const [eligibility, setEligibility] = useState<"fit" | "unfit" | null>(null);

    const screenDonor = async () => {
        if (!eligibility) {
            alert("Please select FIT or UNFIT before submitting.");
            return;
        }
        
        const isConfirmed = confirm(
            `Donor ID: ${donor.id}\nName: ${donor.first_name} ${donor.last_name}\n\nConfirm screening status ${eligibility}?`
        );

        if (isConfirmed) {
            if (eligibility === "fit") {

                const res = await completeScreening(BigInt(donorId), BigInt(eventId));

                if (!res.success) {
                    alert(res.message);
                } else {
                    alert(`Donor screened successfully!\nPlease direct them to the lab area.`);
                    router.push(`/mp/events/${eventId}`);
                }
            } else if (eligibility === "unfit") {

                const res = await failScreening(BigInt(donorId), BigInt(eventId));
                if (!res.success) {
                    alert(res.message);
                } else {
                    alert("Donor marked as unfit.");
                    router.push(`/mp/events/${eventId}`);
                }
            } 
        }
    };

    return (
        <div className="flex-1 bg-[#f9fdff] p-[0.35in]">
            <section className="bg-[#f9fdff] p-[0.25in]">
                <p className="text-[18px] font-['Montserrat'] text-[#002940]">
                    Medical Professional
                </p>
                <h1 className="text-[54px] font-['Montserrat'] font-bold text-[#002940]">
                    Donor Screening
                </h1>
            </section>

            <DonorDetails
                donor={{
                    id: String(donor.id),
                    name: `${donor.first_name} ${donor.last_name}`,
                    sex: donor.sex || "N/A",
                    bloodType: donor.blood || "N/A",
                    age: donor.age || 0,
                    email: (donor as any).email || "", 
                    mobile_no: (donor as any).mobile_no || "",
                    location: (donor as any).location || "",
                    verifiedBlood: (donor as any).verifiedBlood || false,
                    active: (donor as any).active ?? true,
                    height: (donor as any).height || 0,
                    weight: (donor as any).weight || 0,
                    assessment_status: (donor as any).assessment_status || "",
                }} 
            />

            <form className="mt-[0.35in] flex flex-col gap-[0.35in]">
                {/* Vital Signs Section */}
                <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Vital Signs
                    </h2>
                    <div className="mt-[0.25in] grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-[0.25in]">
                        <div className="flex flex-col gap-[5px]">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Body Temperature (°C) <span className="text-[#c0392b]"></span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 36.5"
                                className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>
                        <div className="flex flex-col gap-[5px]">
                            <label className="text-[18px] font-semibold text-[#002940]">
                                Blood Pressure (mmHg) <span className="text-[#c0392b]"></span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 120/80"
                                className="w-full border-2 border-[#c0cad0] rounded-[10px] px-[12px] py-[8px] text-[18px] outline-none focus:border-[#002940]"
                            />
                        </div>
                    </div>
                </section>

                {/* Medical History Section */}
                <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Medical History
                    </h2>
                    <p className="mt-2 text-[15px] text-[#5a6b74]">
                        All items are required. Please answer Yes or No for each.
                    </p>
                    <div className="mt-[0.25in] flex flex-col divide-y-2 divide-[#e4eaee] border-2 border-[#c0cad0] rounded-[14px] overflow-hidden">
                        {[
                            { name: "pain-relievers", question: "Taken pain relievers within the past 48 hours" },
                            { name: "aspirin", question: "Taken aspirin within the past 5 days" },
                            { name: "antibiotics", question: "Taken antibiotics within the past 2 weeks" },
                            { name: "anti-epileptic", question: "Currently taking anti-epileptic medication" },
                            { name: "recent-illness", question: "Experienced fever, cold, flu, or infection within the past 2 weeks" },
                            { name: "chronic-condition", question: "Diagnosed with a chronic illness (e.g. diabetes, hypertension, heart disease)" },
                            { name: "recent-surgery", question: "Undergone surgery or major dental work within the past 6 months" },
                            { name: "recent-tattoo", question: "Gotten a tattoo, piercing, or acupuncture within the past 6 months" },
                            { name: "recent-donation", question: "Donated blood within the past 3 months" },
                            { name: "pregnancy", question: "Currently pregnant, breastfeeding, or given birth within the past 6 months" },
                            { name: "alcohol", question: "Consumed alcohol within the past 24 hours" },
                            { name: "travel-history", question: "Traveled outside the country within the past 12 months" },
                            { name: "blood-transfusion", question: "Received a blood transfusion within the past 12 months" },
                            { name: "hepatitis-jaundice", question: "Had hepatitis, jaundice, or liver disease" },
                            { name: "hiv-std", question: "Diagnosed with or treated for HIV/AIDS or any sexually transmitted disease" },
                            { name: "malaria", question: "Had malaria or lived in/traveled to a malaria-risk area within the past 3 years" },
                            { name: "allergies", question: "Have any known drug or food allergies" },
                            { name: "vaccination", question: "Received any vaccination within the past 4 weeks" },
                            { name: "weight-loss", question: "Experienced unexplained weight loss within the past 6 months" },
                            { name: "bleeding-disorder", question: "Diagnosed with a bleeding or clotting disorder" },
                            { name: "cancer-history", question: "Have a history of cancer or malignant disease" },
                            { name: "high-risk-contact", question: "Had close contact with a person with a serious infectious disease within the past 4 weeks" },
                        ].map((item, index) => (
                            <div key={item.name} className="flex flex-row items-center justify-between gap-4 flex-wrap bg-[#f9fdff] p-5">
                                <div className="flex flex-row items-center gap-4">
                                    <span className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#002940] text-white text-[16px] font-semibold shrink-0">
                                        {index + 1}
                                    </span>
                                    <p className="text-[18px] font-semibold text-[#002940]">
                                        {item.question}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-6 text-[18px] text-[#002940] shrink-0">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name={item.name} /> Yes
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name={item.name} /> No
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final Decision Section */}
                <section className="bg-white border-2 border-[#c0cad0] rounded-[16px] p-[0.35in] shadow-sm">
                    <h2 className="text-[30px] font-['Montserrat'] font-bold text-[#002940]">
                        Final Screening Decision <span className="text-[#c0392b]">*</span>
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
                            className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#001f30] transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </section>
            </form>
        </div>
    );
}