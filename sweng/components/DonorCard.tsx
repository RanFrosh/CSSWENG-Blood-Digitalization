"use client";

import { ViewDonor } from "@/types/donor_type";

interface DonorCardProps {
    donor: ViewDonor;
    onViewAnalytics: (id: string) => void;
}

export default function DonorCard({ donor, onViewAnalytics }: DonorCardProps) {

    const safeId = donor.id?.toString();

    return (
        <div className="bg-white border-2 border-[#002940] rounded-[16px] overflow-hidden shadow-sm">
            {/* Header Area */}
            <div className="bg-[#002940] text-white px-[0.35in] py-[0.15in] flex flex-row items-center justify-between gap-5 flex-wrap">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-300 font-semibold mb-1">
                        Donor ID: #{safeId}
                    </span>
                    <h2 className="text-[24px] font-['Montserrat'] font-bold">
                        {donor.first_name} {donor.last_name}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={() => onViewAnalytics(safeId)}
                    className="px-[16px] py-[8px] rounded-[10px] text-[16px] font-semibold bg-white text-[#002940] transition hover:bg-gray-200"
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
                        {donor.blood}
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
                        <span className="font-semibold text-[#002940]">Blood Status: </span>{" "}
                        {donor.verifiedBlood ? "Verified" : "Unverified"}
                    </p>
                </div>
            </div>
        </div>
    );
}