"use client";

import { ViewDonor } from "@/types/donor_type";

interface DonorCardProps {
    donor: ViewDonor;
    onViewAnalytics: (id: string) => void;
}

const getEligibility = (donor: any) => {

    if (donor.permanentlyDeferred) 
        return { label: "Permanently Ineligible", color: "text-red-800" };

    if (donor.active === false) 
        return { label: "Inactive", color: "text-gray-600" };
    
    // First-time donors (no date set yet)
    if (!donor.nextEligibleDate) 
        return { label: "Eligible to Donate", color: "text-green-700" };

    const today = new Date();
    const eligibleDate = new Date(donor.nextEligibleDate);

    today.setHours(0, 0, 0, 0);
    eligibleDate.setHours(0, 0, 0, 0);

    if (eligibleDate > today) {
        return { label: "In Recovery Window", color: "text-yellow-800" };
    } else {
        return { label: "Eligible to Donate", color: "text-green-700" };
    }
};

export default function DonorCard({ donor, onViewAnalytics }: DonorCardProps) {

    const safeId = donor.id?.toString();

    const eligibility = getEligibility(donor)

    return (
        <div className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm">
            {/* Header Area */}
            <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between gap-5 flex-wrap">
                    
                <h2 className="text-[24px] font-['Montserrat'] font-bold">
                    Donor ID: #{safeId}
                </h2>

                <button
                    type="button"
                    onClick={() => onViewAnalytics(safeId)}
                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] transition hover:bg-gray-200 cursor-pointer"
                >
                    View Analytics
                </button>
            </div>

            {/* Body Area */}
            <div className="p-[0.35in]">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.5in] gap-y-[0.15in] text-[18px]">

                    {/* Basic Demographics */}
                    <p>
                        <span className="font-semibold text-[#002940]">Blood Type: </span> 
                        <span className="font-bold text-[#fd5448] text-xl">{donor.blood || "N/A"}</span>
                        {donor.verifiedBlood && (
                            <span className="ml-2 text-[11px] bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase font-bold align-middle">
                                Verified
                            </span>
                        )}
                    </p>
                    
                    <p>
                        <span className="font-semibold text-[#002940]">Sex: </span> 
                        {donor.sex}
                    </p>

                    <p>
                        <span className="font-semibold text-[#002940]">Age: </span> 
                        {donor.age}
                    </p>

                    <p>
                        <span className="font-semibold text-[#002940]">Eligibility: </span> 
                        
                        <span className={`font-semibold ${eligibility.color}`}>
                            {eligibility.label}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}