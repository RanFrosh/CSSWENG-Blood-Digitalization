"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ViewDonor } from "@/types/donor_type";
import { completeScreening, failScreening } from "@/actions/mp_action";
import DonorDetails from "@/components/panels/DonorDetails";

interface ScreeningClientProps {
    donor: ViewDonor;
    eventId: string;
    donorId: string;
}

export default function ScreeningClient({ donor, eventId, donorId }: ScreeningClientProps) {

    const router = useRouter();
    const [eligibility, setEligibility] = useState<"fit" | "unfit" | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [toast, setToast] = useState({ visible: false, message: "", type: "error" });

    const showToast = (message: string, type: "success" | "error" = "error") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    };

    const handleInitialSubmit = () => {
        if (!eligibility) {
            showToast("Please select FIT or UNFIT before submitting.", "error");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const executeScreening = async () => {
        setIsProcessing(true);
        
        try {
            if (eligibility === "fit") {
                const res = await completeScreening(BigInt(donorId), BigInt(eventId));
                if (!res.success) {
                    showToast(res.message, "error");
                    setIsProcessing(false);
                    setIsConfirmModalOpen(false);
                } else {
                    setIsConfirmModalOpen(false);
                    setIsProcessing(false);
                    setSuccessMessage("Donor screened successfully!");
                    setIsSuccess(true);
                }
            } else if (eligibility === "unfit") {
                const res = await failScreening(BigInt(donorId), BigInt(eventId));
                if (!res.success) {
                    showToast(res.message, "error");
                    setIsProcessing(false);
                    setIsConfirmModalOpen(false);
                } else {
                    setIsConfirmModalOpen(false);
                    setIsProcessing(false);
                    setSuccessMessage("Donor marked as unfit.");
                    setIsSuccess(true);
                }
            }
        } catch (error) {
            showToast("An unexpected error occurred.", "error");
            setIsProcessing(false);
            setIsConfirmModalOpen(false);
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
                            onClick={handleInitialSubmit}
                            className="min-w-[1.5in] bg-[#002940] text-white px-[20px] py-[10px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:bg-[#001f30] transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </section>
            </form>

            {/* Upgraded Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header */}
                        <div className="bg-[#002940] p-6 text-white text-center">
                            <h3 className="text-3xl font-bold font-['Montserrat']">Confirm Screening</h3>
                            <p className="text-blue-200 mt-2 font-medium">Verify details before proceeding</p>
                        </div>
                        
                        <div className="p-6">
                            {/* Data Grid */}
                            <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-y-4 gap-x-2">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Donor ID</p>
                                    <p className="font-bold text-[18px] text-[#002940]">{donor.id}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Screening Status</p>
                                    <p className={`font-bold text-[18px] uppercase ${eligibility === "fit" ? "text-green-600" : "text-[#fd5448]"}`}>
                                        {eligibility}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Buttons block */}
                            <div className="flex gap-4">
                                <button 
                                    disabled={isProcessing}
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={isProcessing}
                                    onClick={executeScreening}
                                    className="flex-1 px-6 py-4 rounded-xl bg-[#002940] text-white text-lg font-bold hover:bg-[#001f30] transition-colors shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center items-center cursor-pointer"
                                >
                                    {isProcessing ? "Processing..." : "Confirm & Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast Notification */}
            {toast.visible && (
                <div 
                    className={`fixed bottom-[0.35in] left-1/2 -translate-x-1/2 px-[24px] py-[12px] rounded-full shadow-lg text-white font-semibold font-['Montserrat'] flex items-center gap-[10px] z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300 ${
                        toast.type === "error" ? "bg-[#fd5448]" : "bg-[#002940]"
                    }`}
                >
                    {toast.type === "error" ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    <span className="text-[16px]">{toast.message}</span>
                </div>
            )}

            {/* Screening Success Overlay */}
            {isSuccess && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-[#002940] p-6 text-white text-center">
                            <h3 className="text-3xl font-bold font-['Montserrat']">Screening Complete</h3>
                            <p className="text-blue-200 mt-2 font-medium">The donor's screening has been recorded</p>
                        </div>

                        <div className="p-6">
                            <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                                <p className="text-xl font-bold text-[#002940]">{successMessage}</p>
                            </div>

                            <button
                                onClick={() => router.push(`/mp/events/${eventId}`)}
                                className="w-full px-6 py-4 rounded-xl bg-[#002940] text-white text-lg font-bold hover:bg-[#001f30] transition-colors shadow-md active:scale-[0.98] cursor-pointer"
                            >
                                Back to My Events
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}